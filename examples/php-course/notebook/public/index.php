<?php
declare(strict_types=1);
require dirname(__DIR__) . '/src/notebook.php';

function reply(string $body, int $status = 200, array $headers = []): array
{
    return ['status' => $status, 'headers' => $headers, 'body' => $body];
}
function routeNotebook(string $method, string $path, array $config): array
{
    $routes = ['/' => 'GET', '/notes' => 'POST'];
    if (!isset($routes[$path])) {
        return reply('Not found', 404);
    }
    if ($routes[$path] !== $method) {
        return reply('Method not allowed', 405, ['Allow' => $routes[$path]]);
    }
    $owner = $_SESSION['owner'];
    $csrf = $_SESSION['csrf'];
    if ($method === 'POST') {
        $type = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
        if ($type !== 'application/x-www-form-urlencoded') {
            return reply('Unsupported media type', 415);
        }
        $token = $_POST['csrf'] ?? null;
        if (!is_string($token) || !hash_equals($csrf, $token)) {
            return reply('Invalid form token', 403);
        }
        $result = validateNote($_POST);
        $notes = readNotes($config['storage'], $owner);
        if ($result['errors'] !== []) {
            return reply(renderNotes($notes, $result['errors'], $result['data'], $csrf, ''), 422);
        }
        if (count($notes) >= 100) {
            return reply('Notebook is full', 409);
        }
        saveNote($config['storage'], $owner, $result['data'], new DateTimeImmutable('now', new DateTimeZone('UTC')));
        $_SESSION['name'] = $result['data']['name'];
        $_SESSION['flash'] = 'Note saved';
        return reply('', 303, ['Location' => '/']);
    }
    $flash = $_SESSION['flash'] ?? '';
    unset($_SESSION['flash']);
    return reply(renderNotes(
        readNotes($config['storage'], $owner),
        [],
        ['name' => $_SESSION['name'] ?? '', 'text' => ''],
        $csrf,
        $flash,
    ));
}
function sessionMiddleware(callable $next, array $config): array
{
    $raw = file_get_contents('php://input', false, null, 0, 4097);
    if ($raw === false) {
        throw new RuntimeException('Cannot read body');
    }
    if (strlen($raw) > 4096 || (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 4096) {
        return reply('Body too large', 413);
    }
    if (!session_start([
        'use_strict_mode' => true,
        'use_only_cookies' => true,
        'cookie_secure' => $config['secure_cookie'],
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
        'cookie_path' => '/',
    ])) {
        throw new RuntimeException('Session unavailable');
    }
    try {
        $_SESSION['owner'] ??= bin2hex(random_bytes(16));
        $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
        return $next();
    } finally {
        session_write_close();
    }
}

ini_set('display_errors', '0');
ini_set('log_errors', '1');
$requestId = bin2hex(random_bytes(8));
try {
    $config = require dirname(__DIR__) . '/config.php';
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $response = sessionMiddleware(
        static fn (): array => routeNotebook($method, is_string($path) ? $path : '', $config),
        $config,
    );
} catch (Throwable $error) {
    error_log(json_encode(['request_id' => $requestId, 'type' => get_class($error)], JSON_THROW_ON_ERROR));
    $response = reply('Internal error. Reference: ' . $requestId, 500);
}
http_response_code($response['status']);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Request-ID: ' . $requestId);
foreach ($response['headers'] as $name => $value) {
    header("{$name}: {$value}");
}
echo $response['body'];
