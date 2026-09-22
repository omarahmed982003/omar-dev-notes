---
title: 2. Inheritance and polymorphism
description: is-a relationships, overriding, final members, substitutability, and composition.
sidebar:
  order: 2
---

Inheritance models a real is-a relationship. PHP supports one parent class, while classes may implement multiple interfaces and use multiple traits.

```php
abstract class Notification
{
    abstract public function send(string $message): void;
}

final class EmailNotification extends Notification
{
    #[\Override]
    public function send(string $message): void
    {
        // send email
    }
}

function notify(Notification $channel, string $message): void
{
    $channel->send($message);
}
```

Polymorphism lets the caller use a shared contract while the runtime object supplies behaviour. Overrides must keep a compatible signature and meaning.

A final class cannot be extended; a final method or constant cannot be overridden/redefined. Private parent members are not directly accessible from children; expose meaningful methods rather than making all state protected.

Prefer composition for has-a relationships and swappable collaborators. Use inheritance only when substitutability is real. Avoid giant base classes, unsupported operations in children, and inheritance used merely to reuse a few lines.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Inheritance and polymorphism">
<p class="lesson-diagram-title">Concept map: Inheritance and polymorphism</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Inheritance models a real is-a relationship</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Polymorphism lets the caller use a shared contract</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>A final class cannot be extended; a final</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Prefer composition for has-a relationships and swappable collaborators</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Inheritance models a real is-a relationship” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Inheritance models a real is-a relationship. PHP supports one parent class, while classes may implement multiple interfaces and use multiple traits. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Inheritance models a real is-a relationship” with “Polymorphism lets the caller use a shared contract”. Why does neither replace the other in “Inheritance and polymorphism”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Inheritance models a real is-a relationship”: Inheritance models a real is-a relationship. PHP supports one parent class, while classes may implement multiple interfaces and use multiple traits. For “Polymorphism lets the caller use a shared contract”: Polymorphism lets the caller use a shared contract while the runtime object supplies behaviour. Overrides must keep a compatible signature and meaning. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “A final class cannot be extended; a final”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A final class cannot be extended; a final method or constant cannot be overridden/redefined. Private parent members are not directly accessible from children; expose meaningful methods rather than making all state protected. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Prefer composition for has-a relationships and swappable collaborators” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Prefer composition for has-a relationships and swappable collaborators. Use inheritance only when substitutability is real. Avoid giant base classes, unsupported operations in children, and inheritance used merely to reuse a few lines. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
