---
title: 12. Arrays and transformation tools
description: Lists, maps, destructuring, unpacking, map, filter, reduce, sorting, and memory trade-offs.
sidebar:
  order: 12
---

## The problem: select, transform, and summarize a collection

A collection of prices needs more than one variable. A **list** has keys 0 through n-1 in order. A **map** associates meaningful keys with values, such as name→Omar. PHP uses `array` for both: an ordered map. Do not assume key shape from a variable's name.

**Map** transforms elements, **filter** selects elements, and **reduce** combines a collection into one result. They describe data movement; using them is not a badge of sophistication. This lesson needs PHP 8.1+ for array_is_list and string-key unpacking.

## Complete program: total paid orders

Save `paid.php` and run `php paid.php`. Rows are assumed to have passed type and shape validation before this stage:

~~~php
<?php
declare(strict_types=1);

$orders = [
    ['id' => 'A', 'status' => 'paid', 'total' => 1200],
    ['id' => 'B', 'status' => 'pending', 'total' => 500],
    ['id' => 'C', 'status' => 'paid', 'total' => 800],
];
$paid = array_filter($orders, static fn (array $row): bool => $row['status'] === 'paid');
echo 'keys=', implode(',', array_keys($paid)), PHP_EOL;
$totals = array_map(static fn (array $row): int => $row['total'], $paid);
echo json_encode($totals, JSON_THROW_ON_ERROR), PHP_EOL;
$totals = array_values($totals);
echo json_encode($totals, JSON_THROW_ON_ERROR), PHP_EOL;
$sum = array_reduce($totals, static fn (int $carry, int $n): int => $carry + $n, 0);
echo "sum={$sum}", PHP_EOL;
echo array_is_list($totals) ? "list\n" : "map\n";
~~~

~~~text
keys=0,2
{"0":1200,"2":800}
[1200,800]
sum=2000
list
~~~

`array_filter` invokes a status-checking callback and preserves keys 0 and 2; removing B does not renumber. `array_map` with one array preserves those keys while turning each row into an integer. JSON sees the gap and produces an object. `array_values` renumbers, producing a JSON list. Reduce starts with carry=0, then 1200, then 2000. An empty list returns 0; without an initial value it could return null. `array_sum` is simpler for numeric addition; reduce is shown to explain accumulation.

The original array stays unchanged. These operations build new arrays, but object elements may still reference the same objects: a copied container is not a deep copy.

## An equivalent loop, and when it is clearer

~~~php
<?php
$orders = [
    ['status' => 'paid', 'total' => 1200],
    ['status' => 'pending', 'total' => 500],
    ['status' => 'paid', 'total' => 800],
];
$sum = 0;
foreach ($orders as $row) {
    if ($row['status'] !== 'paid') {
        continue;
    }
    $sum += $row['total'];
}
echo $sum, PHP_EOL;
~~~

~~~text
2000
~~~

The same selection and addition use no intermediate arrays. A loop may be clearer for early exit or multiple statistics. Very large datasets need generators or pagination rather than `fetchAll` or several materialized arrays. A generator supplies an element on demand; lesson 16 explains it. PHP arrays store metadata for keys and values rather than packed numeric storage. Measure `memory_get_peak_usage(true)` on equivalent data before redesigning. `SplQueue` and `SplHeap` provide queue/priority behavior when that is actually required.

## Keys have types and conversion rules

Save `keys.php`. **Destructuring** extracts selected positions or named fields; **unpacking** expands elements into an array or argument list:

~~~php
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
~~~

~~~text
{"0":"second","01":"third"}
7:Omar:10:20
{"timeout":5,"retries":1}
{"timeout":3,"retries":1}
~~~

`'0'` becomes an integer key and overwrites 0; `'01'` stays a string. Destructuring a missing field emits a warning, so validate input shape first. Later string keys win in unpacking; left keys win with `+`. Numeric keys are renumbered during unpacking. `sum(...$numbers)` expands arguments; `int ...$numbers` in a declaration instead collects them.

`isset($row['x'])` treats missing and null alike; `array_key_exists('x', $row)` detects a present null key. `in_array($needle, $values, true)` checks type and value; omitting true uses loose comparison. `array_filter($values)` without a callback removes all falsy values, including `0` and `'0'`. Write an explicit predicate when zero is valid.

## Sorting mutates the array

A **comparator** returns negative when the first item belongs before the second, zero for equality, and positive for after. Do not return a Boolean. Run `sort.php`:

~~~php
<?php
$orders = [
    ['id' => 2, 'total' => 800],
    ['id' => 3, 'total' => 1200],
    ['id' => 1, 'total' => 800],
];
usort($orders, static fn (array $a, array $b): int =>
    [$a['total'], $a['id']] <=> [$b['total'], $b['id']]
);
echo implode(',', array_column($orders, 'id')), PHP_EOL;
~~~

~~~text
1,2,3
~~~

We compare total, then id as a tie-breaker, so 1 precedes 2 at the same price. `usort` renumbers keys and returns a success flag, not the sorted array. **Wrong:** `$sorted = sort($values)` makes sorted a Boolean. Copy values first if the original must be retained, then sort the copy.

| Function | Sorts | Preserves keys? |
|---|---|---|
| sort / rsort | Values ascending/descending | No |
| asort / arsort | Values | Yes |
| ksort / krsort | Keys | Yes |
| usort | Values with a custom comparator | No |

Reverse operands for descending comparison. Compare consistent types; mixing strings and numbers can produce unintended ordering.

## Predict, debug, complete

<details><summary>Predict array_filter([0, 5, 0, 8]) followed by JSON</summary><p>Keys remain 1 and 3, producing an object. If zero is valid, use a predicate that preserves it. If a list is needed after filtering, apply array_values.</p></details>

<details><summary>Debug a comparator returning $a['total'] &gt; $b['total']</summary><p>A Boolean cannot distinguish “before” from “equal.” Use <code>$a['total'] &lt;=&gt; $b['total']</code> with an int return type.</p></details>

<details><summary>Complete reduce to multiply [2,3,4], including an empty list</summary><p>Start with 1 and use <code>fn (int $carry, int $n): int =&gt; $carry * $n</code>. The result is 24; empty input returns 1 under the product contract, not zero.</p></details>

<details><summary>Which approach suits count plus sum with early termination?</summary><p>A clear loop often does: update both accumulators and break at the limit without intermediate arrays or hidden callback side effects.</p></details>

The notebook displays a note list and validates its shape when loading. Run `php arrays-lab.php` from the [lab](/en/php/00-lab-setup/), including zeros and an empty collection.
