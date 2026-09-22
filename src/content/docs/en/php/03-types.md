---
title: 3. Data types and the type system
description: Scalar, compound and special types, conversion, callables, iterables, and declarations.
sidebar:
  order: 3
---

PHP has scalar `bool`, `int`, `float`, and `string`; compound `array` and `object`; and special types including `null`, `resource`, `callable`, `iterable`, `mixed`, `void`, and `never`. Developers define classes, interfaces, and enums. Declarations may use unions such as `int|string` and intersections such as `Countable&Iterator`.

Falsy values are `false`, `0`, `0.0`, `""`, `"0"`, `[]`, and `null`. Prefer strict comparisons:

```php
var_dump(0 == false);  // true
var_dump(0 === false); // false
```

Integer literals may be decimal, `0o52` octal, `0x2A` hexadecimal, or `0b101010` binary. `/` performs division and `intdiv(7, 2)` returns `3`. Casting `(int) 3.9` truncates. Binary floating point is approximate, so use integer minor units or a decimal library for money.

Strings support single/double quotes, heredoc/nowdoc, indexing (including negative indexes), and `.` concatenation. Validate numeric strings before arithmetic instead of relying on juggling.

Arrays act as lists or maps. Objects combine state and behaviour. Enums model a finite set. A resource is a handle to an external resource such as a stream, though modern extensions often return objects.

- `void`: no useful returned value.
- `never`: execution never returns normally.
- `mixed`: any PHP value, including null.

```php
$double = fn (int $n): int => $n * 2;

class Formatter
{
    public function upper(string $value): string { return strtoupper($value); }
    public function __invoke(string $value): string { return trim($value); }
}

$f = new Formatter();
$upper = $f->upper(...); // first-class callable
```

A callback is a callable passed for later execution. A Closure represents an anonymous function. An object with `__invoke()` is callable.

```php
function numbers(int $max): iterable
{
    for ($i = 1; $i <= $max; $i++) {
        yield $i;
    }
}
```

`iterable` accepts arrays and `Traversable`. Every Generator is an Iterator, but not every Iterator is a Generator.

```php
<?php
declare(strict_types=1);

function findUser(int $id, ?string $locale = null): array|null
{
    return $id > 0 ? ['id' => $id, 'locale' => $locale] : null;
}
```

Without strict mode PHP may coerce scalar arguments. Strictness belongs to the calling file and applies to scalar declarations; an integer is still accepted for a float declaration. Use `get_debug_type()` and `var_dump()` when inspecting values.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Data types and the type system">
<p class="lesson-diagram-title">Concept map: Data types and the type system</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>PHP has scalar bool, int, float, and string;</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Falsy values are false, 0, 0.0, &quot;&quot;, &quot;0&quot;,</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Integer literals may be decimal, 0o52 octal, 0x2A</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Strings support single/double quotes, heredoc/nowdoc, indexing (includin…</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Arrays act as lists or maps</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “PHP has scalar bool, int, float, and string;” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> PHP has scalar bool, int, float, and string; compound array and object; and special types including null, resource, callable, iterable, mixed, void, and never. Developers define classes, interfaces, and enums. Declarations may use unions such as int|string and intersections such as Countable&amp;Iterator. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “PHP has scalar bool, int, float, and string;” with “Falsy values are false, 0, 0.0, &quot;&quot;, &quot;0&quot;,”. Why does neither replace the other in “Data types and the type system”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “PHP has scalar bool, int, float, and string;”: PHP has scalar bool, int, float, and string; compound array and object; and special types including null, resource, callable, iterable, mixed, void, and never. Developers define classes, interfaces, and enums. Declarations may use unions such as int|string and intersections such as Countable&amp;Iterator. For “Falsy values are false, 0, 0.0, &quot;&quot;, &quot;0&quot;,”: Falsy values are false, 0, 0.0, &quot;&quot;, &quot;0&quot;, [], and null. Prefer strict comparisons: The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Integer literals may be decimal, 0o52 octal, 0x2A”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Integer literals may be decimal, 0o52 octal, 0x2A hexadecimal, or 0b101010 binary. / performs division and intdiv(7, 2) returns 3. Casting (int) 3.9 truncates. Binary floating point is approximate, so use integer minor units or a decimal library for money. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Strings support single/double quotes, heredoc/nowdoc, indexing (includin…” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Strings support single/double quotes, heredoc/nowdoc, indexing (including negative indexes), and . concatenation. Validate numeric strings before arithmetic instead of relying on juggling. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
