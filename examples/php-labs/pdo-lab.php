<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
$db = Lessons\connectInventory(); Lessons\initializeInventory($db);
$query = $db->prepare('SELECT id, name FROM users WHERE id = :id');
foreach (['1', '1 OR 1=1'] as $id) {
    $query->execute(['id' => $id]); echo $id, ':rows=', count($query->fetchAll()), PHP_EOL;
}
