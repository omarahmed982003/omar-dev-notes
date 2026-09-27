---
title: 4. Abstraction and interfaces
description: Abstract classes, methods, interfaces, capabilities, and choosing between them.
sidebar:
  order: 4
---

## Beginner bridge

An interface defines the smallest behavior a caller needs and allows implementations to vary. An abstract class additionally shares identity, state, or a controlled algorithm. Neither tool is valuable when created only to add layers around one concrete class.

Design contracts from the consumer’s needs. Keep them narrow, state failure behavior, and avoid leaking storage or framework details. A fake implementation used in tests should obey the same observable contract as the production one.

Abstraction exposes what callers need while hiding implementation details.

```php
abstract class PaymentMethod
{
    final public function charge(int $amount): Receipt
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException();
        }
        return $this->performCharge($amount);
    }

    abstract protected function performCharge(int $amount): Receipt;
}
```

An abstract class cannot be instantiated and may hold state, a constructor, concrete methods, and abstract requirements. PHP 8.4 adds abstract properties with get/set requirements, but method contracts remain clearer for multi-version libraries.

```php
interface PaymentGateway
{
    public function charge(string $customerId, int $amount): Receipt;
}
```

An interface defines capability without one inheritance tree; a class may implement several interfaces. Split large interfaces so consumers depend only on required operations. Use interfaces at boundaries and for injected collaborators; use abstract classes when related types genuinely share stable state/implementation.

## Lesson-specific problems

<details><summary>What does an interface describe?</summary><p>The behavior a caller may rely on without coupling to implementation.</p></details>

<details><summary>When is an abstract class appropriate?</summary><p>When implementations share a real identity and base behavior or state, not merely two duplicated lines.</p></details>
