<?php
declare(strict_types=1);

if (!extension_loaded('redis')) {
    http_response_code(503);
    exit('ext-redis unavailable');
}

ini_set('session.save_handler', 'redis');
ini_set('session.save_path', 'tcp://' . (getenv('REDIS_HOST') ?: 'redis') . ':6379?database=1&timeout=1');
ini_set('session.use_strict_mode', '1');
session_name('runtime_lab');
session_start([
    'cookie_secure' => false,
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);

$_SESSION['visits'] = ((int) ($_SESSION['visits'] ?? 0)) + 1;
$visits = $_SESSION['visits'];
session_write_close();

header('Content-Type: application/json; charset=utf-8');
echo json_encode(['storage' => 'redis', 'visits' => $visits], JSON_THROW_ON_ERROR);
