<?php
declare(strict_types=1);

/**
 * Back-office API. Every call goes through ?action=…
 *
 *   GET  me         → session state + CSRF token
 *   POST login      { username, password }
 *   POST logout
 *   GET  projects   → all projects, drafts included
 *   POST save       { project }        (insert when no id)
 *   POST publish    { id, published }
 *   POST delete     { id }
 *   POST reorder    { ids: [..] }
 *   POST upload     multipart "file"   → { url }
 *
 * Protections: HTTPS only, HttpOnly + SameSite=Strict session cookie scoped to /api/,
 * custom header + CSRF token on every POST, bcrypt passwords, per-IP login throttling.
 */

require __DIR__ . '/_bootstrap.php';

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_SECONDS = 900;

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

if (!is_https() && !is_local_request() && !config()['allow_insecure_admin']) {
    fail('Connexion HTTPS requise.', 403);
}

admin_session_start();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string) ($_GET['action'] ?? '');

if ($method === 'POST') {
    // A custom header cannot be sent cross-site without a CORS preflight (which we never allow).
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'kosmo-admin') {
        fail('Requête refusée.', 403);
    }
    if ($action !== 'login' && !hash_equals($_SESSION['csrf'], (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? ''))) {
        fail('Session expirée, rechargez la page.', 419);
    }
}

$routes = [
    'GET me' => 'action_me',
    'POST login' => 'action_login',
    'POST logout' => 'action_logout',
    'GET projects' => 'action_projects',
    'POST save' => 'action_save',
    'POST publish' => 'action_publish',
    'POST delete' => 'action_delete',
    'POST reorder' => 'action_reorder',
    'POST upload' => 'action_upload',
];

$handler = $routes[$method . ' ' . $action] ?? null;
if ($handler === null) {
    fail('Action inconnue.', 404);
}
if (!in_array($action, ['me', 'login'], true)) {
    require_admin();
}

try {
    $handler();
} catch (ValidationError $e) {
    fail($e->getMessage(), 422);
}

/* ------------------------------------------------------------------ */
/* Session                                                             */
/* ------------------------------------------------------------------ */

function admin_session_start(): void
{
    session_name('kosmo_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/api/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.use_trans_sid', '0');
    session_start();

    $idle = (int) config()['session_idle_seconds'];
    if (isset($_SESSION['admin_id'], $_SESSION['last_seen']) && time() - (int) $_SESSION['last_seen'] > $idle) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    if (isset($_SESSION['admin_id'])) {
        $_SESSION['last_seen'] = time();
    }
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
}

function require_admin(): void
{
    if (empty($_SESSION['admin_id'])) {
        fail('Non connecté.', 401);
    }
}

function me_payload(): array
{
    return [
        'authenticated' => !empty($_SESSION['admin_id']),
        'username' => $_SESSION['admin_username'] ?? null,
        'csrf' => $_SESSION['csrf'],
    ];
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

function action_me(): void
{
    send_json(me_payload());
}

function action_login(): void
{
    $in = request_json();
    $username = trim((string) ($in['username'] ?? ''));
    $password = (string) ($in['password'] ?? '');
    $ip = client_ip();
    $pdo = db();

    // Occasional cleanup of old attempts.
    if (random_int(1, 20) === 1) {
        $pdo->prepare('DELETE FROM admin_login_attempts WHERE attempted_at < ?')->execute([now_utc(-86400)]);
    }

    $count = $pdo->prepare('SELECT COUNT(*) FROM admin_login_attempts WHERE ip = ? AND attempted_at > ?');
    $count->execute([$ip, now_utc(-LOGIN_WINDOW_SECONDS)]);
    if ((int) $count->fetchColumn() >= LOGIN_MAX_ATTEMPTS) {
        fail('Trop de tentatives. Réessayez dans 15 minutes.', 429);
    }

    $user = null;
    if ($username !== '' && mb_strlen($username) <= 64) {
        $stmt = $pdo->prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?');
        $stmt->execute([$username]);
        $user = $stmt->fetch() ?: null;
    }

    $valid = password_verify($password, $user['password_hash'] ?? DUMMY_PASSWORD_HASH) && $user !== null;
    if (!$valid || $password === '') {
        $pdo->prepare('INSERT INTO admin_login_attempts (ip, attempted_at) VALUES (?, ?)')->execute([$ip, now_utc()]);
        usleep(random_int(250_000, 500_000));
        fail('Identifiant ou mot de passe incorrect.', 401);
    }

    $pdo->prepare('DELETE FROM admin_login_attempts WHERE ip = ?')->execute([$ip]);
    if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
        $pdo->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($password, PASSWORD_DEFAULT), $user['id']]);
    }
    $pdo->prepare('UPDATE admin_users SET last_login_at = ? WHERE id = ?')->execute([now_utc(), $user['id']]);

    session_regenerate_id(true);
    $_SESSION['admin_id'] = (int) $user['id'];
    $_SESSION['admin_username'] = $user['username'];
    $_SESSION['last_seen'] = time();
    $_SESSION['csrf'] = bin2hex(random_bytes(32));

    send_json(me_payload());
}

function action_logout(): void
{
    $_SESSION = [];
    $params = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 3600,
        'path' => $params['path'],
        'secure' => $params['secure'],
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_destroy();
    send_json(['authenticated' => false]);
}

function action_projects(): void
{
    $rows = db()->query('SELECT * FROM projects ORDER BY sort_order ASC, id DESC')->fetchAll();
    send_json(['projects' => array_map('project_admin', $rows)]);
}

function fetch_project(int $id): array
{
    $stmt = db()->prepare('SELECT * FROM projects WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        fail('Projet introuvable.', 404);
    }
    return $row;
}

function action_save(): void
{
    $in = request_json()['project'] ?? null;
    if (!is_array($in)) {
        throw new ValidationError('Données du projet manquantes.');
    }
    $id = isset($in['id']) && $in['id'] !== null && $in['id'] !== '' ? (int) $in['id'] : null;

    $title = str_field($in, 'title', 255, true, 'Titre');
    $slug = slugify(str_field($in, 'slug', 191, false, 'Slug') ?: $title);
    if ($slug === '') {
        throw new ValidationError('Slug invalide : utilisez des lettres et des chiffres.');
    }

    // Media gallery: list of safe URLs.
    $media = $in['media'] ?? [];
    if (!is_array($media)) {
        $media = [];
    }
    $media = array_values(array_filter(array_map(static fn ($u) => is_string($u) ? trim($u) : '', $media)));
    if (count($media) > 60) {
        throw new ValidationError('Galerie : 60 images maximum.');
    }
    foreach ($media as $url) {
        if (mb_strlen($url) > 500 || !is_safe_url($url)) {
            throw new ValidationError('Galerie : URL d’image invalide.');
        }
    }

    $highlights = $in['highlights'] ?? '';
    $highlights = is_array($highlights) ? implode("\n", array_filter($highlights, 'is_string')) : (string) $highlights;
    $highlights = implode("\n", array_slice(split_lines($highlights), 0, 12));

    $description = $in['description'] ?? '';
    $description = sanitize_html(is_string($description) ? $description : '');
    if (strlen($description) > 60000) {
        throw new ValidationError('Description trop longue.');
    }

    $data = [
        'title' => $title,
        'slug' => $slug,
        'subtitle' => str_field($in, 'subtitle', 255, false, 'Sous-titre'),
        'category' => str_field($in, 'category', 255, false, 'Catégorie'),
        'year' => str_field($in, 'year', 16, false, 'Année'),
        'context' => str_field($in, 'context', 120, false, 'Contexte'),
        'role' => str_field($in, 'role', 120, false, 'Rôle'),
        'tech_stack' => str_field($in, 'tech_stack', 500, false, 'Technologies'),
        'image_url' => url_field($in, 'image', 'Image de couverture'),
        'media' => json_encode($media, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        'video_url' => normalize_video(str_field($in, 'video', 255, false, 'Vidéo')),
        'repo_link' => url_field($in, 'repo', 'Lien du code'),
        'live_demo_link' => url_field($in, 'link', 'Lien en ligne'),
        'description' => $description,
        'highlights' => $highlights,
        'published' => !empty($in['published']) ? 1 : 0,
    ];

    $pdo = db();
    $dup = $pdo->prepare('SELECT id FROM projects WHERE slug = ? AND id <> ?');
    $dup->execute([$slug, $id ?? 0]);
    if ($dup->fetchColumn()) {
        throw new ValidationError("Le slug « {$slug} » est déjà utilisé par un autre projet.");
    }

    if ($id !== null) {
        fetch_project($id);
        $data['updated_at'] = now_utc();
        $sets = implode(', ', array_map(static fn ($k) => "`{$k}` = :{$k}", array_keys($data)));
        $stmt = $pdo->prepare("UPDATE projects SET {$sets} WHERE id = :id");
        $stmt->execute($data + ['id' => $id]);
    } else {
        // New projects go to the top of the list.
        $min = (int) $pdo->query('SELECT COALESCE(MIN(sort_order), 0) FROM projects')->fetchColumn();
        $data['sort_order'] = $min - 1;
        $data['created_at'] = now_utc();
        $data['updated_at'] = now_utc();
        $cols = implode(', ', array_map(static fn ($k) => "`{$k}`", array_keys($data)));
        $vals = implode(', ', array_map(static fn ($k) => ":{$k}", array_keys($data)));
        $pdo->prepare("INSERT INTO projects ({$cols}) VALUES ({$vals})")->execute($data);
        $id = (int) $pdo->lastInsertId();
    }

    send_json(['project' => project_admin(fetch_project($id))]);
}

function action_publish(): void
{
    $in = request_json();
    $id = (int) ($in['id'] ?? 0);
    fetch_project($id);
    db()->prepare('UPDATE projects SET published = ?, updated_at = ? WHERE id = ?')
        ->execute([!empty($in['published']) ? 1 : 0, now_utc(), $id]);
    send_json(['project' => project_admin(fetch_project($id))]);
}

function action_delete(): void
{
    $id = (int) (request_json()['id'] ?? 0);
    fetch_project($id);
    db()->prepare('DELETE FROM projects WHERE id = ?')->execute([$id]);
    send_json(['deleted' => $id]);
}

function action_reorder(): void
{
    $ids = request_json()['ids'] ?? null;
    if (!is_array($ids) || count($ids) > 500) {
        throw new ValidationError('Ordre invalide.');
    }
    $pdo = db();
    $pdo->beginTransaction();
    $stmt = $pdo->prepare('UPDATE projects SET sort_order = ? WHERE id = ?');
    foreach (array_values($ids) as $index => $id) {
        $stmt->execute([$index, (int) $id]);
    }
    $pdo->commit();
    send_json(['ok' => true]);
}

function action_upload(): void
{
    $file = $_FILES['file'] ?? null;
    if (!is_array($file) || !isset($file['error']) || is_array($file['error'])) {
        throw new ValidationError('Aucun fichier reçu.');
    }
    if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
        throw new ValidationError('Fichier trop lourd pour le serveur.');
    }
    if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
        throw new ValidationError('Échec de l’envoi du fichier.');
    }
    $max = (int) config()['max_upload_bytes'];
    if ($file['size'] > $max) {
        throw new ValidationError('Fichier trop lourd (' . round($max / 1048576) . ' Mo max).');
    }

    $types = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
        'image/avif' => 'avif',
    ];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) ?: '';
    if (!isset($types[$mime])) {
        throw new ValidationError('Format non supporté (JPG, PNG, WebP, GIF, AVIF).');
    }
    if ($mime !== 'image/avif' && @getimagesize($file['tmp_name']) === false) {
        throw new ValidationError('Image illisible.');
    }

    $dir = rtrim((string) config()['uploads_dir'], '/\\');
    ensure_upload_dir($dir);

    $name = gmdate('Ymd') . '-' . bin2hex(random_bytes(8)) . '.' . $types[$mime];
    if (!move_uploaded_file($file['tmp_name'], $dir . DIRECTORY_SEPARATOR . $name)) {
        throw new RuntimeException('move_uploaded_file failed for ' . $dir);
    }
    @chmod($dir . DIRECTORY_SEPARATOR . $name, 0644);

    send_json(['url' => rtrim((string) config()['uploads_url'], '/') . '/' . $name], 201);
}

function ensure_upload_dir(string $dir): void
{
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        throw new RuntimeException('Cannot create upload dir ' . $dir);
    }
    // Defence in depth: never execute anything from the uploads folder.
    $htaccess = dirname($dir) . '/.htaccess';
    if (!is_file($htaccess)) {
        @file_put_contents($htaccess, <<<HT
            <FilesMatch "\\.(?i:php\\d?|phtml|phar|pl|py|cgi|sh|html?|svg|js)$">
              Require all denied
            </FilesMatch>
            <IfModule mod_headers.c>
              Header set X-Content-Type-Options "nosniff"
            </IfModule>

            HT);
    }
}
