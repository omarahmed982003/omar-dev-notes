<?php
declare(strict_types=1);

$requestId = bin2hex(random_bytes(8));
fwrite(STDERR, json_encode(['timestamp' => gmdate(DATE_ATOM), 'level' => 'info', 'request_id' => $requestId, 'message' => 'order validated'], JSON_THROW_ON_ERROR) . PHP_EOL);
echo "status=ok\n";
