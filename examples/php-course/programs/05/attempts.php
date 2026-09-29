<?php
$replies = ['', '', 'Omar'];
$attempt = 0;
do {
    $input = $replies[$attempt] ?? '';
    $attempt++;
    echo "attempt={$attempt}", PHP_EOL;
} while ($input === '' && $attempt < 3);
echo $input === '' ? "No name\n" : "Hello {$input}\n";

$remaining = 0;
while ($remaining > 0) {
    echo "work", PHP_EOL;
    $remaining--;
}
