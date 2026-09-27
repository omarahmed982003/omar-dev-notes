---
title: "Learning roadmap and study rules"
description: "Start with a clear learning loop: understand, implement, test, and review. The goal is not to memorize tools but to build a repeatable problem-solving habit."
tableOfContents: true
sidebar:
  order: 1
prev: false
next: {"link":"/en/programming-basics/computer-in-depth/02-computers-data-processing/","label":"Computers, data, and the processing cycle"}
---

## Three outcomes you can explain

1. **Execution:** Draw the image-opening path from file to screen, then explain why some processor steps depend on earlier results.
2. **Memory:** Translate one virtual address, then distinguish a value’s lifetime from waiting transfer data. Calculate one example before adding terminology.
3. **Tools:** Create a practice file in the terminal, record its first Git snapshot, and test a change that introduces a defect.

Each outcome builds on the previous one. Complete the core exercise before following its extensions; memorizing tool names is not the goal.

## Overview

Start with a clear learning loop: understand, implement, test, and review. The goal is not to memorize tools but to build a repeatable problem-solving habit.

## Core concepts

- Programming is cumulative; implement a small example before moving on.
- Split study time between concepts, coding, and debugging.
- A useful question includes the goal, attempted steps, exact error, and expected result.
- Small projects expose gaps faster than passive watching.
- Review weekly and identify one concept that still needs explanation.

## Worked example

Choose a tiny program such as a discount calculator. Define its inputs, rules, and outputs before selecting a language.

## Corrections and common mistakes

- Do not measure progress only in hours; measure what you can explain and build.
- Do not copy a solution before attempting to decompose the problem.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Learning roadmap and study rules">
<p class="lesson-diagram-title">Concept map: Learning roadmap and study rules</p>
<div class="diagram-flow diagram-grid">
<div class="diagram-node input"><span>Understand one idea</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Build a small example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Solve without copying</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Review errors and feedback</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Return with spaced practice</span></div>
</div>
</div>

## Practice on a specific problem

For a discount calculator, price 100 and discount 10% should produce 90. Check 0% gives 100, 100% gives zero, and reject -1% or 101% under this contract.

A measurable week's evidence is explaining the percentage, running the example, correcting a program that subtracts 10 instead of 10% from 200, and independently solving 25% off 80: 60. A **boundary case** lies at the permitted edge, such as 0% or 100%. **Spaced practice** returns to the idea after intervals, rather than repeating only within one sitting.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is time spent watching a poor progress metric? Give two better metrics.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Watching measures exposure, not understanding. Better evidence is explaining the idea unaided and implementing or debugging a new example.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>You have only two study hours per week. How should you avoid passive learning?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Use a short block for concepts, most of the time for implementation and debugging, and finish by recording what is clear and what still needs review.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>What information makes a technical question efficient to answer?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Provide the goal, minimal reproduction, attempted steps, exact error, environment, and expected versus actual behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Design a test that proves understanding rather than memorization.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Rebuild without copying, change an important condition, predict before running, then explain the result and diagnose an intentionally introduced bug.</div></details>
</section>
</div>
