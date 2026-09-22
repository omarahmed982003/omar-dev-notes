---
title: 6. Constructors, readonly, and dependency injection
description: Valid construction, promotion, readonly semantics, and explicit collaborators.
sidebar:
  order: 6
---

A successful constructor should leave a valid object. Property promotion declares and assigns properties concisely. A child-defined constructor does not automatically invoke the parent constructor.

```php
final readonly class EmailAddress
{
    public function __construct(public string $value)
    {
        if (filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidArgumentException();
        }
    }
}
```

Readonly classes (PHP 8.2+) make declared properties readonly and prohibit dynamic properties. Readonly is not deep immutability: nested mutable objects can still change. PHP 8.4 changed implicit set visibility to `protected(set)`.

Dependency injection exposes collaborators:

```php
final class OrderService
{
    public function __construct(
        private PaymentGateway $payments,
        private OrderRepository $orders,
        private Clock $clock,
    ) {}
}
```

DI does not require a container. Use constructor injection for lifetime requirements, method parameters for operation-specific inputs, and avoid service locators that hide dependencies.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Constructors, readonly, and dependency injection">
<p class="lesson-diagram-title">Concept map: Constructors, readonly, and dependency injection</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>A successful constructor should leave a valid object</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Readonly classes (PHP 8.2+) make declared properties readonly</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>DI does not require a container</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>readonly semantics</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “A successful constructor should leave a valid object” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A successful constructor should leave a valid object. Property promotion declares and assigns properties concisely. A child-defined constructor does not automatically invoke the parent constructor. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “A successful constructor should leave a valid object” with “Readonly classes (PHP 8.2+) make declared properties readonly”. Why does neither replace the other in “Constructors, readonly, and dependency injection”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “A successful constructor should leave a valid object”: A successful constructor should leave a valid object. Property promotion declares and assigns properties concisely. A child-defined constructor does not automatically invoke the parent constructor. For “Readonly classes (PHP 8.2+) make declared properties readonly”: Readonly classes (PHP 8.2+) make declared properties readonly and prohibit dynamic properties. Readonly is not deep immutability: nested mutable objects can still change. PHP 8.4 changed implicit set visibility to protected(set). The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “DI does not require a container”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> DI does not require a container. Use constructor injection for lifetime requirements, method parameters for operation-specific inputs, and avoid service locators that hide dependencies. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “readonly semantics” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Valid construction, promotion, readonly semantics, and explicit collaborators. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
