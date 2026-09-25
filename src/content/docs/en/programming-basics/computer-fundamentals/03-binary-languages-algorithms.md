---
title: "7. Binary, programming languages, and algorithms"
description: "All data and instructions become bits inside the machine. Programming languages let us express algorithms clearly before a compiler or interpreter turns them into executable work."
tableOfContents: true
sidebar:
  order: 7
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

## From binary to hexadecimal

Hexadecimal makes bit patterns shorter because one hex digit represents four bits. For example, `1111 1010₂` equals `FA₁₆`. Hex appears in memory addresses, colors such as `#22C55E`, binary-file viewers, and bit masks.

## Unicode and UTF-8 in practice

Unicode assigns a code point to each character, such as `U+0639` for the Arabic letter ع. UTF-8 defines the bytes used to encode that value. Basic English characters use one byte, Arabic letters usually use two, and other symbols may use up to four.

Do not assume character count equals byte count or slice text at arbitrary byte positions. Use library operations that understand Unicode when measuring or splitting human text.

## From an algorithm to a program

1. Define inputs, outputs, and constraints.
2. Write language-independent steps as pseudocode or a flowchart.
3. Dry-run a normal, boundary, and invalid case.
4. Translate the design into code and compare behavior with expectations.
5. Optimize only after correctness and measurement show a real need.

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

## Signed values, floating point, endianness, and runtimes

The same bits have different meanings under different types. Unsigned values wrap within their range, while common signed integers use two's complement. Floating point stores an approximation using a sign, exponent, and significand, so many decimal fractions cannot be represented exactly.

Endianness defines byte order for multi-byte values. It matters in binary files and network protocols. A compiler translates source before execution, an interpreter executes a representation at runtime, and a JIT compiles selected code while the program runs. A runtime supplies services required by the language or platform.

Libraries may link statically or load dynamically. Projects record dependency versions because API and behavior can change between releases.

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
