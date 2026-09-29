<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Cannot open CSV');
}
try {
    $expected = ['a,b', 'say "hi"', 'back\\slash', 'عمر'];
    if (fputcsv($stream, $expected, escape: '') === false) {
        throw new RuntimeException('CSV write failed');
    }
    if (!rewind($stream)) {
        throw new RuntimeException('Cannot rewind');
    }
    $actual = fgetcsv($stream, escape: '');
    if ($actual !== $expected) {
        throw new RuntimeException('CSV round-trip failed');
    }
    echo "CSV round-trip OK", PHP_EOL;
} finally {
    fclose($stream);
}
