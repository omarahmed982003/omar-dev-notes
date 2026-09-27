<?php
declare(strict_types=1);
$path = $argv[1] ?? __DIR__ . '/fixtures/large.csv';
if (!is_file($path) || !is_readable($path)) { fwrite(STDERR,"Readable file required\n"); exit(2); }
$handle = fopen($path, 'rb');
if ($handle === false) { fwrite(STDERR,"Open failed\n"); exit(1); }
$count = 0; $start = memory_get_usage(true);
try {
    while (($row = fgetcsv($handle, escape: '')) !== false) $count++;
    if (!feof($handle)) throw new RuntimeException('Read failed');
} finally { fclose($handle); }
echo "rows=$count memory_growth=", max(0, memory_get_peak_usage(true)-$start), PHP_EOL;
