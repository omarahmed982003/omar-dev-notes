---
title: "Turn solution patterns into steps"
description: "Turn solution patterns into steps"
sidebar:
  order: 10
prev: {"link":"/en/programming-basics/math-problem-solving/13-loop-reasoning/","label":"Why does a loop work and stop?"}
next: {"link":"/en/programming-basics/math-problem-solving/10-greedy-dynamic-programming/","label":"Choose between greedy steps and saved results"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A pattern name is not a solution. Trace small inputs and identify what is retained and what justifies discarding candidates. Know lists, positions, and loops; manual tracing comes before the optional PHP implementation.

## Start with a direct solution

**Brute force** tries every pair of distinct positions. With n items there are `n(n−1)/2` pairs: 45 for ten items and 4950 for one hundred.

This is quadratic growth, `O(n²)`. One pass grows linearly, `O(n)`; `O(1)` means bounded work independent of n, not one second. Review [algorithm comparison](/en/programming-basics/08-problem-solving-algorithms/) for assumptions.

**Simulation** applies the stated rules step by step, such as updating a training balance after each transaction. Not every problem needs something faster than the direct method.

## Count frequencies or keep distinct values

For `[2,1,2,3]`, a **frequency map** associates values with counts: `{2:2,1:1,3:1}`. The colon associates a key with its count.

If the question is only “seen before?”, a **set** stores distinct values `{1,2,3}` without counts. Choose the structure for the question.

## Range sums without repeated scanning

A **prefix sum** stores each starting segment's sum. Build `P=[0,2,3,5,8]` for the same list; the initial zero represents no elements.

Using problem positions starting at 1, positions 2 through 4 sum to `P[4]−P[1]=8−2=6`. Subtract the sum before the range, not its first element.

Building P takes one pass; each query then needs two accesses and a subtraction. This suits many queries on fixed data. Changing a value changes affected prefixes, so updates are not automatically free.

## Two pointers that actually move

**Two pointers** store positions of two elements. Find two **different positions** totaling 8 in the ascending list `[1,3,5,8]`. Program positions start at 0.

| left, right | Values | Sum | Decision |
|---|---|---: |---|
| 0, 3 | 1 and 8 | 9 | Too large: move right to 2 |
| 0, 2 | 1 and 5 | 6 | Too small: move left to 1 |
| 1, 2 | 3 and 5 | 8 | Return positions 1 and 2 |

Why is discarding safe? With 1+8 already too large, replacing 1 with any remaining value cannot reduce the sum with 8. Thus 8 cannot participate in a solution. With 1+5 too small, replacing 5 with a value no larger than 5 cannot raise the sum enough. Thus 1 can be discarded.

Sorted order proves these eliminations. The same movement rule can miss a solution on unsorted data.

## Missing pairs and distinct positions

For target 10 on the same list:

| left, right | Sum | After decision |
|---|---: |---|
| 0, 3 | 9 | left=1 |
| 1, 3 | 11 | right=2 |
| 1, 2 | 8 | left=2; stop |

The pointers meet. **`left < right`** prevents using the same 5 twice from one position. The result is no pair, not 5+5.

With `[5,5]`, positions 0 and 1 are different, so target 10 is valid. Duplicate values are permitted; reusing one position is not.

## Optional complete PHP experiment

Use PHP 8.1+ after arrays, functions, and while loops in the [PHP course](/en/php/). Save `pairs.php` and run `php pairs.php`; it writes no files.

**Contract:**  a list keyed 0, 1, …, sorted ascending, with integer elements from−1000000 through 1000000 and integer target from−2000000 through 2000000. These training bounds keep addition safe on 32-bit and 64-bit PHP; they are not a mathematical limit of the algorithm.

`array_is_list` checks list shape; `count` counts elements. `?array` permits an array or `null` result, where null means no pair. `++` increments and `--` decrements. Returned integers are zero-based positions, not values. Invalid shape, element type, ordering, or numeric bounds throw `InvalidArgumentException`. An argument not matching the declared array/int parameter type can instead cause a **TypeError**, a type-mismatch error.

~~~php
<?php
declare(strict_types=1);

function pairSumSorted(array $values, int $target): ?array
{
    if (!array_is_list($values) || $target < -2_000_000 || $target > 2_000_000) {
        throw new InvalidArgumentException('Invalid list or target');
    }

    foreach ($values as $index => $value) {
        if (!is_int($value) || $value < -1_000_000 || $value > 1_000_000) {
            throw new InvalidArgumentException('Invalid value');
        }

        if ($index > 0 && $values[$index - 1] > $value) {
            throw new InvalidArgumentException('List must be sorted');
        }
    }

    $left = 0;
    $right = count($values) - 1;

    while ($left < $right) {
        $sum = $values[$left] + $values[$right];

        if ($sum === $target) {
            return [$left, $right];
        }

        if ($sum < $target) {
            $left++;
        } else {
            $right--;
        }
    }

    return null;
}

foreach ([[[1, 3, 5, 8], 8], [[1, 3, 5, 8], 10], [[], 1], [[5], 10]] as [$values, $target]) {
    $pair = pairSumSorted($values, $target);
    echo $target . ':' . ($pair === null ? 'none' : $pair[0] . ',' . $pair[1]) . PHP_EOL;
}
~~~

Expected output:

~~~text
8:1,2
10:none
1:none
10:none
~~~

The last two cases are an empty list and a one-element list. Validation visits n items, and search moves a pointer each iteration: O(n) time and O(1) extra space excluding input and the fixed-size result. It does not silently sort the caller's data.

## Optional depth: other patterns have different contracts

**Greedy** takes the best immediate step but requires a problem-specific correctness argument. [The next lesson's coin example](/en/programming-basics/math-problem-solving/10-greedy-dynamic-programming/) demonstrates a counterexample.

**Dynamic programming** saves repeated smaller results; optimization requires a suitable relationship between optimal smaller solutions and the whole problem.

**Recursion** calls the same function on a smaller problem with a stopping case; not all recursion is dynamic programming. **Divide and conquer** solves smaller parts and combines them, such as sorting two halves and merging.

## Independent practice

1. Trace targets 6 and 4 in `[1,3,5,8]`, requiring distinct positions.
2. Compare target 10 in `[5]` and `[5,5]`.
3. For `[4,4,2]` find the frequency of 4, distinct count, sum, and empty-list sum.
4. Why does PHP reject `[3,1,8,5]` or a value such as `"hello"` instead of searching?

<details>
<summary>Answers and acceptance criteria</summary>

1. Positions 0, 2 and 0, 1 respectively. Verify their values add to the target and positions differ.
2. No pair; then positions 0, 1.
3. Two 4s, two distinct values, sum 10, empty sum 0 under this contract.
4. Unsorted data breaks the ordering precondition; text breaks the integer contract. Both throw InvalidArgumentException. Explain the first justified elimination, not just the final output.

</details>

## Summary

A pattern needs correctness conditions, costs, and limits. Continue to [greedy choice versus saved results](/en/programming-basics/math-problem-solving/10-greedy-dynamic-programming/).
