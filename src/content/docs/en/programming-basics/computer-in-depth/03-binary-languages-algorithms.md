---
title: "Representing numbers and characters in memory"
description: "Representing numbers and characters in memory"
tableOfContents: true
sidebar:
  order: 10
prev: {"link":"/en/programming-basics/computer-in-depth/06-operating-systems/","label":"Operating-system architecture and types"}
next: {"link":"/en/programming-basics/computer-in-depth/14-running-code/","label":"From solution steps to running code"}
---

## Overview

All data and instructions become bits inside the machine. Programming languages let us express algorithms clearly before a compiler or interpreter turns them into executable work.

## Core concepts

- A bit is 0 or 1; eight bits form a byte.
- Binary is a positional base-2 representation.
- Text is stored using code points defined by Unicode and bytes defined by an encoding form such as UTF-8 (Unicode Transformation Format with 8-bit units, encoding Unicode character numbers as bytes), then as bits.
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

## Signed values, floating point, endianness, and runtimes

The same bits have different meanings under different types. Unsigned values wrap within their range, while common signed integers use two's complement. Floating point stores an approximation using a sign, exponent, and significand, so many decimal fractions cannot be represented exactly.

Endianness defines byte order for multi-byte values. It matters in binary files and network protocols. 



## Work through actual representations

First review [5 to 101 and text/image/audio representation](/en/programming-basics/computer-fundamentals/02-binary-data-representation/). **Hexadecimal** uses 0–9 and A–F for 10–15. FA is 15×16+10=250, or binary 11111010. A **bit mask** selects particular bits, such as the low bit for odd/even checks.

In 8-bit **two's complement**, 5 is 00000101; invert bits to 11111010 and add one to get 11111011, interpreted as -5. The same pattern is unsigned 251. The signed range is -128 (10000000) through 127 (01111111). Do not generalize unsigned wrapping to every signed type: signed overflow in C++ is not guaranteed wrapping.

**Floating point** uses sign, exponent, and significand; the exponent scales the value and the significand supplies precision. Just as decimal 1/3 repeats forever, binary 0.1 does not terminate. JavaScript commonly displays 0.1+0.2 as 0.30000000000000004. Choose domain-appropriate accuracy and rounding rules rather than an arbitrary tolerance. Integer minor units can suit money with explicit conversion and rounding policies.

**Endianness** orders bytes, not bits within each byte. For two-byte hexadecimal 0x1234, big-endian stores 12 then 34 from the lower address; little-endian stores 34 then 12. The 0x prefix denotes hexadecimal. **Worked check:** bytes 35 and 00 represent 53 as a little-endian 16-bit integer, while the first byte alone encodes the UTF-8 character 5. State the type, byte order, and encoding.



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

## Next step

After completing this practice, continue with [From solution steps to running code](/en/programming-basics/computer-in-depth/14-running-code/).
