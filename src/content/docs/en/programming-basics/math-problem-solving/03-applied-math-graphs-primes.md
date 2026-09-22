---
title: "Applied math, measurement, graphs, and prime numbers"
description: "Applied mathematics connects numbers to units and representations. Conversion, rounding, coordinates, graphs, and primes are practical tools rather than isolated formulas."
tableOfContents: true
---

## Overview

Applied mathematics connects numbers to units and representations. Conversion, rounding, coordinates, graphs, and primes are practical tools rather than isolated formulas.

## Core concepts

- Choose units before calculating and convert values to a common unit.
- floor moves downward and ceil upward, including for negatives; round chooses the nearest value.
- A coordinate (x,y) identifies a point, and a graph shows how variables change together.
- For y=2n+3, slope 2 means y rises by 2 when n rises by 1.
- To test n for primality, checking divisors through √n is sufficient.

## Worked example

To test 29, try prime divisors up to √29≈5.38: 2, 3, and 5. None divides it, so 29 is prime.

## Corrections and common mistakes

- ceil(-2.3) is -2, not -3.
- One is not prime, and every even number greater than two is composite.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Applied math, measurement, graphs, and prime numbers">
<p class="lesson-diagram-title">Concept map: Applied math, measurement, graphs, and prime numbers</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Core concepts</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Worked example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Applied mathematics connects numbers to units and representations. Conversion,</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is ceil(-2.3) -2 while floor(-2.3) is -3?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Ceil is the smallest integer not below the value; floor is the greatest integer not above it.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Prove why primality testing only needs divisors through √n.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> If n=a×b and both factors exceeded √n, their product would exceed n. Every composite factor pair therefore has at least one factor at or below √n.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>What does slope 2 mean in y=2n+3?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Each one-unit increase in n increases y by two; 3 is the intercept, or the value at n=0.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Why is testing that 1 is not divisible by 2 insufficient to call it prime?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A prime has exactly two positive divisors: 1 and itself. One has only one positive divisor.</div></details>
</section>
</div>

## Summary

Connect the idea to its inputs and outcomes, then test normal, boundary, and invalid cases. Explanation and application matter more than memorized wording.
