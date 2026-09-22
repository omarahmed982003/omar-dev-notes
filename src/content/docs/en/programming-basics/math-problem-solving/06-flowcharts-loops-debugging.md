---
title: "Flowcharts, loops, and debugging"
description: "A flowchart visualizes execution, loops represent repetition, and debugging compares actual behavior with intended behavior."
tableOfContents: true
---

## Overview

A flowchart visualizes execution, loops represent repetition, and debugging compares actual behavior with intended behavior.

## Core concepts

- Start/end uses an oval, processing a rectangle, decisions a diamond, and input/output a parallelogram.
- Every decision should label its outgoing branches, commonly yes and no.
- A loop needs initialization, a continuation condition, and an update; missing the update often causes an infinite loop.
- A counter counts items, an accumulator combines values, and a sentinel ends input.
- A trace table records variable values each iteration and exposes logic errors.

## Worked example

To sum 1..N: initialize sum=0 and i=1; while i≤N, add i to sum and increment i; print sum after the loop.

## Corrections and common mistakes

- A flowchart communicates logic but does not replace testing.
- A program can run without errors and still contain a logic defect.

<div class="lesson-diagram" role="img" aria-label="Loop flow: the update returns execution to the condition check">
<p class="lesson-diagram-title">Loop flow: the update returns execution to the condition check</p>
<div class="diagram-flow">
<div class="diagram-node start"><span>Start / initialize</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Condition true?</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Run loop body</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Update state</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Exit when false</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Which three loop elements must be checked to prevent an infinite loop?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Initialization, continuation condition, and an update on every path. The update must move state toward making the condition false.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>How do a counter, accumulator, and sentinel differ?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A counter counts events, an accumulator combines values, and a sentinel is a special value that terminates input and is usually excluded from calculation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>A 1..N sum is too large by N. What should you inspect first?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Check initialization and bounds: sum may start at N or the loop may include N+1. A trace table reveals the first wrong iteration.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Design a three-attempt login without an off-by-one bug.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Start attempts at zero, increment after each failure, and continue while not successful and attempts&lt;3. Test first/third success and three failures.</div></details>
</section>
</div>

## Summary

Connect the idea to its inputs and outcomes, then test normal, boundary, and invalid cases. Explanation and application matter more than memorized wording.
