<?php
$scores = ['Ali' => 0, 'Mona' => -1, 'Omar' => 100, 'Nour' => 80];
foreach ($scores as $name => $score) {
    if ($score < 0) {
        continue;
    }
    echo "{$name}: {$score}", PHP_EOL;
    if ($score === 100) {
        break;
    }
}
