---
title: "CLI project: expenses before the web"
prev: {"link":"/en/php/regex/","label":"Regex: validate a string shape"}
next: {"link":"/en/php/first-tests/","label":"Your first automated test"}
description: "CLI project: expenses before the web"
sidebar:
  order: 11.5
---

## Combine language tools in one program

Requires functions, arrays, validation, and CLI. Store expenses in integer minor units with no HTML, sessions, or database. An accumulator collects results; array_sum totals the list. Data is in-memory only and disappears when the process exits.

Regex is a string-shape pattern. Here it permits 0 or 1..6 digits without leading zeros; see [Regex](/en/php/regex/). At most 100 values of 999999 keep the sum below 100 million, within even 32-bit int limits.

## Complete application

Save expenses.php and run php expenses.php on PHP 8.1+. No files are written.

~~~php
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
~~~

Enter 120, 0, 80,quit: count=3 and total_cents=200. Invalid 12x is rejected without changing the list. EOF displays the current totals and exits.

| Input | List afterwards | Effect |
|---|---|---|
|120|[120]|append|
|0|[120, 0]|zero allowed|
|12x|[120, 0]|no mutation|
|80|[120, 0, 80]|append|
|quit|unchanged|exit|

## Independent extension

Add a count of values greater than 100 and a maximum. Empty input reports max=none. Test immediate EOF, 100 items, and item 101.

<details><summary>Approach after your attempt</summary>

Use a counter for >100. Start maximum at null and update on the first or larger value. Rejected values must not change totals. Separate calculation from printing when extracting functions.

</details>

## Next

Separate input and calculation in [program organization](/en/php/program-organization/), then persist JSON after [files](/en/php/08-files-streams-data/). No database or Git mutation is required.


