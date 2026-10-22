---
title: "Sequences, counting, and probability"
description: "Sequences, counting, and probability"
sidebar:
  order: 13
prev: {"link":"/en/programming-basics/math-problem-solving/03-applied-math-graphs-primes/","label":"Measurement, units, and prime numbers"}
next: {"link":"/en/programming-basics/math-problem-solving/12-graphs-and-search/","label":"Draw relationships and search for a path"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Two shirts and three trousers produce how many outfits? List three trousers for each shirt: six. Count actual choices before selecting a formula.

Know sets, multiplication, and fractions from earlier lessons. All examples can be solved on paper. This is optional depth, not a first-program prerequisite.

## The multiplication principle

If a first step has a choices and each permits b choices at the next step, there are a×b combinations. The second count must be b for every first choice.

This is not a claim of probabilistic independence. If one shirt matches only one pair of trousers, 2×3 no longer models the choices.

## Ordered roles or an unordered group?

**Permutations** distinguish order or roles. A leader and deputy from four different people, without repetition, have 4×3=12 possibilities.

**Combinations** choose a group without roles. Two members from four have 12/2=6 possibilities because each pair was counted in both orders.

A **factorial**, n!, multiplies 1 through n; 0!=1. Four distinct people can stand in 4!=24 orders. Large factorials require range checks, formula simplification, or a suitable numeric type; 20! exceeds a32-bit integer.

## Account for overlapping sets

From [sets](/en/programming-basics/math-problem-solving/08-sets-relations/), let `A={1,2,3}` and `B={3,4}`. Their **union** contains four learners passing at least one test. Their **intersection** contains one passing both.

Adding 3+2 counts learner 3 twice, so subtract overlap: `3+2−1=4`. The **difference** A−B={1, 2} passes only the first. Keep operations meaningful before counting.

## Probability requires a model

A **sample space** contains all possible outcomes. An **event** is a subset of outcomes of interest. A **probability** lies from 0 to 1. In our finite models with equally likely outcomes, 0 means no favorable outcomes and 1 means all outcomes are favorable.

A fair die has six equally likely results. “Even” is{2, 4, 6}, giving 3/6=1/2. Favorable-count divided by total-count depends on equal likelihood here; it does not apply unchanged to a biased die.

## Conditioning changes the calculation

**Conditional probability** incorporates known information. Given a die result above 3, remaining outcomes are{4, 5, 6}; two are even, so the probability is 2/3.

**Independence** means learning one event does not change the probability of the other, when the relevant conditional probabilities are defined. For independent fair dice, learning the first result does not change the second die's distribution. Multiplying choice counts alone does not establish independence.

## Drawing with or without replacement

A bag contains two red balls and one blue. Assume every available ball is equally likely to be selected.

- **Without replacement:**  first-red probability 2/3; after it, one red remains among two balls, so the second probability is 1/2. Both-red probability is 1/3.
- **With replacement and remixing under the same model:**  the second probability is again 2/3, giving 4/9.

The probability at the second stage changed; the multiplication rule did not.

## Optional depth: sequences and recurrences

A **sequence** orders values. An **arithmetic sequence** adds a fixed difference: 3, 5, 7, 9. Term n, starting at 1, is `3+2(n−1)`. A **geometric sequence** multiplies by a fixed ratio: 3, 6, 12, 24, with term `3×2^(n−1)`. The caret denotes mathematical exponentiation here, not a shared programming operator.

A **recurrence** defines a term from earlier terms. Fibonacci states **base cases** F(0)=0, F(1)=1 and then `F(n)=F(n−1)+F(n−2)` for n≥2. They produce 0, 1, 1, 2, 3, 5. The recurrence alone does not supply an initial value.

A direct formula may avoid generating every earlier term, but the result still needs a suitable numeric representation. Floor, ceiling, and rounding ties, including−2.3 and 2.5, belong to [numerical precision](/en/programming-basics/math-problem-solving/07-division-and-precision/), not the sequence definition.

## Optional depth: pseudorandom programs

A **pseudorandom** sequence comes from an algorithm and an initial state called a **seed**. The same algorithm and seed reproduce the sequence, useful for repeating simulation tests.

Passwords and keys require a security-designed generator. Seeding an ordinary generator with the current time is insufficient. This is a boundary note, not a security-implementation lesson.

## Independent practice

1. Three shirts each match four trousers. How many outfits? What if one shirt matches only two?
2. Choose a leader and deputy from five without repetition, then choose two members without roles.
3. A bag has three red and two blue balls. Find two-red probability without replacement, then with replacement and remixing.
4. Given a fair die result above 2, what is the probability of even?
5. Find term five of 3, 5, 7, … and 3, 6, 12, …, and Fibonacci F(5).

<details>
<summary>Answers and acceptance criteria</summary>

1. Twelve; then 4+4+2=10. Explain why available choices changed.
2. Twenty ordered assignments; ten unordered pairs.
3. (3/5)×(2/4)=3/10 without replacement; (3/5)²=9/25 with it.
4. Remaining{3, 4, 5, 6}, of which{4, 6} are even: 1/2.
5. Eleven, 48, andF(5)=5. State starting positions and counting/drawing assumptions; write the remaining outcomes before computing the probability.

</details>

## Summary

Distinguish order from selection, account for overlap, and state probability assumptions. Continue to [graphs and path search](/en/programming-basics/math-problem-solving/12-graphs-and-search/) when representing relationships is useful.
