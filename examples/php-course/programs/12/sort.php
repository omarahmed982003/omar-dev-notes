<?php
$orders = [
    ['id' => 2, 'total' => 800],
    ['id' => 3, 'total' => 1200],
    ['id' => 1, 'total' => 800],
];
usort($orders, static fn (array $a, array $b): int =>
    [$a['total'], $a['id']] <=> [$b['total'], $b['id']]
);
echo implode(',', array_column($orders, 'id')), PHP_EOL;
