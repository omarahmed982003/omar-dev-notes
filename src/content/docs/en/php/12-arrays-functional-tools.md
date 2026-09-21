---
title: 12. Arrays and transformation tools
description: Lists, maps, destructuring, unpacking, map, filter, reduce, sorting, and memory trade-offs.
sidebar:
  order: 12
---

## One type, several shapes

PHP `array` is an ordered map used as either a list or a dictionary. Validate its shape at boundaries.

```php
$ids = [10, 20, 30];
$user = ['id' => 7, 'name' => 'Omar'];

[$first, $second] = $ids;
['id' => $id, 'name' => $name] = $user;
```

`array_is_list()` identifies keys `0..n-1`. Removing a list item does not reindex automatically; use `array_values()` when required, especially before JSON encoding.

## map, filter, and reduce

```php
$paidTotals = array_map(
    static fn (array $order): int => $order['total_cents'],
    array_filter($orders, static fn (array $order): bool =>
        $order['status'] === 'paid'
    ),
);

$sum = array_reduce(
    $paidTotals,
    static fn (int $carry, int $total): int => $carry + $total,
    0,
);
```

These functions suit clear transformations. A loop is often clearer when producing several results, stopping early, or avoiding intermediate arrays.

## Unpacking and merge behavior

```php
$config = [...$defaults, ...$environment];

function sum(int ...$numbers): int {
    return array_sum($numbers);
}

$total = sum(...[2, 4, 6]);
```

For string keys, later unpacked values win. Array union with `+` instead preserves the left value for an existing key.

## Sorting

`sort` reindexes values, `asort` preserves keys, `ksort` sorts keys, and `usort` accepts a comparator returning a negative number, zero, or a positive number.

## Memory

PHP arrays are flexible but relatively heavy. Avoid loading millions of items into chained transformations. Use generators, pagination, or streaming processing.

