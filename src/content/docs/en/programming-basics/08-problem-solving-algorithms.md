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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Problem solving and algorithms">
<p class="lesson-diagram-title">Concept map: Problem solving and algorithms</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>From a problem to a program</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Choose a data structure</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Big O</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Exercise</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “From a problem to a program” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Before coding, define inputs, outputs, rules, small testable steps, and boundary or invalid cases. Pseudocode communicates logic without binding it to PHP, JavaScript, or another language. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “From a problem to a program” with “Choose a data structure”. Why does neither replace the other in “Problem solving and algorithms”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “From a problem to a program”: Before coding, define inputs, outputs, rules, small testable steps, and boundary or invalid cases. Pseudocode communicates logic without binding it to PHP, JavaScript, or another language. For “Choose a data structure”: | Need | Useful structure | |---|---| | Ordered values with duplicates | List/array | | Lookup by key | Map/associative array | | Unique membership | Set | | First in, first out | Queue | | Last in, first out | Stack | A good structure improves clarity and cost. A map can replace a repeated nested search with direct lookup. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Big O”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Big O describes how time or memory grows with input size, not exact seconds. | Complexity | Example | |---|---| | O(1) | Read a known key | | O(log n) | Binary search in sorted data | | O(n) | Scan a list once | | O(n log n) | Common efficient sorts | | O(n²) | Compare every item with every item | Correctness and clarity come first. Measure before optimizing because constants and real workloads still matter. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Exercise” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Given orders containing customer_id and total, design an algorithm that returns a total per customer. Define edge cases, use a map for O(n) traversal, and write three test cases before the implementation. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
