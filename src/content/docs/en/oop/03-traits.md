---
title: 3. Traits
description: Horizontal reuse, precedence, conflict resolution, aliases, visibility, and design limits.
sidebar:
  order: 3
---

## Beginner bridge

A trait is horizontal code reuse inserted into a class. It is not an independent object, runtime collaborator, or domain type. Traits are most effective for small, cohesive implementation details that genuinely belong to every consuming class.

A trait that requires many hidden properties or calls unrelated methods creates invisible coupling. In that case, extract a service with an interface and inject it. Resolve naming conflicts explicitly and keep the public API understandable without reading the trait source.

Traits provide horizontal reuse in PHP’s single-inheritance model and cannot be instantiated.

```php
trait HasTimestamps
{
    private ?DateTimeImmutable $updatedAt = null;

    public function touch(): void
    {
        $this->updatedAt = new DateTimeImmutable();
    }
}
```

A class method overrides a trait method; a trait method overrides an inherited method. Two traits providing the same method require explicit resolution:

Fragment inside the surrounding class; not a standalone file.

```php
use JsonLogger, TextLogger {
    JsonLogger::log insteadof TextLogger;
    TextLogger::log as logText;
    JsonLogger::log as protected logJson;
}
```

`insteadof` chooses the winner. `as` adds an alias or changes visibility but does not resolve the conflict alone. Traits may declare abstract requirements.

Keep traits small and cohesive; large traits hide dependencies and state. Direct static access on the trait name is deprecated. PHP 8.3 can mark imported methods final via `as final`; PHP 8.5 changed binding order with parent properties/constants, so test upgrades. Use an interface when callers need a type contract.

## Lesson-specific problems

<details><summary>Is a trait a type that can be injected?</summary><p>No. It copies methods into a class; use an interface and service for an independent contract.</p></details>

<details><summary>How are trait method conflicts resolved?</summary><p>Use <code>insteadof</code> to select an implementation and <code>as</code> for an alias.</p></details>
