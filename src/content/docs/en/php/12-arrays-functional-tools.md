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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Arrays and transformation tools">
<p class="lesson-diagram-title">Concept map: Arrays and transformation tools</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>One type, several shapes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>map, filter, and reduce</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Unpacking and merge behavior</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Sorting</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Memory</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “One type, several shapes” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> PHP array is an ordered map used as either a list or a dictionary. Validate its shape at boundaries. array_is_list() identifies keys 0..n-1. Removing a list item does not reindex automatically; use array_values() when required, especially before JSON encoding. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “One type, several shapes” with “map, filter, and reduce”. Why does neither replace the other in “Arrays and transformation tools”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “One type, several shapes”: PHP array is an ordered map used as either a list or a dictionary. Validate its shape at boundaries. array_is_list() identifies keys 0..n-1. Removing a list item does not reindex automatically; use array_values() when required, especially before JSON encoding. For “map, filter, and reduce”: These functions suit clear transformations. A loop is often clearer when producing several results, stopping early, or avoiding intermediate arrays. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Unpacking and merge behavior”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For string keys, later unpacked values win. Array union with + instead preserves the left value for an existing key. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Sorting” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> sort reindexes values, asort preserves keys, ksort sorts keys, and usort accepts a comparator returning a negative number, zero, or a positive number. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
