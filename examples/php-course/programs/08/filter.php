<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Open failed');
}
try {
    if (fwrite($stream, 'hello') !== 5 || !rewind($stream)) {
        throw new RuntimeException('Prepare failed');
    }
    $filter = stream_filter_append($stream, 'string.toupper', STREAM_FILTER_READ);
    if ($filter === false) {
        throw new RuntimeException('Filter failed');
    }
    $text = stream_get_contents($stream);
    if ($text === false) {
        throw new RuntimeException('Read failed');
    }
    echo $text, PHP_EOL;
} finally {
    fclose($stream);
}
