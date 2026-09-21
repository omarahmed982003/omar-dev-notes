---
title: 4. Abstraction and interfaces
description: Abstract classes, methods, interfaces, capabilities, and choosing between them.
sidebar:
  order: 4
---

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
