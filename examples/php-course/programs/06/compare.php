<?php
var_dump('0' == 0);
var_dump('0' === 0);
var_dump('0' != 0);
var_dump('0' !== 0);
$value = '0';
echo $value ?? 'missing', PHP_EOL;
echo $value ?: 'empty', PHP_EOL;
$divisor = 0;
var_dump($divisor !== 0 && 10 / $divisor > 2);
