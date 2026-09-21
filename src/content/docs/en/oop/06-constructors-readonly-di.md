---
title: 6. Constructors, readonly, and dependency injection
description: Valid construction, promotion, readonly semantics, and explicit collaborators.
sidebar:
  order: 6
---

A successful constructor should leave a valid object. Property promotion declares and assigns properties concisely. A child-defined constructor does not automatically invoke the parent constructor.

```php
final readonly class EmailAddress
{
    public function __construct(public string $value)
    {
        if (filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidArgumentException();
        }
    }
}
```

Readonly classes (PHP 8.2+) make declared properties readonly and prohibit dynamic properties. Readonly is not deep immutability: nested mutable objects can still change. PHP 8.4 changed implicit set visibility to `protected(set)`.

Dependency injection exposes collaborators:

```php
final class OrderService
{
    public function __construct(
        private PaymentGateway $payments,
        private OrderRepository $orders,
        private Clock $clock,
    ) {}
}
```

DI does not require a container. Use constructor injection for lifetime requirements, method parameters for operation-specific inputs, and avoid service locators that hide dependencies.
