<?php
require __DIR__ . '/bootstrap.php';
$db = Lessons\connectInventory(); Lessons\initializeInventory($db);
echo json_encode([Lessons\purchase($db,'job-42',1,1,2),Lessons\purchase($db,'job-42',1,1,2)], JSON_THROW_ON_ERROR), PHP_EOL;
