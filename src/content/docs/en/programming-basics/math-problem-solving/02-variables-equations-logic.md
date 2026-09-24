---
title: "Variables, equations, and Boolean logic"
description: "A variable names a value that may change, while an equation describes a relationship. Boolean logic turns problem rules into decisions a program can evaluate."
tableOfContents: true
---

## Overview

A variable names a value that may change, while an equation describes a relationship. Boolean logic turns problem rules into decisions a program can evaluate.

## Core concepts

- An expression produces a value; an equation or comparison describes a relation.
- Assignment changes state, so statement order can change the result.
- AND requires every condition, OR requires at least one, and NOT negates.
- XOR is true when its operands differ, but is less common in business rules.
- Name simple conditions separately before combining them.

## Worked example

Loan eligibility might require an acceptable age AND sufficient income AND no risky debt. Represent each fact as a clearly named Boolean, then combine them.

## Corrections and common mistakes

- Do not confuse equality with assignment.
- Use parentheses when mixing AND and OR to make intent explicit.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Variables, equations, and Boolean logic">
<p class="lesson-diagram-title">Concept map: Variables, equations, and Boolean logic</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Core concepts</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Worked example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>A variable names a value that may change, while</span></div>
</div>
</div>

## Sets, functions, truth tables, and predicates

A set contains unique elements. Union combines membership, intersection keeps shared elements, and difference removes one set from another. A function maps every element in its domain to one result; its range contains the results actually produced.

Truth tables enumerate Boolean inputs. De Morgan's laws transform `!(A && B)` into `!A || !B` and `!(A || B)` into `!A && !B`. A predicate is a Boolean statement about a value. Universal and existential conditions correspond to operations such as “all elements” and “at least one element.”

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>How does x = x + 1 differ in programming and algebra?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> In code it is assignment using the old value. As an algebraic equality over ordinary numbers, x=x+1 has no solution.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Translate: accepted if employed or sufficiently funded, provided the applicant is not blocked.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> eligible = (isEmployee OR hasEnoughIncome) AND NOT isBlocked. Parentheses ensure blocking rejects either route.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When do separate if statements differ from an else-if chain?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Independent if statements can execute several branches; an else-if chain selects only the first true branch.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How do you systematically test a compound Boolean rule?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Build a truth or decision table covering each predicate, important combinations, and comparison boundaries with expected outcomes defined first.</div></details>
</section>
</div>

## Summary

Connect the idea to its inputs and outcomes, then test normal, boundary, and invalid cases. Explanation and application matter more than memorized wording.
