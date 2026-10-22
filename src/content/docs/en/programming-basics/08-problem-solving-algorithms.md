---
title: "Comparing algorithms and data structures"
description: Turn a problem into steps, write pseudocode, choose data structures, and reason about complexity.
sidebar:
  order: 8
prev: {"link":"/en/programming-basics/math-problem-solving/","label":"Math and problem solving"}
next: {"link":"/en/programming-basics/math-problem-solving/13-loop-reasoning/","label":"Why does a loop work and stop?"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Given orders, find each customer's total. You could scan orders again for every customer or update saved totals in one pass. **Comparing algorithms** means comparing correctness, work, and memory as input grows.

Start after lists, loops, and functions in your chosen language; PHP applications use the [PHP course](/en/php/). You can trace this example manually first. This is depth after a first program, not a language-learning prerequisite.

## Specify the contract and calculate manually

Each input order has a positive integer `customer_id` and a nonnegative integer `total` in minor currency units. The output maps each customer to their sum.

Reject invalid records rather than silently ignoring them. Empty input returns an empty map. Reject an addition that would exceed the integer range instead of silently changing the money representation.

| Order | Customer | Amount | Totals afterward |
|---|---: |---: |---|
| First | 1 | 100 | {1: 100} |
| Second | 2 | 50 | {1: 100, 2: 50} |
| Third | 1 | 20 | {1: 120, 2: 50} |

A **map** associates a key with a value. A **lookup** reads the current total by customer key. A new customer starts at zero, the starting value for a sum.

## Describe steps before syntax

**Pseudocode** expresses precise steps without executable language syntax. `validate` means check the contract, not an assumed built-in function; `get` reads a key or uses zero.

~~~text
totals = empty map
for each order in orders:
    validate order.customer_id and order.total
    old = totals.get(order.customer_id, default=0)
    totals[order.customer_id] = old + order.total
return totals
~~~

After every order, totals contains the sum of inspected orders for each customer. This is an **invariant**. The** precondition** specifies valid input; the **postcondition** specifies correct totals. **Termination** follows from inspecting a new element of a finite list each iteration.

## Optional complete PHP example

Save `totals.php` and run `php totals.php` with PHP 8+. It only prints. Assume arrays and foreach are familiar; a PHP array holds keyed customer totals.

`is_array` checks record shape, `isset` existing non-null fields, `is_int` integer type, and `||` means OR. `throw` signals failure; `?? 0` initializes a new customer. `PHP_INT_MAX` is the environment's largest integer; `OverflowException` signals range overflow, checked before addition.

~~~php
<?php
declare(strict_types=1);

function totalsByCustomer(array $orders): array
{
    $totals = [];

    foreach ($orders as $order) {
        if (!is_array($order)
            || !isset($order['customer_id'], $order['total'])
            || !is_int($order['customer_id']) || $order['customer_id'] < 1
            || !is_int($order['total']) || $order['total'] < 0) {
            throw new InvalidArgumentException('Invalid order');
        }

        $id = $order['customer_id'];
        $old = $totals[$id] ?? 0;

        if ($order['total'] > PHP_INT_MAX - $old) {
            throw new OverflowException('Customer total exceeds integer range');
        }

        $totals[$id] = $old + $order['total'];
    }

    return $totals;
}

$orders = [
    ['customer_id' => 1, 'total' => 100],
    ['customer_id' => 2, 'total' => 50],
    ['customer_id' => 1, 'total' => 20],
];

foreach (totalsByCustomer($orders) as $id => $total) {
    echo $id . ':' . $total . PHP_EOL;
}
~~~

Expected output:

~~~text
1:120
2:50
~~~

Replacing the training list with `[]` prints no customer lines. The function rejects non-array records, missing fields, and invalid types. Before adding, it checks whether the new amount exceeds `PHP_INT_MAX − old`. This avoids overflowing the addition itself and relies on the nonnegative-amount contract.

## Big O describes growth, not seconds

Input size **n** counts orders. **Time complexity** describes work growth; **space complexity** describes memory growth. Here space means additional memory excluding the input.

**Big O** gives a growth bound, not a stopwatch prediction. These introductory examples use it to describe the stated growth pattern under explicit assumptions.

| Growth | Example |
|---|---|
| O(1) | Work not growing with n, such as supported direct access |
| O(log n) | Repeatedly discarding half a sorted range |
| O(n) | One visit per element |
| O(n log n) | Common efficient sorting growth |
| O(n²) | Comparing each element with every element |

A **logarithm** here counts halvings until one: 1024 takes ten. **Binary search** discards half a sorted range; finding 7 in[1, 3, 5, 7, 9] checks 5 then the larger side. Unsorted data violates its prerequisite.

**Sorting** rearranges elements under a comparison rule. Sorting cost is not free.

## Map implementation matters

A **hash map** uses a function to locate a search area from a key. With suitable distribution and capacity management, lookup/update have expected O(1) cost. Processing n orders then has expected O(n) time and O(k) additional space for k distinct customers.

Not every map guarantees O(1). Many collisions can produce O(n) lookup in a conventional implementation. A tree-based ordered map can offer O(log n) operations. Interface names alone do not determine implementation.

**Best, average, and worst cases** describe different inputs. Linear search may match the first element immediately or inspect every element for a missing target. State the case and assumptions.

## Select a structure for the question

- **List/array:** positioned elements, with implementation-specific ordering/access details; useful when duplicates matter.
- **Set:**  distinct values without frequency counts; useful for “seen before?”
- **Queue:**  first in, first out.
- **Stack:**  last in, first out, like stacked plates.

A set can trade extra memory for faster duplicate checks. O(n) is not guaranteed faster on every small input than every simpler alternative; constants and allocation matter. Begin with correctness and clarity, then measure repeated runs and multiple sizes.

## Optional depth: a cart contract

Require nonnegative prices, positive integer quantities, and a discount from 0 to 100. Reject invalid inputs first; real monetary code also needs a representation and rounding policy.

~~~text
INPUT items, discountPercent
IF discountPercent < 0 OR discountPercent > 100:
    RETURN error
total = 0
FOR EACH item IN items:
    IF item.price < 0 OR item.quantity < 1:
        RETURN error
    total = total + item.price * item.quantity
RETURN total * (1 - discountPercent / 100)
~~~

The same input/rule/step/result reasoning applies. Validate types and shapes for the actual input source; pseudocode does not replace external validation.

## Optional depth: recursion

**Recursion** calls the same function on a smaller problem with a stopping case. A list sum can add the first item to the remaining list's sum, stopping at an empty list.

Each waiting call retains state on a call stack. Long recursive chains may use more memory than iteration; recursion is not automatically an optimization.

## Independent practice

1. Aggregate(customer 1, 10), (customer 1, 0), (customer 3, 7). Test empty input and amount−1.
2. If 100 outer iterations each inspect 100 orders, how many inspections? Compare one pass.
3. Why initialize a customer's sum at zero but not the largest value in an all-negative list?
4. Does every map guarantee constant time? How much additional aggregation space if all orders share one customer?

<details>
<summary>Answers and reasoning</summary>

1. {1: 10, 3: 7}; empty gives an empty map; −1 violates the contract.
2. About 10000 versus 100, under the stated loop counts. These are operation counts, not seconds.
3. Zero is the sum identity but may exceed every input in a list such as[−4].
4. No; implementation and assumptions matter. One customer requires one aggregation entry, O(1) relative to order count.

</details>

## Summary

Test ordinary, empty, single, duplicate, boundary, and invalid inputs. Calculate expected outcomes independently before running. Continue to [loop reasoning](/en/programming-basics/math-problem-solving/13-loop-reasoning/).
