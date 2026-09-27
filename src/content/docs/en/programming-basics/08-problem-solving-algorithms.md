---
title: "Comparing algorithms and data structures"
description: Turn a problem into steps, write pseudocode, choose data structures, and reason about complexity.
sidebar:
  order: 8
prev: {"link":"/en/programming-basics/math-problem-solving/06-flowcharts-loops-debugging/","label":"Flowcharts, loops, and debugging"}
next: {"link":"/en/programming-basics/math-problem-solving/13-loop-reasoning/","label":"Why does a loop work and stop?"}
---

Start after practicing variables, loops, and lists in your chosen language.


## Before the details

Programming begins before code: define inputs, outputs, and constraints; write testable steps; then choose data structures and complexity that fit the expected size.

## From a problem to a program

Before coding, define inputs, outputs, rules, small testable steps, and boundary or invalid cases.

```text
INPUT items, discountPercent
IF discountPercent < 0 OR discountPercent > 100
    RETURN error
total = 0
FOR EACH item IN items
    IF item.price < 0 OR item.quantity < 1
        RETURN error
    total = total + item.price * item.quantity
RETURN total * (1 - discountPercent / 100)
```

Pseudocode communicates logic without binding it to PHP (a programming language commonly used for server-side web processing), JavaScript, or another language.

## Choose a data structure

| Need | Useful structure |
|---|---|
| Ordered values with duplicates | List/array |
| Lookup by key | Map/associative array |
| Unique membership | Set |
| First in, first out | Queue |
| Last in, first out | Stack |

A good structure improves clarity and cost. A map can replace a repeated nested search with direct lookup.

## Big O

Big O describes how time or memory grows with input size, not exact seconds.

| Complexity | Example |
|---|---|
| `O(1)` | Read a known position in a random-access array |
| `O(log n)` | Binary search in sorted data |
| `O(n)` | Scan a list once |
| `O(n log n)` | Common efficient sorts |
| `O(n²)` | Compare every item with every item |

Correctness and clarity come first. Measure before optimizing because constants and real workloads still matter.

## Exercise

Given orders containing `customer_id` and `total`, design an algorithm that returns a total per customer. Define edge cases, use a map for `O(n)` traversal, and write three test cases before the implementation.

## Practical problems

<details><summary>When is a list better than a set?</summary><p>When order, duplicates, or sequential traversal matter and fast membership tests do not justify a set.</p></details>

<details><summary>Why is success on three items insufficient?</summary><p>An algorithm may become impractical at one million items. Verify correctness, then estimate time and memory growth.</p></details>

<details><summary>What is pseudocode for?</summary><p>It separates solution logic from language syntax, exposing missing cases before implementation details.</p></details>

## Solve the customer exercise and explain the structures

A **list/array** stores elements accessible by position, such as [8,3,8]. A **map** associates a key with a value, such as a customer ID and total. A **set** keeps distinct values. A **queue** removes the oldest item first, like a waiting line; a **stack** removes the newest first, like stacked plates. Ordering and performance depend on the language and implementation.

A **lookup** retrieves a value. Accessing a known array position is typically O(1). A **hash map** uses a function to locate a key's search area; lookup is expected O(1) under suitable distribution and capacity management, but a conventional implementation may take O(n) in the worst case when many keys collide. A tree-based ordered map may provide O(log n). Not every map operation is constant time.

**Binary search** discards half a sorted range at each step. To find7 in [1,3,5,7,9], inspect5 and continue in the greater half. log₂n counts repeated divisions by2 until1;1024 needs10 divisions. Sorting rearranges elements under a rule, such as ascending value.

The customer contract accepts a positive integer customer ID and a nonnegative total, rejecting other values. For this example amounts use small integer currency units, such as cents, to avoid fractional rounding. Empty input returns an empty map.

```text
totals = empty map
for each order in orders:
    validate order.customer_id and order.total
    old = totals.get(order.customer_id, default=0)
    totals[order.customer_id] = old + order.total
return totals
```

get retrieves the value or0 for a new customer; validate applies the rules above and is not a supplied language function. Inputs (customer1,100), (customer2,50), (customer1,20) produce {1:120,2:50}; a total of−1 is rejected. With a suitable hash map, expected time is O(n) and extra space O(k) for k distinct customers.

A **precondition** specifies valid starting input; a **postcondition** specifies the required result. The **invariant** is that after each order, the map totals all examined orders for each customer. **Termination** follows from processing a finite list. **Recursion** calls the same function on a smaller problem and needs a stopping case; summing a list can add the first item to the sum of the rest (Representational State Transfer, an architectural style with resources, a uniform interface, and stateless interactions), stopping at an empty list. Waiting calls consume call-stack space, so a loop may be simpler for a long sequence.

**Worked check:** the maximum of [−4] is−4; empty input returns "no value" under this contract. After each examined item, largest represents the greatest value seen; initializing it to zero fails on negative-only lists.


## Complexity, solution patterns, and test design

Best, average, and worst cases may perform different amounts of work. Time complexity tracks operation growth; space complexity tracks additional memory. A hash set may spend memory to reduce repeated searches.

Common patterns include brute force, simulation, frequency maps, prefix sums, two pointers, and greedy choice. Each depends on constraints and correctness reasoning rather than its name alone.

Tests should cover equivalence classes, boundaries, empty and single-element input, duplicates, large values, invalid data, and overflow. Write the expected result independently before comparing program output.

## Next step


After completing this practice, continue with [Choose between greedy steps and saved results](/en/programming-basics/math-problem-solving/10-greedy-dynamic-programming/).



After completing this practice, continue with [Turn solution patterns into steps](/en/programming-basics/math-problem-solving/09-solution-patterns/).
