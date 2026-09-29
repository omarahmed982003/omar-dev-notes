<?php
declare(strict_types=1);

$autoload = is_file(dirname(__DIR__) . '/vendor/autoload.php')
    ? dirname(__DIR__) . '/vendor/autoload.php'
    : dirname(__DIR__, 2) . '/vendor/autoload.php';
require $autoload;

use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Trace\StatusCode;

$tracer = Globals::tracerProvider()->getTracer('php-runtime-lab', '1.0.0');
$span = $tracer->spanBuilder('lesson.telemetry')->startSpan();
$scope = $span->activate();

try {
    usleep(20_000);
    $span->setAttribute('lesson.component', 'runtime');
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status' => 'ok',
        'trace_id' => $span->getContext()->getTraceId(),
    ], JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    $span->recordException($error);
    $span->setStatus(StatusCode::STATUS_ERROR);
    throw $error;
} finally {
    $scope->detach();
    $span->end();
}
