---
title: "Math foundations: remainder, ratios, averages, and powers"
description: "Core arithmetic appears directly in programs: remainder, percentages, rates, averages, powers, roots, and precedence. Connect every formula to the problem meaning before calculating."
tableOfContents: true
---

## Overview

Core arithmetic appears directly in programs: remainder, percentages, rates, averages, powers, roots, and precedence. Connect every formula to the problem meaning before calculating.

## Core concepts

- Remainder supports parity checks, cycles, and time conversion.
- A percentage is a part per hundred; discount = price × rate ÷ 100.
- A rate compares quantities with different units, such as km/hour.
- Arithmetic mean is sum divided by count and is sensitive to outliers.
- Use parentheses, powers, multiplication/division, then addition/subtraction; equal-precedence operations go left to right.

## Worked example

For a price of 800 with a 15% discount, the discount is 120 and the final price is 680. Subtracting 15 directly confuses a percentage with an amount.

## Corrections and common mistakes

- Avoid integer division when the result may contain a fraction.
- Carry units through calculations to catch invalid formulas.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Math foundations: remainder, ratios, averages, and powers">
<p class="lesson-diagram-title">Concept map: Math foundations: remainder, ratios, averages, and powers</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Core concepts</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Worked example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Core arithmetic appears directly in programs: remainder, percentages, rates,</span></div>
</div>
</div>

## Integer division, number theory, and precision

Integer division truncates the fractional part. For positive integers, `(count + size - 1) / size` computes ceiling division. Euclid's algorithm repeatedly replaces `(a, b)` with `(b, a % b)` to find the GCD; the LCM can then be derived carefully without overflowing intermediate values.

Modular arithmetic models cycles such as clocks and parity. Floating-point results are approximate, so comparisons may require a tolerance chosen for the problem's scale.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why can 9/5 break a temperature conversion in some languages?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> With two integer operands, integer division produces 1. Use 9.0/5.0 or convert an operand to a floating type.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>An 800 item gets 15% off, then 15% tax. Does it return to 800?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> No. Discount gives 680; tax is then 102, producing 782. The two percentages use different bases.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When can the arithmetic mean be misleading?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Outliers or skewed data can dominate it; the median and the distribution may communicate the situation better.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Convert 10,000 seconds into hours, minutes, and seconds using division and remainder.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Hours are 2 with 2800 left; minutes are 46 with 40 left, so the result is 2:46:40.</div></details>
</section>
</div>

## Summary

Connect the idea to its inputs and outcomes, then test normal, boundary, and invalid cases. Explanation and application matter more than memorized wording.
