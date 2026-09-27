---
title: 5. Constants, static, and late static binding
description: Class constants, static members, self vs static, and shared-state risks.
sidebar:
  order: 5
---

## Beginner bridge

Class constants name values that belong to a type and do not vary per object. Static methods and properties belong to the class itself, but shared mutable static state behaves like a hidden global and makes order-dependent tests likely.

Use static operations for pure, context-free behavior or named constructors when appropriate. Inject clocks, configuration, repositories, and external services instead of reaching through static state. Late static binding matters only when inheritance is intentionally part of the design.

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

## Lesson-specific problems

<details><summary>Why is global static state hard to test?</summary><p>It is hidden and shared across tests, creating order-dependent behavior.</p></details>

<details><summary>What does late static binding solve?</summary><p><code>static::</code> resolves to the later calling class rather than the defining class.</p></details>
