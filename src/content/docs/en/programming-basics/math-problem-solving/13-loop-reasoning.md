---
title: "Why does a loop work and stop?"
description: "Why does a loop work and stop?"
sidebar:
  order: 9
prev: {"link":"/en/programming-basics/08-problem-solving-algorithms/","label":"Comparing algorithms and data structures"}
next: {"link":"/en/programming-basics/math-problem-solving/09-solution-patterns/","label":"Turn solution patterns into steps"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A passing example does not prove a loop works for every valid input. Revisit summing 1 through N and explain both correctness and termination.

Use the [loop trace](/en/programming-basics/math-problem-solving/06-flowcharts-loops-debugging/). This is paper reasoning, not a new language requirement.

## State a fact at one fixed point

A **loop invariant** remains true at a specified point in every iteration. Here: **before testing the condition, sum contains the sum of integers 1 through i−1**.

For N=3, before i=1 sum=0; before i=2 sum=1; before i=3 sum=3. The invariant describes completed work, not the final result at every moment.

## Initialization, preservation, exit

1. **Initialization:**  i=1, sum=0. There are no earlier values in the range, so the empty sum is zero.
2. **Preservation:**  assume the fact before an iteration. Add i, then increment i. At the next test, sum contains exactly the values preceding the new i.
3. **Exit:**  at i=N+1, sum contains 1 through N and i≤N is false. For N=0 the first test fails and sum remains zero.

The update order matters. Incrementing i before adding changes the algorithm; do not reuse a proof for different steps.

## Why does it terminate?

A **variant** is a quantity decreasing toward termination. While the loop continues, `N−i+1` counts remaining values. It is nonnegative and decreases by one each iteration until zero.

Assume N is a nonnegative integer and the implementation's counter and sum remain in range. Paper integers are unbounded; PHP integers are not. Review the loop code's contract before choosing huge values.

## Optional depth: count nested loops

**Nested loops** are not automatically quadratic. An outer loop running n times with a fixed three inner iterations performs 3n body executions: linear O(n) growth.

If the inner loop runs n times each time, work is n². Independent counts n and m give n×m, not necessarily n². **Big O** describes growth rather than seconds; see [algorithm comparison](/en/programming-basics/08-problem-solving-algorithms/).

## Independent practice

1. State the invariant before every condition check for N=2, including the final failed check.
2. Is “sum equals the final 1..N sum before every iteration” an invariant?
3. Count four outer iterations with three inner iterations; then independent n and m.
4. Does increasing sum prove termination if i never changes?

<details>
<summary>Answers and acceptance criteria</summary>

1. (i, sum) is(1, 0), (2, 1), (3, 3). Each sum covers values before i; the last test fails.
2. No. At initialization sum=0, but the final result for N=2 is 3. Describe completed work instead.
3. Twelve, then n×m. With fixed m=3, growth with n is linear.
4. No. The exit condition depends on i, so a relevant quantity must approach exit. Explain initialization, preservation, exit, and termination; one output alone is insufficient.

</details>

## Summary

Tests reveal defects; reasoning explains correctness within a contract. Continue to [solution patterns](/en/programming-basics/math-problem-solving/09-solution-patterns/).
