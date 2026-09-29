<?php
declare(strict_types=1);

function response(array $data, int $status = 200, array $headers = []): array
{
    return [
        'status' => $status,
        'headers' => $headers + [
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
            'X-Content-Type-Options' => 'nosniff',
        ],
        'body' => json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
    ];
}
function createNote(array $request): array
{
    if ($request['type'] !== 'application/json') {
        return response(['error' => 'Unsupported media type'], 415);
    }
    try {
        $payload = json_decode($request['body'], false, 32, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        return response(['error' => 'Invalid JSON'], 400);
    }
    if (!$payload instanceof stdClass
        || !is_string($payload->text ?? null)
        || trim($payload->text) === ''
        || mb_strlen($payload->text, 'UTF-8') > 200) {
        return response(['error' => 'Use a text field with 1 to 200 code points'], 422);
    }
    return response(['text' => trim($payload->text)], 200);
}
function route(array $request): array
{
    $routes = [
        '/health' => ['GET' => static fn (array $r): array => response(['status' => 'ok'])],
        '/notes' => ['POST' => 'createNote'],
    ];
    $methods = $routes[$request['path']] ?? null;
    if ($methods === null) {
        return response(['error' => 'Not found'], 404);
    }
    $handler = $methods[$request['method']] ?? null;
    if ($handler === null) {
        return response(['error' => 'Method not allowed'], 405, ['Allow' => implode(', ', array_keys($methods))]);
    }
    return $handler($request);
}
function middleware(array $request, callable $next): array
{
    $id = bin2hex(random_bytes(8));
    try {
        if (strlen($request['body']) > 4096) {
            $reply = response(['error' => 'Body too large'], 413);
        } else {
            $reply = $next($request);
        }
    } catch (Throwable $error) {
        error_log(json_encode(['request_id' => $id, 'type' => get_class($error)], JSON_THROW_ON_ERROR));
        $reply = response(['error' => 'Internal error'], 500);
    }
    $reply['headers']['X-Request-ID'] = $id;
    return $reply;
}

$body = file_get_contents('php://input', false, null, 0, 4097);
if ($body === false) {
    $reply = response(['error' => 'Body unavailable'], 500);
} else {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $request = [
        'method' => $_SERVER['REQUEST_METHOD'] ?? 'GET',
        'path' => is_string($path) ? $path : '',
        'type' => strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])),
        'body' => $body,
    ];
    $reply = middleware($request, 'route');
}
http_response_code($reply['status']);
foreach ($reply['headers'] as $name => $value) {
    header("{$name}: {$value}");
}
echo $reply['body'];
