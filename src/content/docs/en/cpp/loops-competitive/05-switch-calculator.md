---
pagefind: false
title: "switch and the calculator exercise"
description: "A calculator is a good switch example when input, operation selection, and division validation remain separate."
tableOfContents: true
---

## Choosing a calculator operation

A calculator is a good switch example when input, operation selection, and division validation remain separate.

## case, break, and division checks

- Read two operands and an operator, and validate extraction.
- Each case performs one operation and breaks.
- Check the denominator inside division.
- default rejects an unsupported operator.
- As operations grow, extract functions or use a more extensible design.

## Example: a switch calculator

```cpp
switch (op) {
case '+': std::cout << a + b; break;
case '-': std::cout << a - b; break;
case '*': std::cout << a * b; break;
case '/':
    if (b == 0) std::cout << "Cannot divide by zero";
    else std::cout << a / b;
    break;
default: std::cout << "Unsupported operation";
}
```

## Fall-through and division-by-zero mistakes

- With int operands, division is integer division; use double for fractions.
- Do not rely on accidental fall-through.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: switch and the calculator exercise">
<p class="lesson-diagram-title">Concept map: switch and the calculator exercise</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Operands and operator</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Select case</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>A calculator is a good switch example when input,</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why can 5/2 produce 2 in the calculator?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> With int operands, integer division runs. Use double operands or convert before division to obtain 2.5.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Where should zero-division validation live?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Inside the division case before the operation; zero is valid for addition or multiplication.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>How can the calculator repeat until exit?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Put input and switch in a loop, define an exit command, and handle stream failure to avoid an infinite loop.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>When does switch stop being a suitable design?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When operations grow or need independent state and behavior; functions, dispatch tables, or objects may scale better.</div></details>
</section>
</div>
