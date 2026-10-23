<?php
declare(strict_types=1);

function readAmount(string $raw): ?int
{
    if (preg_match('/\\A(?:0|[1-9][0-9]{0,5})\\z/', $raw) !== 1) {
        return null;
    }
    return (int) $raw;
}
$items = [];
while (true) {
    fwrite(STDOUT, "Amount in cents, or quit: ");
    $line = fgets(STDIN);
    if ($line === false) {
        break;
    }
    $raw = trim($line);
    if ($raw === 'quit') {
        break;
    }
    $amount = readAmount($raw);
    if ($amount === null) {
        fwrite(STDERR, "Use 0..999999\n");
        continue;
    }
    if (count($items) >= 100) {
        fwrite(STDERR, "Maximum 100 items\n");
        exit(1);
    }
    $items[] = $amount;
}
echo 'count=', count($items), PHP_EOL;
echo 'total_cents=', array_sum($items), PHP_EOL;
