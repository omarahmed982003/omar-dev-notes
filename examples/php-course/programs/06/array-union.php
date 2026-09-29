<?php
$left = ['timeout' => 3, 0 => 'A'];
$right = ['timeout' => 5, 0 => 'B'];
echo json_encode($left + $right, JSON_THROW_ON_ERROR), PHP_EOL;
echo json_encode(array_merge($left, $right), JSON_THROW_ON_ERROR), PHP_EOL;
