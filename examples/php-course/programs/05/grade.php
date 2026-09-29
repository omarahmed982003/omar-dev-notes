<?php
$score = 75;
if ($score < 0 || $score > 100) {
    $grade = 'invalid';
} elseif ($score >= 90) {
    $grade = 'A';
} elseif ($score >= 75) {
    $grade = 'B';
} elseif ($score >= 50) {
    $grade = 'C';
} else {
    $grade = 'F';
}
echo "Score {$score}: {$grade}", PHP_EOL;
