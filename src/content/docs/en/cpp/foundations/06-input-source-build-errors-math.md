---
title: "8. Input, conversions, limits, and math"
sidebar:
  order: 8
description: "Input and output are part of program design. Validate extraction, understand cin versus getline, and distinguish build, runtime, and logic failures."
tableOfContents: true
---

## Reading input and writing output

Input and output are part of program design. Validate extraction, understand cin versus getline, and distinguish build, runtime, and logic failures.

## cin, getline, stream state, and cmath

- cin extracts whitespace-delimited values; getline reads a full line.
- After cin, a newline may remain; std::ws is useful before getline.
- Comments should explain why or constraints, not restate syntax.
- Includes are preprocessed; source becomes objects and then an executable through linking.
- cmath provides sqrt, pow, abs, floor, ceil, and round; respect domain and types.

## Example: reading a number and a full line

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

## Input, linker, and formula mistakes

- A linker error differs from a syntax error; look for missing definitions or duplicate symbols.
- Real-number sqrt is invalid for negative input.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Input, source structure, errors, and the math library">
<p class="lesson-diagram-title">Concept map: Input, source structure, errors, and the math library</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Input token</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Stream state</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Range validation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Calculation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Clear output or error</span></div>
</div>
</div>

## Stream state and line input

Extraction returns the stream, which becomes false on failure. Call `clear()` before recovery and discard the invalid remainder with `ignore()`. Mixing `>>` with `getline` can leave a newline that produces an empty line, so consume the delimiter deliberately.

## Limits, math, and formulas

Integer division drops the fractional part; convert before division. `static_cast` does not prevent overflow. Use `numeric_limits` for implementation-specific bounds. `<cmath>` supplies `sqrt`, `pow`, `abs`, `round`, `ceil`, and `floor`; note that ceiling and floor behave differently for negative values.

Translate formulas by naming quantities and normalizing units. Test zero, invalid negative input, exact boundaries, and values large enough to expose overflow. Keep shared declarations in headers and definitions in source files, and include every direct dependency explicitly.

## Recovering a failed stream

```cpp
#include <iostream>
#include <limits>

int main() {
    int value{};
    while (true) {
        std::cout << "Enter an integer: ";
        if (std::cin >> value) break;
        std::cout << "Invalid token; try again.\n";
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    }
    std::cout << "Accepted: " << value << '\n';
}
```

`clear()` removes the failure flags; `ignore()` discards the bad line. Omitting either operation can leave the loop reading the same failed state forever.

## Output formatting and mathematical domains

Use `<iomanip>` tools such as `fixed`, `setprecision`, and `setw` when the output contract requires them. `sqrt` requires a nonnegative real argument, division requires a nonzero denominator, and floating calculations may produce infinity or NaN. `pow(x, 2)` is often less clear than `x * x`.

## Compile, link, runtime, and logic errors

A syntax or type error belongs to compilation. A missing definition appears during linking. Invalid runtime data or resource failure happens while executing. A program that runs but implements the wrong formula has a logic error; the compiler cannot infer the intended business rule.

## Converting input and checking type limits

Formatted extraction reports failure through the stream state; it does not guarantee that a successfully parsed value belongs to the business domain. First verify extraction, then compare against `std::numeric_limits<T>` or narrower application limits. Converting text manually with functions such as `std::stoi` also requires handling invalid text and out-of-range values.

## Source structure and error categories

Declarations in headers describe interfaces, while definitions usually belong in source files. Include guards or `#pragma once` prevent repeated declarations in one translation unit. Compilers process source files separately, then the linker resolves cross-file definitions. This distinction explains why “declared but undefined” may compile and fail only during linking.

Compile errors violate language rules; linker errors leave unresolved or duplicate symbols; runtime errors occur during execution; logic errors finish but produce incorrect behavior. A useful bug report includes input, expected output, actual output, compiler command, and the first diagnostic.

## Rounding and mathematical domains

`std::floor` rounds toward negative infinity, `std::ceil` toward positive infinity, `std::trunc` toward zero, and `std::round` to the nearest integer with halfway cases away from zero. These are not interchangeable for negative inputs. Before `std::sqrt`, check that the value is nonnegative; before division, check the denominator; before converting a floating result to an integer, define the intended rounding policy.

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
