<?php
$keys = [0 => 'first', '0' => 'second', '01' => 'third'];
echo json_encode($keys, JSON_THROW_ON_ERROR), PHP_EOL;
$user = ['id' => 7, 'name' => 'Omar'];
['id' => $id, 'name' => $name] = $user;
[$first, $second] = [10, 20];
echo "{$id}:{$name}:{$first}:{$second}", PHP_EOL;

$defaults = ['timeout' => 3, 'retries' => 1];
$environment = ['timeout' => 5];
echo json_encode([...$defaults, ...$environment], JSON_THROW_ON_ERROR), PHP_EOL;
echo json_encode($defaults + $environment, JSON_THROW_ON_ERROR), PHP_EOL;
