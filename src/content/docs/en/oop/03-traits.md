---
title: 3. Traits
description: Horizontal reuse, precedence, conflict resolution, aliases, visibility, and design limits.
sidebar:
  order: 3
---

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

```php
use JsonLogger, TextLogger {
    JsonLogger::log insteadof TextLogger;
    TextLogger::log as logText;
    JsonLogger::log as protected logJson;
}
```

`insteadof` chooses the winner. `as` adds an alias or changes visibility but does not resolve the conflict alone. Traits may declare abstract requirements.

Keep traits small and cohesive; large traits hide dependencies and state. Direct static access on the trait name is deprecated. PHP 8.3 can mark imported methods final via `as final`; PHP 8.5 changed binding order with parent properties/constants, so test upgrades. Use an interface when callers need a type contract.
