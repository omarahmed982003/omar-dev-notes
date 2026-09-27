---
title: 12. Arrays and transformation tools
description: Lists, maps, destructuring, unpacking, map, filter, reduce, sorting, and memory trade-offs.
sidebar:
  order: 12
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Loop:** A structure that repeats instructions according to a condition.
- **Function:** A named, reusable block of code with one defined job.


## One flexible type can represent several structures

A PHP `array` can be a sequential list, a keyed map, or a row-like structure. That flexibility is useful, but your code must still know and document the expected shape.

```php
$prices = [1200, 2500, 800];
$product = ['id' => 7, 'name' => 'Keyboard'];
```

List keys are usually `0, 1, 2`; map keys carry meaning. Functions such as `array_filter()` preserve keys, so use `array_values()` when a filtered result must serialize as a contiguous JSON list.

- `map` transforms every element.
- `filter` keeps elements that satisfy a predicate.
- `reduce` folds a collection into one result.

```php
$positive = array_values(array_filter(
    $prices,
    static fn (int $price): bool => $price > 0,
));

$withTax = array_map(
    static fn (int $price): int => (int) round($price * 1.14),
    $positive,
);

$total = array_sum($withTax);
```

Functional helpers are not automatically clearer. If a transformation pipeline needs a paragraph to decode, an explicit loop may communicate state and failure better.

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

## Progressive practice

<details><summary>1. Filter positive prices and preserve a JSON list</summary><p>Call <code>array_filter()</code>, then <code>array_values()</code> to restore contiguous keys before encoding.</p></details>

<details><summary>2. map or filter for adding tax?</summary><p>Use map because each price becomes a new price. Filter selects items rather than transforming their meaning.</p></details>

<details><summary>3. When is a loop clearer than reduce?</summary><p>When aggregation has several states, failures, or side effects. Clarity beats compressing everything into one callback.</p></details>

## Lesson-specific problems

<details><summary>How do <code>map</code> and <code>filter</code> differ?</summary><p>Map transforms each item and normally preserves count; filter selects items and may reduce count.</p></details>

<details><summary>Why can PHP arrays be expensive for dense data?</summary><p>They are flexible hash structures with substantial metadata; streaming or a specialized structure may use less memory.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php arrays-lab.php
~~~

**Success criterion:** Tests prove the array shape after map, filter, and reduce, and the original array remains unchanged unless mutation is an explicit contract.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

PHP arrays can coerce some numeric-string keys to integers, so inspect key shape after JSON or input. <code>array_is_list</code> distinguishes lists from maps, while SPL structures can better express queues or heaps. map/filter/reduce copy data and can raise memory use; measure large collections.

### Try it yourself

Test keys 0, "0", and "01" and measure memory around a transformation pipeline.
