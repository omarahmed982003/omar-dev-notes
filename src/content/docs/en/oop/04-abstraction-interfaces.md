---
title: 4. Abstraction and interfaces
description: Abstract classes, methods, interfaces, capabilities, and choosing between them.
sidebar:
  order: 4
---

Abstraction exposes what callers need while hiding implementation details.

```php
abstract class PaymentMethod
{
    final public function charge(int $amount): Receipt
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException();
        }
        return $this->performCharge($amount);
    }

    abstract protected function performCharge(int $amount): Receipt;
}
```

An abstract class cannot be instantiated and may hold state, a constructor, concrete methods, and abstract requirements. PHP 8.4 adds abstract properties with get/set requirements, but method contracts remain clearer for multi-version libraries.

```php
interface PaymentGateway
{
    public function charge(string $customerId, int $amount): Receipt;
}
```

An interface defines capability without one inheritance tree; a class may implement several interfaces. Split large interfaces so consumers depend only on required operations. Use interfaces at boundaries and for injected collaborators; use abstract classes when related types genuinely share stable state/implementation.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Abstraction and interfaces">
<p class="lesson-diagram-title">Concept map: Abstraction and interfaces</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Abstraction exposes what callers need while hiding implementation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>An abstract class cannot be instantiated and may</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>An interface defines capability without one inheritance tree;</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>interfaces</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Abstraction exposes what callers need while hiding implementation” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Abstraction exposes what callers need while hiding implementation details. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Abstraction exposes what callers need while hiding implementation” with “An abstract class cannot be instantiated and may”. Why does neither replace the other in “Abstraction and interfaces”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Abstraction exposes what callers need while hiding implementation”: Abstraction exposes what callers need while hiding implementation details. For “An abstract class cannot be instantiated and may”: An abstract class cannot be instantiated and may hold state, a constructor, concrete methods, and abstract requirements. PHP 8.4 adds abstract properties with get/set requirements, but method contracts remain clearer for multi-version libraries. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “An interface defines capability without one inheritance tree;”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> An interface defines capability without one inheritance tree; a class may implement several interfaces. Split large interfaces so consumers depend only on required operations. Use interfaces at boundaries and for injected collaborators; use abstract classes when related types genuinely share stable state/implementation. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “interfaces” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Abstract classes, methods, interfaces, capabilities, and choosing between them. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
