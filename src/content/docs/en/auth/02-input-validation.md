---
title: 2. Input validation
description: Validation vs sanitization, PHP filters, domain rules, and output encoding boundaries.
sidebar:
  order: 2
---

Validation checks whether data satisfies rules without changing it. Normalization standardizes legitimate representation. Sanitization removes/changes characters and may silently corrupt meaning. Output encoding belongs at the exact HTML/URL/JS sink.

```php
$email = filter_var($rawEmail, FILTER_VALIDATE_EMAIL);
if ($email === false) {
    throw new InvalidArgumentException('Invalid email');
}

$age = filter_var($rawAge, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 18, 'max_range' => 120],
]);
if ($age === false) {
    throw new InvalidArgumentException('Invalid age');
}
```

Use `=== false` because zero can be valid. `FILTER_DEFAULT` is `FILTER_UNSAFE_RAW`; it is not automatic safety.

```php
$page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, [
    'options' => ['default' => 1, 'min_range' => 1],
]);
```

Shape validation is insufficient: a valid order ID does not prove ownership. Validate type/range, then authorize the current user against the loaded resource. Use allow-lists for enums, sort fields, and identifiers; prepared SQL and context-aware output encoding remain separate controls.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Input validation">
<p class="lesson-diagram-title">Concept map: Input validation</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Validation checks whether data satisfies rules without changing</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Use <code>=== false</code> because zero can be valid</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Shape validation is insufficient: a valid order ID</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>domain rules</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Validation checks whether data satisfies rules without changing” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Validation checks whether data satisfies rules without changing it. Normalization standardizes legitimate representation. Sanitization removes/changes characters and may silently corrupt meaning. Output encoding belongs at the exact HTML/URL/JS sink. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Validation checks whether data satisfies rules without changing” with “Use <code>=== false</code> because zero can be valid”. Why does neither replace the other in “Input validation”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Validation checks whether data satisfies rules without changing”: Validation checks whether data satisfies rules without changing it. Normalization standardizes legitimate representation. Sanitization removes/changes characters and may silently corrupt meaning. Output encoding belongs at the exact HTML/URL/JS sink. For “Use <code>=== false</code> because zero can be valid”: Use <code>=== false</code> because zero can be valid. FILTER_DEFAULT is FILTER_UNSAFE_RAW; it is not automatic safety. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Shape validation is insufficient: a valid order ID”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Shape validation is insufficient: a valid order ID does not prove ownership. Validate type/range, then authorize the current user against the loaded resource. Use allow-lists for enums, sort fields, and identifiers; prepared SQL and context-aware output encoding remain separate controls. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “domain rules” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Validation vs sanitization, PHP filters, domain rules, and output encoding boundaries. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
