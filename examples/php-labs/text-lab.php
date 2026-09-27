<?php
declare(strict_types=1);

foreach (['abc', 'عمر', '🙂'] as $text) {
    echo $text, ' bytes=', strlen($text), ' codepoints=', mb_strlen($text, 'UTF-8'), PHP_EOL;
}
require __DIR__ . '/bootstrap.php';
try { Lessons\parseMinorUnits("12.5\n"); } catch (InvalidArgumentException) { echo "final_newline=rejected\n"; }
