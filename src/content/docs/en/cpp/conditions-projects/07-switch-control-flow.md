---
title: "switch, case, and fall-through"
description: "switch selects a branch from one discrete value. Use it for clear constant cases; prefer if for ranges and compound predicates."
tableOfContents: true
---

## Overview

switch selects a branch from one discrete value. Use it for clear constant cases; prefer if for ranges and compound predicates.

## Concepts you need

- Case labels must be unique compile-time constants compatible with the selector.
- break prevents execution from falling into the next case.
- default handles unmatched values.
- Grouped cases are useful when several values share behavior.
- Intentional fall-through should be explicit, optionally with [[fallthrough]].
- Use braces around a case body when local declarations need scope.

## Example

```cpp
switch (choice) {
case 1: runReport(); break;
case 2: saveFile(); break;
case 0: std::cout << "Bye\n"; break;
default: std::cout << "Unknown option\n";
}
```

## Corrections and common mistakes

- switch cannot directly express score >= 50.
- A missing break may execute multiple cases.

<div class="lesson-diagram" role="img" aria-label="How switch selects a case and break prevents fall-through">
<p class="lesson-diagram-title">How switch selects a case and break prevents fall-through</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Selector</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Match case</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Run case</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>break?</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Exit / default</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why can switch not directly express score&gt;=50?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Case labels match discrete constants, not ranges or comparison expressions; use if/else for ranges.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>What happens when break is omitted?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Execution continues through later cases until a break or the switch ends; this may be a bug or documented fall-through.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When should several cases be grouped?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When multiple selector values intentionally share the same behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Why add braces around a case with local variables?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> They create a clear scope and avoid jumping across a variable initialization between labels.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
