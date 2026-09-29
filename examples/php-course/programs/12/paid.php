<?php
declare(strict_types=1);

$orders = [
    ['id' => 'A', 'status' => 'paid', 'total' => 1200],
    ['id' => 'B', 'status' => 'pending', 'total' => 500],
    ['id' => 'C', 'status' => 'paid', 'total' => 800],
];
$paid = array_filter($orders, static fn (array $row): bool => $row['status'] === 'paid');
echo 'keys=', implode(',', array_keys($paid)), PHP_EOL;
$totals = array_map(static fn (array $row): int => $row['total'], $paid);
echo json_encode($totals, JSON_THROW_ON_ERROR), PHP_EOL;
$totals = array_values($totals);
echo json_encode($totals, JSON_THROW_ON_ERROR), PHP_EOL;
$sum = array_reduce($totals, static fn (int $carry, int $n): int => $carry + $n, 0);
echo "sum={$sum}", PHP_EOL;
echo array_is_list($totals) ? "list\n" : "map\n";
