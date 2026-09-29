<?php
$total = 0;
for ($i = 1; $i <= 3; $i++) {
    $total += $i;
    echo "i={$i}, total={$total}", PHP_EOL;
}
echo "after: i={$i}, total={$total}", PHP_EOL;
