---
title: "Algorithms, pseudocode, and decision trees"
description: "Pseudocode and decision trees model thinking before code: pseudocode emphasizes sequence, while a tree emphasizes branching decision paths."
tableOfContents: true
---

## Overview

Pseudocode and decision trees model thinking before code: pseudocode emphasizes sequence, while a tree emphasizes branching decision paths.

## Core concepts

- A sound algorithm has defined inputs, unambiguous steps, termination, and correct outputs.
- Use domain names instead of x and y in business problems.
- Pseudocode is language-independent but must remain precise.
- Decision trees work well when answers lead to several terminal outcomes.
- Validate invalid input first, then apply business rules from general to specific.

## Worked example

To find the largest of three values, initialize the result with the first, compare and update with the second, then repeat for the third. This avoids enumerating every ordering.

## Corrections and common mistakes

- Large trees become difficult to maintain; group related rules and name conditions.
- Every possible path must end with a defined outcome.

<div class="lesson-diagram" role="img" aria-label="A simplified decision flow that validates before applying business rules">
<p class="lesson-diagram-title">A simplified decision flow that validates before applying business rules</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Read input</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Is input valid?</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Does the rule pass?</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Perform action</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Report result</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is “initialize with the first value, then update the maximum” better than enumerating three-value orderings?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It needs only two comparisons and scales to any number of values; enumerating permutations grows quickly and is error-prone.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>When does a decision tree become a poor representation?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When branches and shared rules explode and repeat. A decision table, named predicates, or a state machine may then be clearer.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Which properties should a sound algorithm establish?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Defined inputs and outputs, unambiguous steps, finite termination, and correctness for every case inside the requirements.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Order checks for a discount based on valid price, membership, and total.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Validate price first, then determine eligibility, then apply membership and threshold rules. Invalid data must never reach discount calculation.</div></details>
</section>
</div>

## Summary

Connect the idea to its inputs and outcomes, then test normal, boundary, and invalid cases. Explanation and application matter more than memorized wording.
