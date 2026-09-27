---
title: "Computational thinking and requirements analysis"
description: "Computational thinking is a disciplined way to turn an unclear problem into components, rules, and steps that can be implemented and tested."
tableOfContents: true
prev: {"link":"/en/programming-basics/math-problem-solving/08-sets-relations/","label":"Sets, relations, and function inputs"}
next: {"link":"/en/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees/","label":"Algorithms, pseudocode, and decision trees"}
sidebar:
  order: 5
---

Use this section after [values, decisions, and loops](/en/programming-basics/computer-fundamentals/10-decisions-and-repetition/). Review arithmetic when needed; graphs, complexity, and dynamic programming are later extensions, not first-program prerequisites.


## Turn one requirement into tests

ATM rule: “Allow a positive multiple of 50 no greater than the balance.” Assume a balance of 200 and no fees. **Constraints** are input limits.

| Input | Expected | Rule exercised |
|---|---|---|
| 150 | Accept; 50 left | Normal case |
| 200 | Accept; 0 left | Exact upper boundary |
| 250 | Reject | Exceeds balance |
| 0 or −50 | Reject | Must be positive |
| 75 | Reject | Not a multiple of 50 |
| Nonnumeric text | Reject before arithmetic | Input type |

Separate reading, validation, then deduction/display. Rejection preserves balance. **Try:** adding a fixed fee of 10 makes withdrawal 200 invalid because total cost is 210. Update tests when the requirement changes.

## Overview

Computational thinking is a disciplined way to turn an unclear problem into components, rules, and steps that can be implemented and tested.

## Core concepts

- Decomposition splits a problem into manageable tasks.
- Pattern recognition reuses known structures instead of restarting.
- Abstraction keeps relevant details and postpones irrelevant ones.
- Algorithm design orders actions, decisions, and repetition.
- Requirements analysis defines inputs, rules, edge cases, outputs, and success criteria.

## Worked example

For an ATM (Automated Teller Machine): separate card validation, PIN (Personal Identification Number, a secret numeric authentication code) checking, operation selection, balance and daily-limit checks, withdrawal, balance update, and receipt generation.

## Corrections and common mistakes

- Do not code before identifying rejection paths and boundaries.
- A vague requirement such as “fast” needs a measurable criterion.

<div class="lesson-diagram" role="img" aria-label="Computational thinking from problem to testable solution">
<p class="lesson-diagram-title">Computational thinking from problem to testable solution</p>
<div class="diagram-flow diagram-pipeline">
<div class="diagram-node input"><span>Requirements</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Decompose</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Find patterns</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Abstract</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Design algorithm</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Test solution</span></div>
</div>
</div>

## Make a small requirement testable

For our shopping list, “accept a quantity” is vague. Specify a whole number from 1 through 100. Split the work into reading text, rejecting an empty field, converting to a number, checking the bounds, and only then adding. Test 0, 1, 100, 101, and 2.5: only 1 and 100 pass. Separating these responsibilities makes the first failing step visible.

For comparisons of running cost and reusable solution patterns, continue later to [algorithm comparison](/en/programming-basics/08-problem-solving-algorithms/). Here the outcome is a clear problem statement and independently predicted tests.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>How do decomposition and abstraction differ?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Decomposition splits the system into smaller problems; abstraction keeps relevant details and hides those not needed by the current solution.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Name a vague booking-system requirement and make it testable.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> “The system is fast” is vague. A testable form is: 95% of searches finish under 500 ms at a defined load.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>How does pattern recognition prevent duplicated solutions?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It exposes a shared structure such as validate-decide-record, allowing one reusable rule or function instead of copied logic.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Decompose an ATM withdrawal and name a critical boundary case.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Validate card/PIN, select amount, check balance and limit, dispense, update, and receipt. Test an amount exactly equal to balance or daily limit.</div></details>
</section>
</div>
