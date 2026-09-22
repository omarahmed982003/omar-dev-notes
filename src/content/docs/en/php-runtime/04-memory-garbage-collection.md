---
title: 4. PHP memory and garbage collection
description: zvals, reference counting, copy-on-write, references, objects, cycles, and memory measurement.
sidebar:
  order: 4
---

# How PHP represents values

The Zend Engine represents a PHP value with an internal `zval`. Compound data such as strings, arrays, and objects can reference additional refcounted structures.

:::caution[Version-aware correction]
The simple `type + value + is_ref + refcount` description reflects PHP 5-era internals. PHP 7/8 reorganized zvals and references. Learn observable semantics instead of depending on a fixed internal memory layout.
:::

## Reference counting and copy-on-write

```php
$original = range(1, 100_000);
$copy = $original;       // shared for now
$copy[] = 100_001;       // modified data must now separate
```

PHP generally delays copying large arrays and strings until one copy changes. This saves work, although the eventual write can produce a temporary memory spike.

Do not interpret a debug refcount as a perfect number of source-level variables. Temporaries, interning, and engine details affect it.

## Objects and references

```php
$a = new stdClass();
$a->count = 1;
$b = $a;
$b->count++;

echo $a->count; // 2
```

Both variables hold a handle to the same object. Use `clone` for a separate object and implement `__clone()` where nested mutable state needs copying.

```php
$value = 10;
$alias =& $value;
$alias = 20;
echo $value; // 20
```

A PHP reference is an alias, not a general C pointer. Do not use `&` as a performance trick.

## Cyclic garbage

Refcounting alone cannot free an unreachable cycle:

```php
final class Node
{
    public ?Node $next = null;
}

$a = new Node();
$b = new Node();
$a->next = $b;
$b->next = $a;
unset($a, $b);
```

The cyclic garbage collector records candidates and periodically detects unreachable cycles. `gc_collect_cycles()` can force a pass, but it should be a measured tool for long-running workers, not a call after every operation.

## Requests, workers, and measurement

Request-owned memory is normally released at request shutdown, while an FPM worker remains alive. Extensions, caches, or allocator fragmentation can keep its resident size high. `pm.max_requests` recycles workers, but does not replace fixing leaks in long-running code.

```php
$before = memory_get_usage(true);
$rows = loadReportRows();

printf(
    "current=%s peak=%s delta=%s\n",
    number_format(memory_get_usage(true)),
    number_format(memory_get_peak_usage(true)),
    number_format(memory_get_usage(true) - $before),
);
```

The `true` form reports memory obtained from the system and may exceed currently used payload memory.

## Practical reductions

- Stream or paginate instead of loading entire datasets.
- Avoid `fetchAll()` for huge results.
- Watch closures that capture large object graphs.
- Release proven large references inside long loops.
- Keep OPcache/shared caches conceptually separate from the request heap.
- Profile before merely increasing `memory_limit`.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: PHP memory and garbage collection">
<p class="lesson-diagram-title">Concept map: PHP memory and garbage collection</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Reference counting and copy-on-write</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Objects and references</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Cyclic garbage</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Requests, workers, and measurement</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Practical reductions</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Reference counting and copy-on-write” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> PHP generally delays copying large arrays and strings until one copy changes. This saves work, although the eventual write can produce a temporary memory spike. Do not interpret a debug refcount as a perfect number of source-level variables. Temporaries, interning, and engine details affect it. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Reference counting and copy-on-write” with “Objects and references”. Why does neither replace the other in “PHP memory and garbage collection”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Reference counting and copy-on-write”: PHP generally delays copying large arrays and strings until one copy changes. This saves work, although the eventual write can produce a temporary memory spike. Do not interpret a debug refcount as a perfect number of source-level variables. Temporaries, interning, and engine details affect it. For “Objects and references”: Both variables hold a handle to the same object. Use clone for a separate object and implement __clone() where nested mutable state needs copying. A PHP reference is an alias, not a general C pointer. Do not use &amp; as a performance trick. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Cyclic garbage”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Refcounting alone cannot free an unreachable cycle: The cyclic garbage collector records candidates and periodically detects unreachable cycles. gc_collect_cycles() can force a pass, but it should be a measured tool for long-running workers, not a call after every operation. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Requests, workers, and measurement” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Request-owned memory is normally released at request shutdown, while an FPM worker remains alive. Extensions, caches, or allocator fragmentation can keep its resident size high. pm.max_requests recycles workers, but does not replace fixing leaks in long-running code. The true form reports memory obtained from the system and may exceed currently used payload memory. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
