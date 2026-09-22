---
title: 7. Magic methods and cloning
description: __get, __set, __call, __toString, __invoke, __clone, __debugInfo, and serialization.
sidebar:
  order: 7
---

PHP reserves names beginning with `__` for magic behaviour. Except for `__construct`, `__destruct`, and `__clone`, magic methods must be public.

`__get/__set/__isset/__unset` intercept inaccessible properties. They support dynamic bags and proxies but weaken static analysis and hide typos. `__call/__callStatic` intercept inaccessible methods and should fail clearly for unknown names.

```php
final class Slugify
{
    public function __invoke(string $value): string
    {
        return strtolower(trim(str_replace(' ', '-', $value)));
    }
}
```

Invokable objects make small injectable strategies.

`clone` is shallow by default; nested object references stay shared. Implement `__clone` for selected mutable children. Do not clone ORM entities without understanding identity and Unit of Work.

`__debugInfo` can redact secrets from `var_dump`, but avoid logging sensitive objects. Prefer `__serialize/__unserialize` over legacy hooks and never unserialize untrusted data. Destructors are unsuitable for critical business commits; use explicit methods and `try/finally`.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Magic methods and cloning">
<p class="lesson-diagram-title">Concept map: Magic methods and cloning</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>PHP reserves names beginning with __ for magic</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>__get/__set/__isset/__unset intercept inaccessible properties</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Invokable objects make small injectable strategies</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>clone is shallow by default; nested object references</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>__debugInfo can redact secrets from var_dump, but avoid</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “PHP reserves names beginning with __ for magic” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> PHP reserves names beginning with __ for magic behaviour. Except for __construct, __destruct, and __clone, magic methods must be public. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “PHP reserves names beginning with __ for magic” with “__get/__set/__isset/__unset intercept inaccessible properties”. Why does neither replace the other in “Magic methods and cloning”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “PHP reserves names beginning with __ for magic”: PHP reserves names beginning with __ for magic behaviour. Except for __construct, __destruct, and __clone, magic methods must be public. For “__get/__set/__isset/__unset intercept inaccessible properties”: __get/__set/__isset/__unset intercept inaccessible properties. They support dynamic bags and proxies but weaken static analysis and hide typos. __call/__callStatic intercept inaccessible methods and should fail clearly for unknown names. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Invokable objects make small injectable strategies”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Invokable objects make small injectable strategies. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “clone is shallow by default; nested object references” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> clone is shallow by default; nested object references stay shared. Implement __clone for selected mutable children. Do not clone ORM entities without understanding identity and Unit of Work. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
