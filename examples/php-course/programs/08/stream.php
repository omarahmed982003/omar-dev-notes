<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Cannot open stream');
}
try {
    $text = "Ali\nMona\n";
    $offset = 0;
    while ($offset < strlen($text)) {
        $written = fwrite($stream, substr($text, $offset));
        if ($written === false || $written === 0) {
            throw new RuntimeException('Write made no progress');
        }
        $offset += $written;
    }
    echo 'position=', ftell($stream), PHP_EOL;
    if (!rewind($stream)) {
        throw new RuntimeException('Cannot rewind');
    }
    $count = 0;
    while (($line = fgets($stream)) !== false) {
        $count++;
        echo $count, ': ', rtrim($line, "\r\n"), PHP_EOL;
    }
    if (!feof($stream)) {
        throw new RuntimeException('Read failed before EOF');
    }
    echo "count={$count}", PHP_EOL;
} finally {
    fclose($stream);
}
