<?php
declare(strict_types=1);

set_exception_handler(static function (Throwable $error): void {
    $id = bin2hex(random_bytes(8));
    error_log(json_encode([
        'event' => 'unhandled_failure',
        'request_id' => $id,
        'type' => get_class($error),
        'file' => basename($error->getFile()),
        'line' => $error->getLine(),
    ], JSON_THROW_ON_ERROR));
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode(['error' => 'Internal error', 'request_id' => $id], JSON_THROW_ON_ERROR);
});
throw new RuntimeException('Demonstration failure');
