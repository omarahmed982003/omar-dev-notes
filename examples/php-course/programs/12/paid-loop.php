<?php
$orders = [
    ['status' => 'paid', 'total' => 1200],
    ['status' => 'pending', 'total' => 500],
    ['status' => 'paid', 'total' => 800],
];
$sum = 0;
foreach ($orders as $row) {
    if ($row['status'] !== 'paid') {
        continue;
    }
    $sum += $row['total'];
}
echo $sum, PHP_EOL;
