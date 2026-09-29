<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Open failed');
}
try {
    try {
        throw new RuntimeException('Simulated read failure');
    } finally {
        fclose($stream);
        echo "closed", PHP_EOL;
    }
} catch (RuntimeException $error) {
    echo "handled", PHP_EOL;
}
echo is_resource($stream) ? "open\n" : "not open\n";
