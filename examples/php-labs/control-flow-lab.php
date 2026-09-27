<?php
declare(strict_types=1);

foreach ([-1, 0, 1, 99, 100, 101] as $score) {
    $result = match (true) { $score < 0 || $score > 100 => 'invalid', $score >= 50 => 'pass', default => 'fail' };
    echo "$score:$result\n";
}
