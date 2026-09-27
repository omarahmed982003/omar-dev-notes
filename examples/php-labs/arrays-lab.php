<?php
declare(strict_types=1);

$original = [1, 2, 3];
$mapped = array_map(static fn(int $n): int => $n * 2, $original);
$filtered = array_filter($mapped, static fn(int $n): bool => $n > 2);
$total = array_reduce($filtered, static fn(int $sum, int $n): int => $sum + $n, 0);
echo json_encode(compact('original', 'mapped', 'filtered', 'total'), JSON_THROW_ON_ERROR), PHP_EOL;
