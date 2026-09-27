---
title: "Turn solution patterns into steps"
description: "Turn solution patterns into steps"
sidebar:
  order: 10
prev: {"link":"/en/programming-basics/math-problem-solving/13-loop-reasoning/","label":"Why does a loop work and stop?"}
next: {"link":"/en/programming-basics/math-problem-solving/10-greedy-dynamic-programming/","label":"Choose between greedy steps and saved results"}
---

A pattern name is not a solution. Use a small list to count frequencies and sum a range, then learn when sorted order justifies moving two pointers. Calculate the answer manually before choosing the method.


## Turn pattern names into steps

For [2,1,2,3], a **frequency map** associates each value with its count: {2:2,1:1,3:1}. A **set** stores only distinct values, {1,2,3}, answering whether a value appeared before.

A **prefix sum** array for [2,1,2,3] is P=[0,2,3,5,8]. The initial zero represents no elements. With element positions starting at1, positions2 through4 sum to P[4]−P[1]=8−2=6. Building P visits the list once; each range query then needs two lookups and a subtraction.

**Two pointers** can find two values summing to9 in the sorted list [1,3,5,8]. Start at both ends:1+8=9. If the sum is too small, move the lower pointer right; if too large, move the upper pointer left. Sorted order justifies discarding those candidates; the rule does not work unchanged on an unsorted list.

**Brute force** tries every pair: n(n−1)/2 pairs for n elements. Growing from10 to100 elements raises the count from45 to4950. This quadratic growth is written O(n²). Visiting n elements once is linear, O(n). Constant work, O(1), does not grow with n; it does not mean one second.

**Greedy** chooses the best immediate step and needs a correctness argument; see the coin counterexample in the next lesson’s worked coin example. **Dynamic programming** saves results of repeated smaller problems; optimization problems also need an appropriate relationship between optimal smaller solutions and the whole solution. **Recursion** means a function calls itself on a smaller input with a stopping case; not every recursive solution is dynamic programming. **Divide and conquer** solves smaller parts and combines them, as when sorting two halves and merging them.

**Worked check:** [4,4,2] contains two4s, two distinct values, and sums to10. Under this contract an empty list sums to0; "hello" is rejected because inputs must be numbers. **Overflow** occurs when a result cannot fit its numeric type; check bounds before trusting the result.
