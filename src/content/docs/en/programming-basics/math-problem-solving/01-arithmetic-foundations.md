---
title: "Ratios, averages, and powers"
description: "Ratios, averages, and powers"
tableOfContents: true
prev: false
next: {"link":"/en/programming-basics/math-problem-solving/07-division-and-precision/","label":"Division, remainders, and numerical precision"}
sidebar:
  order: 1
---

Use this section after [values, decisions, and loops](/en/programming-basics/computer-fundamentals/10-decisions-and-repetition/). Review arithmetic when needed; graphs, complexity, and dynamic programming are later extensions, not first-program prerequisites.



## One calculation with meaning

Three notebooks at 20 cost `3×20=60`. A 10% discount is `60×10÷100=6`, leaving 54. **Try:** price 30 and quantity 2 still total 60. The power `2³` is `2×2×2=8`; `√25=5` because `5×5=25`. The percent sign in prose differs from a language’s remainder operator.

## Overview

Core arithmetic appears directly in programs: remainder, percentages, rates, averages, powers, roots, and precedence. Connect every formula to the problem meaning before calculating.

## Core concepts

- Remainder supports parity checks, cycles, and time conversion.
- A percentage is a part per hundred; discount = price × rate ÷ 100.
- A rate compares quantities with different units, such as km/hour.
- Arithmetic mean is sum divided by count and is sensitive to outliers.
- Use parentheses, powers, multiplication/division, then addition/subtraction; multiplication/division and addition/subtraction associate left to right. Powers and programming operators may associate differently; use parentheses to state intent.

## Worked example

For a price of 800 with a 15% discount, the discount is 120 and the final price is 680. Subtracting 15 directly confuses a percentage with an amount.

## Corrections and common mistakes

- Avoid integer division when the result may contain a fraction.
- Carry units through calculations to catch invalid formulas.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Math foundations: remainder, ratios, averages, and powers">
<p class="lesson-diagram-title">Concept map: Math foundations: remainder, ratios, averages, and powers</p>
<div class="diagram-flow diagram-grid">
<div class="diagram-node input"><span>Value and meaning</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Choose the operation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Calculate with units</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Test zero and boundaries</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Interpret the result</span></div>
</div>
</div>

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

## Next step

After completing this practice, continue with [Division, remainders, and numerical precision](/en/programming-basics/math-problem-solving/07-division-and-precision/).
