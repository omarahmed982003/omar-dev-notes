---
title: "Decision trees, flowcharts, and debugging review"
description: "Before writing C++, stabilize the solution logic: define inputs and output, write the steps, model decisions, and dry-run the algorithm. The language implements the reasoning; it does not replace it."
tableOfContents: true
---

## Overview

Before writing C++, stabilize the solution logic: define inputs and output, write the steps, model decisions, and dry-run the algorithm. The language implements the reasoning; it does not replace it.

## Concepts you need

- Use pseudocode for sequence and a flowchart for visible branches.
- Design the valid path, then add boundaries and invalid inputs.
- Syntax errors stop the build; logic errors produce wrong answers even when the program runs.
- A trace table records variable values after each step and exposes divergence.

## Example

```text
READ a, b
IF b = 0 THEN
  PRINT "Division is undefined"
ELSE
  PRINT a / b
END IF
```

## Corrections and common mistakes

- Do not test only easy values; include zero, boundaries, and negatives.
- A diagram must reflect real execution paths, not act as decoration.

<div class="lesson-diagram" role="img" aria-label="From problem analysis to a verifiable result">
<p class="lesson-diagram-title">From problem analysis to a verifiable result</p>
<div class="diagram-flow">
<div class="diagram-node start"><span>Start</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node input"><span>Read input</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Validate</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Run algorithm</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Report and test</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why must a denominator be checked before division?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> After division the invalid operation has already happened. Early validation prevents it and defines a clear rejection path.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>A program runs but mishandles equal maximum values. What kind of defect is this?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A logic error in comparisons or branch order; successful compilation and execution do not prove algorithm correctness.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When is a flowchart better than pseudocode?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When branches and returns need visual communication; pseudocode is better for detailed sequential logic close to code.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How would you prove a largest-of-three algorithm covers its domain?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Test each position as largest, ties, negatives, and type boundaries, with expected results written first.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
