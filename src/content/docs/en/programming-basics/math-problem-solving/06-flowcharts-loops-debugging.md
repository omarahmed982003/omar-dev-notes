---
title: "Flowcharts, loops, and debugging"
description: "A flowchart visualizes execution, loops represent repetition, and debugging compares actual behavior with intended behavior."
tableOfContents: true
prev: {"link":"/en/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees/","label":"Algorithms, pseudocode, and decision trees"}
next: {"link":"/en/programming-basics/08-problem-solving-algorithms/","label":"Comparing algorithms and data structures"}
sidebar:
  order: 7
---

Use this section after [values, decisions, and loops](/en/programming-basics/computer-fundamentals/10-decisions-and-repetition/). Review arithmetic when needed; graphs, complexity, and dynamic programming are later extensions, not first-program prerequisites.


## Overview

A flowchart visualizes execution, loops represent repetition, and debugging compares actual behavior with intended behavior.

## Core concepts

- Start/end uses an oval, processing a rectangle, decisions a diamond, and input/output a parallelogram.
- Every decision should label its outgoing branches, commonly yes and no.
- A loop needs initialization, a continuation condition, and an update; missing the update often causes an infinite loop.
- A counter counts items, an accumulator combines values, and a sentinel ends input.
- A trace table records variable values each iteration and exposes logic errors.

## Worked example

To sum `1..N`, initialize `sum = 0` and `i = 1`; while `i <= N`, add `i` to `sum` and increment `i`; print `sum` after the loop.

## Corrections and common mistakes

- A flowchart communicates logic but does not replace testing.
- A program can run without errors and still contain a logic defect.

<div class="lesson-diagram" role="img" aria-label="Condition: yes returns to the test, no exits">
<p class="lesson-diagram-title">Two explicit paths from the condition</p>
<div class="diagram-flow">
<div class="diagram-node start"><span>Start: sum=0, i=1</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>i ≤ N?</span></div>
</div>
<div class="diagram-branches">
<div class="diagram-node process"><span>Yes: add i, increment i, then return to i≤N</span></div>
<div class="diagram-node output"><span>No: print sum, then stop</span></div>
</div>
</div>

## Trace the loop one iteration at a time

A **counter** counts events, such as attempts. An **accumulator** combines values, such as sum for prices. A **sentinel** is an agreed stopping marker, such as "stop" to end input; it must not conflict with valid data.

To sum1 throughN, require a nonnegative integer N:

| Before testing | i | sum | Is i≤3? | After the iteration |
|---|---:|---:|---|---|
| Initial |1|0|yes|sum=1, i=2|
| Second |2|1|yes|sum=3, i=3|
| Third |3|3|yes|sum=6, i=4|
| Fourth |4|6|no|exit and print6|

The update returns to the condition; exit is the condition's "no" branch. N=0 runs zero iterations and returns0; N=1 returns1. An **off-by-one** error adds or omits one iteration. Using i<N instead of i≤N returns3 for N=3 because it omits the final3.

**Worked check:** omitting i=i+1 leaves the condition true for N≥1. Watch i in a trace table or a debugger that pauses execution one step at a time; after fixing it, retest0,1,3.

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
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Check initialization and bounds: sum may start at N or count N twice. Including N+1 adds N+1 rather than N: for N=3 the correct sum is 6, and including 4 gives 10. A trace table reveals the first wrong iteration.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Design a three-attempt login without an off-by-one bug.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Start attempts at zero, increment after each failure, and continue while not successful and attempts&lt;3. Test first/third success and three failures.</div></details>
</section>
</div>
