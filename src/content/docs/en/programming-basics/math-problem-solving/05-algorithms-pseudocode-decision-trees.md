---
title: "Algorithms, pseudocode, and decision trees"
description: "Pseudocode and decision trees model thinking before code: pseudocode emphasizes sequence, while a tree emphasizes branching decision paths."
tableOfContents: true
sidebar:
  order: 6
prev: {"link":"/en/programming-basics/math-problem-solving/04-computational-thinking/","label":"Computational thinking and requirements analysis"}
next: {"link":"/en/programming-basics/math-problem-solving/06-flowcharts-loops-debugging/","label":"Flowcharts, loops, and debugging"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Find the largest of three values. Instead of listing every ordering, retain the best value so far and update it. An **algorithm** consists of precise steps satisfying an input/output contract.

Know comparison and assignment from [logic](/en/programming-basics/math-problem-solving/02-variables-equations-logic/). These are manual descriptions, not terminal commands.

## Pseudocode expresses the steps

**Pseudocode** describes a solution without a programming language's exact syntax. `read` obtains input, `if` tests a condition, and `print` displays. Here `=` assigns and `>` compares.

Assume three valid numbers a, b, c. Business examples should favor meaningful names such as price or balance.

~~~text
read a, b, c
largest = a
if b > largest:
    largest = b
if c > largest:
    largest = c
print largest
~~~

## Trace negative values

Use `a=−7,b=−2,c=−5`.

| Step | largest | Reason |
|---|---: |---|
| Initialize | −7 | First actual input |
| Compare b | −2 | −2 exceeds−7 |
| Compare c | −2 | −5 does not exceed−2 |
| Finish | −2 | Largest input |

Initializing at zero incorrectly retains zero for all-negative inputs. The failure is the initial value, not the comparison symbol.

Two comparisons then a result make the steps finite. One example tests an important path but does not prove correctness for all inputs.

## A decision tree expresses real branches

A **decision tree** asks questions and follows branches to a **leaf**, an endpoint returning a result. `>=` means greater than or equal.

<figure class="teaching-figure">
  <img src="/diagrams/foundations/math/maximum-tree-en.svg" alt="Compare a with b, then compare the larger of them with c; each leaf returns a maximum." loading="lazy" />
  <figcaption>With a = −7, b = −2, c = −5, follow No then Yes and return b = −2. Each decision has two connected branches.</figcaption>
</figure>

For−7, −2, −5 follow No, then Yes, returning b. When all three are equal, any input has the same largest value.

A manageable three-value tree becomes unwieldy for long lists. Repeating “update the largest” scales the description naturally. Different representations can produce the same answer.

## State what must hold before and after

A **precondition** requires valid numeric inputs. A **postcondition** requires the result to be an input value with no larger input.

For a list, a **loop invariant** says that after each inspected element, largest is the largest inspected value. Each iteration inspects a new element, reducing remaining work and explaining **termination**.

An empty list needs an explicit outcome, such as “no value, ” before reading its first element. See [loop reasoning](/en/programming-basics/math-problem-solving/13-loop-reasoning/).

## Validate before business decisions

A member qualifies for a discount when price is at least 100. Reject invalid prices first, then test membership and the threshold. Test member 99, member 100, nonmember 100, and a negative price.

Every branch needs an outcome. Large trees may be clearer as a decision table or named conditions.

## Optional depth: decisions depending on past state

A **state machine** defines allowed states and transitions. Under “new → paid → shipped, ” a new order cannot become shipped directly.

Unlike the largest-value question, this decision depends on stored state as well as current input. Greedy and dynamic programming have [a later coin example](/en/programming-basics/math-problem-solving/10-greedy-dynamic-programming/) and are not prerequisites here.

## Independent practice

1. Trace−4, −4, −9 and then 0, 5, 5.
2. Why is zero not a universally valid initialization?
3. Classify member 99, member 100, nonmember 100, and price−1 for discount eligibility; no discount rate is specified.
4. May an empty list silently return zero as its largest element?

<details>
<summary>Answers and reasoning</summary>

1. Results−4 and 5. Equality needs no update when the current largest already holds that value.
2. Zero may not be an input and may exceed every input.
3. Ineligible, eligible, ineligible, and invalid before eligibility.
4. No. Choose and document “no value” or another explicit contract outcome.

</details>

## Summary

Write precise steps, trace them, and check all endpoints and input boundaries. Continue to [flowcharts, loops, and debugging](/en/programming-basics/math-problem-solving/06-flowcharts-loops-debugging/).
