<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
$requestId = bin2hex(random_bytes(8));
try { Lessons\parseMinorUnits('bad'); } catch (InvalidArgumentException) { echo "validation=422\n"; }
try { throw new RuntimeException('internal diagnostic'); } catch (Throwable $error) {
    fwrite(STDERR, json_encode(['request_id' => $requestId, 'type' => $error::class, 'message' => 'unexpected failure']) . PHP_EOL);
    echo "response=500\n";
}
