<?php
declare(strict_types=1);

$value = 10;
function visit(): void { static $calls = 0; $value = 2; echo "local=$value calls=", ++$calls, PHP_EOL; }
visit(); visit(); echo "global=$value\n";
require __DIR__ . '/bootstrap.php';
try { Lessons\positiveIds([['12']]); } catch (InvalidArgumentException) { echo "nested_input=rejected\n"; }
