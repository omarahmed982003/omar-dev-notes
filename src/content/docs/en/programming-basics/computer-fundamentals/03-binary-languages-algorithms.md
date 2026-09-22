---
title: "Binary, programming languages, and algorithms"
description: "All data and instructions become bits inside the machine. Programming languages let us express algorithms clearly before a compiler or interpreter turns them into executable work."
tableOfContents: true
---

## Overview

All data and instructions become bits inside the machine. Programming languages let us express algorithms clearly before a compiler or interpreter turns them into executable work.

## Core concepts

- A bit is 0 or 1; eight bits form a byte.
- Binary is a positional base-2 representation.
- Text is stored as numeric code points through an encoding such as Unicode, then as bits.
- An algorithm is a finite, precise solution independent of any language.
- Language choice depends on domain, ecosystem, performance, and team constraints.

## Worked example

To classify a grade: read it, validate that it is between 0 and 100, then report pass for 50 or more and fail otherwise. Validation must precede the decision.

## Corrections and common mistakes

- Code is one language-specific implementation of an algorithm.
- One successful sample is insufficient; test boundaries and invalid input.

<div class="lesson-diagram" role="img" aria-label="From a problem to machine-executable instructions">
<p class="lesson-diagram-title">From a problem to machine-executable instructions</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Problem</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Algorithm</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Source code</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Compiler / Interpreter</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Executable instructions</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Represent 45 in binary and explain why its value does not change.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> 45 is 32+8+4+1, so it is 101101. Only the representation and base changed; the mathematical value did not.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Why is UTF-8 not a programming language even though it maps text to bytes?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> UTF-8 is an encoding for character representation. It has no executable instructions, control flow, or algorithm semantics.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Is an algorithm correct because one sample passes? Give a counterexample.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> No. Division may work for 10/2 but fail for a zero denominator; boundaries and invalid input must also be tested.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>When might ahead-of-time compilation matter compared with interpretation or JIT?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It depends on platform, performance, and workflow. AOT supports native distribution and predictable startup; interpretation/JIT can favor dynamic execution and iteration.</div></details>
</section>
</div>

## Summary

Connect the idea to its inputs and outcomes, then test normal, boundary, and invalid cases. Explanation and application matter more than memorized wording.
