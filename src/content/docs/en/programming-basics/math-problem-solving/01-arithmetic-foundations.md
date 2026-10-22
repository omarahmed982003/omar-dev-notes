---
title: "Ratios, averages, and powers"
description: "Ratios, averages, and powers"
tableOfContents: true
sidebar:
  order: 1
prev: {"link":"/en/programming-basics/math-problem-solving/","label":"Math and problem solving"}
next: {"link":"/en/programming-basics/math-problem-solving/07-division-and-precision/","label":"Division, remainders, and numerical precision"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Choose a calculation that expresses the requirement, not just a familiar symbol. The worked examples need ordinary addition, subtraction, multiplication, and division, not a programming language.

## Build one invoice step by step

You buy 3 notebooks at 20 pounds each. **Quantity** counts units; **unit price** prices one unit. The subtotal is `3 × 20 = 60` pounds.

A **percentage** expresses parts per hundred. A 10% discount removes 10 from every 100 pounds, not a fixed 10 pounds from any invoice.

| Step | Calculation | Meaning |
|---|---|---|
| Subtotal | 3 × 20 = 60 | Invoice pounds |
| Discount | 60 × 10 ÷ 100 = 6 | Pounds removed |
| Final amount | 60 − 6 = 54 | Pounds paid |

Buying 2 notebooks at 30 also totals 60. Equal results can come from different inputs; keep each number's meaning.

## Ratio or rate?

A **ratio** compares quantities: 2 out of 5 is `2/5 = 0.4 = 40%`. The fraction, decimal, and percentage express the same proportion.

A **rate** compares quantities with different units. Downloading 60 megabytes in 3 seconds gives `60 ÷ 3 = 20` megabytes/second. Units are part of the answer.

Convert to compatible units before combining values. Two seconds plus 300 milliseconds is 2300 milliseconds, or 2.3 seconds; one second contains 1000 milliseconds.

## An average does not describe everything

The **arithmetic mean** is the sum divided by the count. For `2, 4, 9`, the sum is 15 and the mean is 5.

The **median** is the middle value after sorting: 4 here. With an even count, average the middle two. For `2, 4, 9, 25` the median is `(4+9)/2 = 6.5`, but the mean is 10.

An **outlier** is unusually far from most values; 25 pulls the mean upward. An average response time can hide slow requests. The calculation is correct but may be an incomplete description.

An empty list has no arithmetic mean. Choose an explicit outcome, such as “no data, ” instead of dividing by zero or inventing a zero mean.

## Powers and roots

A **power** abbreviates repeated multiplication: `2³ = 2×2×2 = 8`. Two is the base and three the exponent. A nonzero base to power zero is 1: `5⁰=1`.

The **square root** symbol selects the nonnegative number whose square equals the given nonnegative value: `√25=5`. The equation `x²=25` has two solutions, 5 and −5; the root symbol itself selects the nonnegative one.

Repeated choice counts can grow as powers. See [counting](/en/programming-basics/math-problem-solving/11-counting-probability/) later; it is not a prerequisite here.

## Parentheses settle the intended calculation

In ordinary arithmetic, calculate parentheses, powers, multiplication/division, then addition/subtraction. Multiplication and division have equal precedence and proceed left to right; so do addition and subtraction.

`20 / 5 × 2 = 8`, whereas `20 / (5 × 2) = 2`.

Programming symbols can differ. In prose, `%` denotes a percentage; in PHP it calculates a remainder. PHP exponentiation uses `**`, not `^`. [The next lesson](/en/programming-basics/math-problem-solving/07-division-and-precision/) explains remainders and division.

## Try independently

1. Apply a 15% discount to 800, then a 15% tax to the discounted amount. Does it return to 800?
2. Find the mean and median of `10, 10, 10, 90`. Which better describes the common values?
3. Calculate `18 / 3 × 2` and `18 / (3 × 2)`. State units if the starting quantity is a duration and the other numbers are unitless.

<details>
<summary>Answers and reasoning</summary>

1. Discount 120, discounted amount 680, tax 102, final 782. The percentages use different bases.
2. Mean 30 and median 10. The median better reflects the repeated values here, but retain 90 as a potentially important unusual case.
3. Twelve and three, respectively. With seconds as the starting unit and unitless factors, both answers are seconds.

</details>

## Summary

Start with meaning and units, then select the operation. A percentage is not a fixed amount; a mean is not the whole distribution. Continue to [division, remainders, and numerical precision](/en/programming-basics/math-problem-solving/07-division-and-precision/).
