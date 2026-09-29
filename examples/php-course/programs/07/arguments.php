<?php
function increment(int $n): int { return $n + 1; }
function incrementInPlace(int &$n): void { $n++; }
function sum(int ...$numbers): int { return array_sum($numbers); }

$n = 4;
echo increment($n), ':', $n, PHP_EOL;
incrementInPlace($n);
echo $n, PHP_EOL;
echo sum(...[2, 3, 4]), PHP_EOL;
