---
title: "Measurement, units, and prime numbers"
description: "Measurement, units, and prime numbers"
tableOfContents: true
sidebar:
  order: 12
prev: {"link":"/en/programming-basics/math-problem-solving/10-greedy-dynamic-programming/","label":"Choose between greedy steps and saved results"}
next: {"link":"/en/programming-basics/math-problem-solving/11-counting-probability/","label":"Sequences, counting, and probability"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A correct formula applied to incompatible units can produce a wrong result. These are mathematical tools to revisit as needed: units, changing relationships, then primality. They are not prerequisites to finish before learning a language.

Know arithmetic, division, and remainders. Examples are on paper; implementation follows variables, conditions, and loops in your chosen language.

## Units belong to the contract

A service charges by the hour for 90 minutes. Do not multiply the hourly price by 90: `90/60=1.5` hours. At 20 pounds/hour, the charge is 30 pounds.

Hours × pounds/hour leaves pounds. A **unit conversion** rewrites the same quantity without changing the duration. Use compatible units before adding or comparing.

## Coordinates and slope describe change

A **coordinate pair**, `(x,y)`, locates a point using positions on two axes. For the cost model `y=2n+3`, n counts units and y is cost.

| n | y |
|---: |---: |
| 0 | 3 |
| 1 | 5 |
| 2 | 7 |

The **slope** is y's change per unit increase of n: 2 pounds/unit. Three is the **intercept**, the initial cost at n=0, like a fixed charge. Plotting these pairs represents the relationship; this coordinate graph is not the relationship graph in [path search](/en/programming-basics/math-problem-solving/12-graphs-and-search/).

## Rounding must match the question

**Floor** selects the greatest integer no larger than a value; **ceiling** selects the least integer no smaller. For−2.3 they give−3 and−2. **Round** chooses a nearest value under its tie rule.

Packing all items needs a ceiling, whereas counting full boxes needs an integer quotient. See [division and precision](/en/programming-basics/math-problem-solving/07-division-and-precision/) for complete executable examples. Rounding does not repair integer overflow.

## Optional depth: prime numbers

A **prime** is an integer greater than 1 with exactly two positive divisors: 1 and itself. One is not prime because it has only one positive divisor. Zero and negatives are outside this definition.

Every even integer above 2 is divisible by 2 and is not prime. Odd is not equivalent to prime: 9=3×3.

## Why stop at the square root?

If `n=a×b` and both factors exceed√n, their product exceeds n. Thus a composite number has a factor no greater than√n. The bound is **inclusive**: 49 requires testing 7.

For 29, `√29≈5.38`. Testing prime divisors 2, 3, 5 suffices; none divides 29, so it is prime. Without a known prime list, testing every integer from 2 through the root also works but performs extra checks.

This is a correctness argument, not a universal performance guarantee. Huge integers need suitable algorithms/libraries. Computing a root or squaring a divisor also requires attention to representation precision and range.

## Independent practice

1. At 12 pounds/hour, calculate a150-minute charge and show units.
2. For y=2n+3 find y at n=4, then the increase from 4 to 5.
3. Classify 1, 2, 9, 29, 49 as prime or not, giving a divisor for each composite.
4. Which value exposes a loop omitting a divisor equal to the square root?

<details>
<summary>Answers and acceptance criteria</summary>

1. 2.5 hours ×12=30 pounds. The units must reduce to money, not money×minutes.
2. Eleven, then 13: increase 2. Three is an initial fee, not a repeated increase.
3. One is neither prime nor composite; 2 and 29 are prime; 9 is divisible by 3 and 49 by 7.
4. Forty-nine requires testing 7. Explain the factor-pair argument, not only the slogan “up to the root.”

</details>

## Summary

State units, interpret the changing relationship, and justify loop bounds. Continue to [counting and probability](/en/programming-basics/math-problem-solving/11-counting-probability/) as needed.
