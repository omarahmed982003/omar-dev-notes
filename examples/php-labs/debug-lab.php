<?php
declare(strict_types=1);

echo json_encode(['status' => 'ok'], JSON_THROW_ON_ERROR), PHP_EOL;
fwrite(STDERR, json_encode(['level' => 'debug', 'message' => 'request completed'], JSON_THROW_ON_ERROR) . PHP_EOL);
