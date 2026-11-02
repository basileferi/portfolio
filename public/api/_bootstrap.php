<?php
declare(strict_types=1);

/**
 * Shared helpers for the portfolio API (public + back office).
 *
 * Files whose name starts with "_" and config.php are blocked from direct
 * HTTP access by api/.htaccess — they are only ever included from PHP.
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');

set_exception_handler(static function (Throwable $e): void {
    error_log('[portfolio-api] ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
    }
    echo json_encode(['error' => 'Erreur serveur.']);
});

/** Bcrypt hash of a random string: used so unknown usernames cost as much as wrong passwords. */
const DUMMY_PASSWORD_HASH = '$2y$12$WpDvIX4JPWq/BJShPQtnCeWMt.hqqOIaeKOCTi/mpiJwhGpis5gA2';

function config(): array
{
    static $cfg = null;
    if ($cfg === null) {
        $file = __DIR__ . '/config.php';
        $loaded = is_file($file) ? require $file : [];
        $cfg = array_merge([
            'db_dsn' => null,          // optional full PDO DSN (overrides host/port/name)
            'db_host' => 'localhost',
            'db_port' => 3306,
            'db_name' => '',
            'db_user' => '',
            'db_pass' => '',
            'uploads_dir' => dirname(__DIR__) . '/uploads/projects',
            'uploads_url' => '/uploads/projects',
            'max_upload_bytes' => 12 * 1024 * 1024,
            'session_idle_seconds' => 7200,
            'allow_insecure_admin' => false, // only for local development over plain http
        ], is_array($loaded) ? $loaded : []);
    }
    return $cfg;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $c = config();
    $dsn = $c['db_dsn'] ?: sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $c['db_host'],
        (int) $c['db_port'],
        $c['db_name']
    );
    $pdo = new PDO($dsn, $c['db_user'] ?: null, $c['db_pass'] ?: null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') {
        // All timestamps written by PHP are UTC.
        $pdo->exec("SET time_zone = '+00:00'");
    }
    return $pdo;
}

function now_utc(int $offsetSeconds = 0): string
{
    return gmdate('Y-m-d H:i:s', time() + $offsetSeconds);
}

/* ------------------------------------------------------------------ */
/* HTTP helpers                                                        */
/* ------------------------------------------------------------------ */

function send_json(mixed $data, int $status = 200, array $headers = []): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: same-origin');
    foreach ($headers as $name => $value) {
        header($name . ': ' . $value);
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function fail(string $message, int $status = 400, array $extra = []): never
{
    send_json(['error' => $message] + $extra, $status, ['Cache-Control' => 'no-store']);
}

function request_json(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }
    try {
        $data = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        fail('JSON invalide.');
    }
    return is_array($data) ? $data : [];
}

function is_https(): bool
{
    if (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') {
        return true;
    }
    if (strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https') {
        return true;
    }
    return (int) ($_SERVER['SERVER_PORT'] ?? 0) === 443;
}

function is_local_request(): bool
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    return $ip === '127.0.0.1' || $ip === '::1';
}

function client_ip(): string
{
    return substr((string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'), 0, 45);
}

/* ------------------------------------------------------------------ */
/* Validation / normalisation                                          */
/* ------------------------------------------------------------------ */

final class ValidationError extends RuntimeException
{
}

function str_field(array $in, string $key, int $max, bool $required = false, string $label = ''): string
{
    $value = $in[$key] ?? '';
    if (!is_scalar($value)) {
        $value = '';
    }
    $value = trim((string) $value);
    if ($required && $value === '') {
        throw new ValidationError(($label ?: $key) . ' est obligatoire.');
    }
    if (mb_strlen($value) > $max) {
        throw new ValidationError(($label ?: $key) . " : {$max} caractères maximum.");
    }
    return $value;
}

function slugify(string $text): string
{
    if (function_exists('transliterator_transliterate')) {
        $t = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $text);
        if (is_string($t)) {
            $text = $t;
        }
    } else {
        $t = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
        if ($t !== false) {
            $text = $t;
        }
    }
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return substr(trim($text, '-'), 0, 120);
}

/**
 * Accepts root-relative paths ("/uploads/x.webp") and absolute http(s) URLs.
 * Rejects protocol-relative URLs, javascript:, data:, etc.
 */
function is_safe_url(string $url, bool $allowAnchors = false): bool
{
    if ($url === '') {
        return true;
    }
    if (preg_match('#[\x00-\x1F\x7F\s]#', $url)) {
        return false;
    }
    if (preg_match('#^/(?![/\\\\])#', $url)) {
        return true;
    }
    if ($allowAnchors && (str_starts_with($url, '#') || preg_match('#^mailto:[^\s@]+@[^\s@]+$#i', $url))) {
        return true;
    }
    return (bool) preg_match('#^https?://[a-z0-9]#i', $url) && filter_var($url, FILTER_VALIDATE_URL) !== false;
}

function url_field(array $in, string $key, string $label): string
{
    $url = str_field($in, $key, 255, false, $label);
    if (!is_safe_url($url)) {
        throw new ValidationError("{$label} : URL invalide (https://… ou /chemin).");
    }
    return $url;
}

function normalize_video(string $url): string
{
    $url = trim($url);
    if ($url === '') {
        return '';
    }
    if (preg_match('~(?:youtube(?:-nocookie)?\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/|live/)|youtu\.be/)([A-Za-z0-9_-]{6,})~', $url, $m)) {
        return 'https://www.youtube-nocookie.com/embed/' . $m[1];
    }
    if (preg_match('~vimeo\.com/(?:video/)?(\d+)~', $url, $m)) {
        return 'https://player.vimeo.com/video/' . $m[1];
    }
    if (!is_safe_url($url)) {
        throw new ValidationError('Vidéo : URL invalide.');
    }
    return $url;
}

/** @return string[] */
function split_lines(?string $text): array
{
    if ($text === null || trim($text) === '') {
        return [];
    }
    $lines = preg_split('/\R/', $text) ?: [];
    $lines = array_map(static fn ($l) => trim(preg_replace('/^[\-\*•]\s*/u', '', trim($l)) ?? ''), $lines);
    return array_values(array_filter($lines, static fn ($l) => $l !== ''));
}

/* ------------------------------------------------------------------ */
/* HTML sanitiser for project descriptions                             */
/* ------------------------------------------------------------------ */

function sanitize_html(string $html): string
{
    $html = trim($html);
    if ($html === '') {
        return '';
    }

    // Plain text (no known HTML tags): blank lines become paragraphs, single newlines <br>.
    if (!preg_match('#</?(?:p|br|strong|b|em|i|u|h[1-6]|ul|ol|li|blockquote|code|pre|hr|a|div|span|img|script|style|iframe)\b#i', $html)) {
        $paragraphs = array_filter(preg_split('/\R\s*\R/', $html) ?: [], static fn ($p) => trim($p) !== '');
        return implode("\n", array_map(
            static fn ($p) => '<p>' . nl2br(htmlspecialchars(trim($p), ENT_QUOTES, 'UTF-8'), false) . '</p>',
            $paragraphs
        ));
    }

    $allowed = [
        'p' => [], 'br' => [], 'strong' => [], 'b' => [], 'em' => [], 'i' => [], 'u' => [],
        'h2' => [], 'h3' => [], 'h4' => [], 'ul' => [], 'ol' => [], 'li' => [],
        'blockquote' => [], 'code' => [], 'pre' => [], 'hr' => [], 'a' => ['href'],
    ];
    $drop = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea',
        'select', 'svg', 'math', 'template', 'noscript', 'link', 'meta', 'base', 'head', 'title'];

    $doc = new DOMDocument('1.0', 'UTF-8');
    $prev = libxml_use_internal_errors(true);
    $doc->loadHTML(
        '<?xml encoding="UTF-8"?><html><body><div id="__root">' . $html . '</div></body></html>',
        LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING
    );
    libxml_clear_errors();
    libxml_use_internal_errors($prev);

    $root = $doc->getElementById('__root');
    if (!$root) {
        return '';
    }
    sanitize_node($root, $allowed, $drop);

    $out = '';
    foreach ($root->childNodes as $child) {
        $out .= $doc->saveHTML($child);
    }
    return trim($out);
}

function sanitize_node(DOMNode $node, array $allowed, array $drop): void
{
    foreach (iterator_to_array($node->childNodes) as $child) {
        if ($child instanceof DOMElement) {
            $tag = strtolower($child->tagName);
            if (in_array($tag, $drop, true)) {
                $node->removeChild($child);
                continue;
            }
            sanitize_node($child, $allowed, $drop);
            $hasBlockChild = false;
            foreach ($child->childNodes as $grandChild) {
                if ($grandChild instanceof DOMElement
                    && in_array(strtolower($grandChild->tagName), ['p', 'ul', 'ol', 'h2', 'h3', 'h4', 'blockquote', 'pre', 'hr'], true)) {
                    $hasBlockChild = true;
                    break;
                }
            }
            if (($tag === 'div' && !$hasBlockChild) || $tag === 'h1') {
                // Pasted blocks: keep the structure as paragraphs / section titles.
                $replacement = $child->ownerDocument->createElement($tag === 'div' ? 'p' : 'h2');
                while ($child->firstChild) {
                    $replacement->appendChild($child->firstChild);
                }
                $node->replaceChild($replacement, $child);
                continue;
            }
            if (!array_key_exists($tag, $allowed)) {
                while ($child->firstChild) {
                    $node->insertBefore($child->firstChild, $child);
                }
                $node->removeChild($child);
                continue;
            }
            foreach (iterator_to_array($child->attributes) as $attr) {
                if (!in_array(strtolower($attr->name), $allowed[$tag], true)) {
                    $child->removeAttribute($attr->name);
                }
            }
            if ($tag === 'a') {
                $href = trim($child->getAttribute('href'));
                if ($href === '' || !is_safe_url($href, true)) {
                    $child->removeAttribute('href');
                } elseif (preg_match('#^https?://#i', $href)) {
                    $child->setAttribute('target', '_blank');
                    $child->setAttribute('rel', 'noopener noreferrer');
                }
            }
        } elseif (!($child instanceof DOMText)) {
            // comments, processing instructions, CDATA…
            $node->removeChild($child);
        }
    }
}

/* ------------------------------------------------------------------ */
/* Project mapping (DB row → JSON used by the Vue front)               */
/* ------------------------------------------------------------------ */

function project_public(array $r): array
{
    $media = json_decode((string) ($r['media'] ?? '[]'), true);
    $media = is_array($media) ? array_values(array_filter($media, 'is_string')) : [];

    return [
        'id' => (int) $r['id'],
        'title' => (string) $r['title'],
        'slug' => (string) ($r['slug'] ?? ''),
        'subtitle' => (string) ($r['subtitle'] ?? ''),
        'category' => (string) ($r['category'] ?? ''),
        'year' => (string) ($r['year'] ?? ''),
        'context' => (string) ($r['context'] ?? ''),
        'role' => (string) ($r['role'] ?? ''),
        'preview' => (string) ($r['image_url'] ?? ''),
        'image' => (string) ($r['image_url'] ?? ''),
        'media' => $media,
        'description' => (string) ($r['description'] ?? ''),
        'highlights' => split_lines($r['highlights'] ?? null),
        'tech_stack' => (string) ($r['tech_stack'] ?? ''),
        'link' => (string) ($r['live_demo_link'] ?? ''),
        'repo' => (string) ($r['repo_link'] ?? ''),
        'video' => (string) ($r['video_url'] ?? ''),
    ];
}

function project_admin(array $r): array
{
    return project_public($r) + [
        'published' => (bool) (int) ($r['published'] ?? 0),
        'sort_order' => (int) ($r['sort_order'] ?? 0),
        'created_at' => $r['created_at'] ?? null,
        'updated_at' => $r['updated_at'] ?? null,
    ];
}
