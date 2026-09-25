---
title: 1. Classes, objects, and encapsulation
description: PHP classes, objects, properties, methods, visibility, and invariant protection.
sidebar:
  order: 1
---

A class defines state and behaviour; each object is an instance with its own state.

```php
final class Product
{
    public function __construct(
        public readonly int $id,
        public string $name,
        private int $priceCents,
    ) {
        if ($priceCents < 0) {
            throw new InvalidArgumentException('Negative price');
        }
    }

    public function changePrice(int $value): void
    {
        if ($value < 0) {
            throw new InvalidArgumentException('Negative price');
        }
        $this->priceCents = $value;
    }
}
```

Encapsulation means hiding representation, exposing meaningful operations, and preventing invalid state. A public setter for every property is not good encapsulation; prefer `withdraw()` over `setBalance()`.

`public` is visible everywhere, `protected` in the class and children, and `private` only in the declaring class. Choose the narrowest visibility; protected state couples children to parent internals.

`$this` refers to the current object inside instance methods and is unavailable in static methods. Declare typed properties explicitly; dynamic undeclared properties are deprecated for most modern PHP classes.

`==` compares object properties while `===` requires the same instance. Value objects should provide domain equality deliberately.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Classes, objects, and encapsulation">
<p class="lesson-diagram-title">Concept map: Classes, objects, and encapsulation</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>A class defines state and behaviour; each object</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Encapsulation means hiding representation, exposing meaningful operation…</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>public is visible everywhere, protected in the class</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>$this refers to the current object inside instance</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span><code>==</code> compares object properties while <code>===</code> requires the</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “A class defines state and behaviour; each object” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A class defines state and behaviour; each object is an instance with its own state. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “A class defines state and behaviour; each object” with “Encapsulation means hiding representation, exposing meaningful operation…”. Why does neither replace the other in “Classes, objects, and encapsulation”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “A class defines state and behaviour; each object”: A class defines state and behaviour; each object is an instance with its own state. For “Encapsulation means hiding representation, exposing meaningful operation…”: Encapsulation means hiding representation, exposing meaningful operations, and preventing invalid state. A public setter for every property is not good encapsulation; prefer withdraw() over setBalance(). The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “public is visible everywhere, protected in the class”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> public is visible everywhere, protected in the class and children, and private only in the declaring class. Choose the narrowest visibility; protected state couples children to parent internals. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “$this refers to the current object inside instance” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> $this refers to the current object inside instance methods and is unavailable in static methods. Declare typed properties explicitly; dynamic undeclared properties are deprecated for most modern PHP classes. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
