<?php
declare(strict_types=1);

function report(string $stage): void { echo $stage, ' current=', memory_get_usage(), ' peak=', memory_get_peak_usage(), PHP_EOL; }
report('start');
$values = range(1, 100000); report('array'); unset($values); report('released');
$sum = 0; for ($i = 1; $i <= 100000; $i++) $sum += $i;
report('streamed'); echo "sum=$sum\n";
