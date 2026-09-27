<?php
declare(strict_types=1);

// PDO model of N+1 and batched relation loading, not a specific ORM.
require __DIR__ . '/bootstrap.php';
$db = Lessons\connectInventory(); Lessons\initializeInventory($db);
for ($i=0; $i<20; $i++) $db->exec('INSERT INTO orders(user_id,product_id,quantity) VALUES(1,1,1)');
$count = 0;
$query = function(string $sql, array $params=[]) use ($db, &$count): array {
    $count++; $statement = $db->prepare($sql); $statement->execute($params); return $statement->fetchAll();
};
$orders = $query('SELECT * FROM orders ORDER BY id');
foreach ($orders as $order) $query('SELECT * FROM users WHERE id=?', [$order['user_id']]);
echo "naive_queries=$count\n";
$count = 0;
$orders = $query('SELECT * FROM orders ORDER BY id');
$ids = array_values(array_unique(array_column($orders, 'user_id')));
$users = $ids === [] ? [] : $query('SELECT * FROM users WHERE id IN (' . implode(',', array_fill(0,count($ids),'?')) . ')', $ids);
echo "batch_queries=$count orders=", count($orders), ' users=', count($users), PHP_EOL;
