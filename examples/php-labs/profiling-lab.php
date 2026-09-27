<?php
declare(strict_types=1);

// Deterministic latency fixture: nearest-rank percentiles, not a live benchmark.
$milliseconds = array_merge(array_fill(0, 90, 10), array_fill(0, 9, 100), [1000]);
sort($milliseconds);
foreach ([50, 95, 99] as $percentile) {
    $index = (int) ceil(($percentile / 100) * count($milliseconds)) - 1;
    echo "p$percentile=", $milliseconds[$index], "ms\n";
}
echo 'mean=', array_sum($milliseconds) / count($milliseconds), "ms\n";
