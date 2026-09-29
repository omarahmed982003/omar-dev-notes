<?php
declare(strict_types=1);

try {
    $pdo = new PDO(
        getenv('DATABASE_URL') ?: 'pgsql:host=postgres;port=5432;dbname=app',
        getenv('DATABASE_USER') ?: 'app',
        getenv('DATABASE_PASSWORD') ?: '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 2,
            PDO::ATTR_PERSISTENT => false,
        ],
    );
    $row = $pdo->query("SELECT probe_key, current_database() AS database FROM runtime_probe LIMIT 1")->fetch();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status' => 'ok', 'probe' => $row], JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    error_log(json_encode(['event' => 'database.probe_failed', 'exception' => $error::class]));
    http_response_code(503);
    echo '{"status":"unavailable"}';
}
