---
title: "Computational thinking and requirements analysis"
description: "Computational thinking is a disciplined way to turn an unclear problem into components, rules, and steps that can be implemented and tested."
tableOfContents: true
---

## Overview

Computational thinking is a disciplined way to turn an unclear problem into components, rules, and steps that can be implemented and tested.

## Core concepts

- Decomposition splits a problem into manageable tasks.
- Pattern recognition reuses known structures instead of restarting.
- Abstraction keeps relevant details and postpones irrelevant ones.
- Algorithm design orders actions, decisions, and repetition.
- Requirements analysis defines inputs, rules, edge cases, outputs, and success criteria.

## Worked example

For an ATM: separate card validation, PIN checking, operation selection, balance and daily-limit checks, withdrawal, balance update, and receipt generation.

## Corrections and common mistakes

- Do not code before identifying rejection paths and boundaries.
- A vague requirement such as “fast” needs a measurable criterion.

<div class="lesson-diagram" role="img" aria-label="Computational thinking from problem to testable solution">
<p class="lesson-diagram-title">Computational thinking from problem to testable solution</p>
<div class="diagram-flow">
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

## Summary

Connect the idea to its inputs and outcomes, then test normal, boundary, and invalid cases. Explanation and application matter more than memorized wording.
