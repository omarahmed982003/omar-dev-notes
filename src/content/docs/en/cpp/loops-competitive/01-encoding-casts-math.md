---
title: "6. Text encoding, characters, and casts"
sidebar:
  order: 6
description: "Text encoding, conversions, and math functions often meet in real problems. Know what a value represents before casting or calculating."
tableOfContents: true
---

## Characters, text, and encodings

Text encoding, conversions, and math functions often meet in real problems. Know what a value represents before casting or calculating.

## ASCII, Unicode, UTF-8, and UTF-16

- ASCII covers a limited legacy set; Unicode defines code points across scripts.
- UTF-8 is variable length and ASCII-compatible; UTF-16 uses one or two code units.
- A char does not necessarily hold a full Unicode character.
- Widening usually preserves value; narrowing may lose data or exceed range.
- Math functions return specific types and may require domain checks.

## Example: widening and domain checks

```cpp
unsigned char raw{255};
int widened = raw;
double root = value >= 0 ? std::sqrt(value) : 0.0;
```

## Byte counts, characters, and unsafe narrowing

- Byte count is not always visible-character count.
- static_cast does not prove a value is in range; validate first.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Text encoding, casts, and math">
<p class="lesson-diagram-title">Concept map: Text encoding, casts, and math</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Unicode code point</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>UTF-8 and UTF-16</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Text encoding, conversions, and math functions often meet in</span></div>
</div>
</div>

## Characters, code points, and bytes

Unicode assigns code points; UTF-8 encodes them into one to four bytes. A C++ `char` stores one byte-sized code unit, not necessarily one complete user-visible character. `std::string::size()` reports bytes, and a visible grapheme can contain several code points.

## Conversion rules

Integral promotions and usual arithmetic conversions choose evaluation types. `static_cast` documents supported conversions but does not guarantee that a value fits. `const_cast`, `dynamic_cast`, and `reinterpret_cast` solve specialized problems and do not replace validation. Narrowing a floating value to an integer discards its fraction.

Parsing text such as `"123"` is not a cast. Use a parser such as `from_chars` or a checked stream, and verify complete consumption and range.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>How do a Unicode code point and UTF-8 bytes differ?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A code point is an abstract character identity; UTF-8 encodes it into one or more bytes.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Why may text.size() not equal visible character count?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Many UTF-8 strings report bytes, and one grapheme can itself contain several code points.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When is narrowing acceptable?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When range and required precision are checked and the intended loss is documented; a cast alone is not enough.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How should negative user input to sqrt be handled?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Reject it or use complex arithmetic when required; do not disguise NaN as a valid result.</div></details>
</section>
</div>
