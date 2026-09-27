<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($argc < 2) {
    fwrite(STDERR, "Usage: php total.php 12.50 3.25\n");
    exit(2);
}
try {
    $total = 0;
    foreach (array_slice($argv, 1) as $amount) {
        $total = Lessons\addMinorUnits($total, Lessons\parseMinorUnits($amount));
    }
    printf("%d.%02d\n", intdiv($total, 100), $total % 100);
} catch (InvalidArgumentException $error) {
    fwrite(STDERR, $error->getMessage() . PHP_EOL);
    exit(1);
}
