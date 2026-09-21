---
title: 8. Problem solving and algorithms
description: Turn a problem into steps, write pseudocode, choose data structures, and reason about complexity.
sidebar:
  order: 8
---

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

Pseudocode communicates logic without binding it to PHP, JavaScript, or another language.

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
| `O(1)` | Read a known key |
| `O(log n)` | Binary search in sorted data |
| `O(n)` | Scan a list once |
| `O(n log n)` | Common efficient sorts |
| `O(n²)` | Compare every item with every item |

Correctness and clarity come first. Measure before optimizing because constants and real workloads still matter.

## Exercise

Given orders containing `customer_id` and `total`, design an algorithm that returns a total per customer. Define edge cases, use a map for `O(n)` traversal, and write three test cases before the implementation.

