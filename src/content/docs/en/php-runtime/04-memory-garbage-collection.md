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
