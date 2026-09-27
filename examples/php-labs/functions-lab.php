<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/bootstrap.php';
echo Lessons\parseMinorUnits('1.25'), PHP_EOL;
try { Lessons\parseMinorUnits('-1'); } catch (InvalidArgumentException) { echo "negative=rejected\n"; }
