---
title: "Input, source structure, errors, and the math library"
description: "Input and output are part of program design. Validate extraction, understand cin versus getline, and distinguish build, runtime, and logic failures."
tableOfContents: true
---

## Overview

Input and output are part of program design. Validate extraction, understand cin versus getline, and distinguish build, runtime, and logic failures.

## Concepts you need

- cin extracts whitespace-delimited values; getline reads a full line.
- After cin, a newline may remain; std::ws is useful before getline.
- Comments should explain why or constraints, not restate syntax.
- Includes are preprocessed; source becomes objects and then an executable through linking.
- cmath provides sqrt, pow, abs, floor, ceil, and round; respect domain and types.

## Example

```cpp
#include <iostream>
#include <string>

int main() {
    int age{};
    std::string name;
    if (!(std::cin >> age)) return 1;
    std::getline(std::cin >> std::ws, name);
    std::cout << name << " is " << age << "\n";
}
```

## Corrections and common mistakes

- A linker error differs from a syntax error; look for missing definitions or duplicate symbols.
- Real-number sqrt is invalid for negative input.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Input, source structure, errors, and the math library">
<p class="lesson-diagram-title">Concept map: Input, source structure, errors, and the math library</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Overview</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Concepts you need</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Input and output are part of program design. Validate</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why can getline read an empty line after cin &gt;&gt; age?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The newline remains in the stream; use getline(cin &gt;&gt; std::ws, name) or consume it deliberately.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>How do you detect failed numeric extraction?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Test stream state with if (!(cin &gt;&gt; value)), then handle failure and repair input before continuing.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Classify a missing header, zero division, and a wrong discount formula.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> They are respectively a build error, runtime/invalid operation, and logic error.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Why does sqrt need validation even when code compiles?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The compiler checks types, not runtime values; a negative real input is outside the function domain and produces NaN.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
