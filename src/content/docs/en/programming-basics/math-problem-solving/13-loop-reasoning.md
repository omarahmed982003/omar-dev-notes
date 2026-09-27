---
title: "Why does a loop work and stop?"
description: "Why does a loop work and stop?"
sidebar:
  order: 9
prev: {"link":"/en/programming-basics/08-problem-solving-algorithms/","label":"Comparing algorithms and data structures"}
next: {"link":"/en/programming-basics/math-problem-solving/09-solution-patterns/","label":"Turn solution patterns into steps"}
---

Return to the trace for summing 1 through 3. Before each iteration ask what has already been computed. A **loop invariant** remains true at a specified point in every iteration, not just one sample run.

## Trace, then justify

Before i=1 the sum is 0; before i=2 it is 1; before i=3 it is 3. Each time sum contains all integers before i. Adding i preserves the claim for the next iteration. Remaining values decrease to zero, so the loop stops. This distinguishes sample testing from reasoning about correctness.

The **loop invariant** is that before each test, sum contains integers1 through i−1. It starts true because an empty sum is0, and adding i preserves it. A **variant**, a quantity moving toward termination, is the count of remaining values N−i+1 while the loop continues; it decreases by one each iteration.

**Nested loops** are not automatically quadratic. If the outer loop runs n times and the inner runs3 times, total work is3n, or linear O(n). If the inner loop runs n times for every outer iteration, work is n². Count the steps before labeling growth.

**Try:** four outer iterations and three inner iterations execute the body 12 times. If their counts vary independently, call them n and m: n×m, not necessarily n².
