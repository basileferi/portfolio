<?php
declare(strict_types=1);

/**
 * Public, read-only list of published projects.
 * GET /api/projects.php → { projects: [...] }
 */

require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') {
    header('Allow: GET, HEAD');
    fail('Méthode non autorisée.', 405);
}

$rows = db()
    ->query('SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC, id DESC')
    ->fetchAll();

send_json(
    ['projects' => array_map('project_public', $rows)],
    200,
    ['Cache-Control' => 'public, max-age=30']
);
