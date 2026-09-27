<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
header('X-Request-Id: ' . bin2hex(random_bytes(8)));
if ($path === '/health') {
    header('Content-Type: application/json');
    echo '{"status":"ok"}';
    return;
}
if ($path === '/error') {
    http_response_code(500);
    header('Content-Type: application/json');
    echo '{"error":"simulated_failure"}';
    return;
}
if ($path === '/slow') {
    usleep(400_000);
    header('Content-Type: application/json');
    echo '{"delayed":true}';
    return;
}
if ($path === '/product') {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, ['GET', 'HEAD'], true)) {
        http_response_code(405);
        header('Allow: GET, HEAD');
        return;
    }
    $json = '{"id":42,"name":"Notebook"}';
    $etag = '"' . hash('sha256', $json) . '"';
    header('Cache-Control: public, max-age=60');
    header('ETag: ' . $etag);
    header('Content-Type: application/json');
    try {
        if (Lessons\ifNoneMatchMatches($_SERVER['HTTP_IF_NONE_MATCH'] ?? '', $etag)) {
            http_response_code(304);
            return;
        }
    } catch (InvalidArgumentException) {
        http_response_code(400);
        return;
    }
    if ($method !== 'HEAD') {
        echo $json;
    }
    return;
}
http_response_code(404);
header('Content-Type: application/json');
echo '{"error":"not_found"}';
