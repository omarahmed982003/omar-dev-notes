---
title: 5. Constants, static, and late static binding
description: Class constants, static members, self vs static, and shared-state risks.
sidebar:
  order: 5
---

Class constants belong to a class, may have visibility, and may be final. Typed class constants require PHP 8.3+.

Static properties are shared class/process state. Static methods have no `$this`, and calling a non-static method statically throws an Error. Mutable static state often hides global dependencies and complicates tests and long-running workers.

`self::` resolves to the defining class; `static::` uses late static binding and refers to the called class.

```php
class Document
{
    protected const TYPE = 'document';
    public static function early(): string { return self::TYPE; }
    public static function late(): string { return static::TYPE; }
}
class Invoice extends Document { protected const TYPE = 'invoice'; }
```

Use `static::` for intentionally extensible behaviour and `self::` for the defining class. Static suits constants and pure named constructors, not hidden service dependencies.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Constants, static, and late static binding">
<p class="lesson-diagram-title">Concept map: Constants, static, and late static binding</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Class constants belong to a class, may have</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Static properties are shared class/process state</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>self:: resolves to the defining class; static:: uses</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Use static:: for intentionally extensible behaviour and self</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Class constants belong to a class, may have” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Class constants belong to a class, may have visibility, and may be final. Typed class constants require PHP 8.3+. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Class constants belong to a class, may have” with “Static properties are shared class/process state”. Why does neither replace the other in “Constants, static, and late static binding”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Class constants belong to a class, may have”: Class constants belong to a class, may have visibility, and may be final. Typed class constants require PHP 8.3+. For “Static properties are shared class/process state”: Static properties are shared class/process state. Static methods have no $this, and calling a non-static method statically throws an Error. Mutable static state often hides global dependencies and complicates tests and long-running workers. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “self:: resolves to the defining class; static:: uses”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> self:: resolves to the defining class; static:: uses late static binding and refers to the called class. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Use static:: for intentionally extensible behaviour and self” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Use static:: for intentionally extensible behaviour and self:: for the defining class. Static suits constants and pure named constructors, not hidden service dependencies. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
