---
title: 1. Classes, objects, and encapsulation
description: PHP classes, objects, properties, methods, visibility, and invariant protection.
sidebar:
  order: 1
---

A class defines state and behaviour; each object is an instance with its own state.

```php
final class Product
{
    public function __construct(
        public readonly int $id,
        public string $name,
        private int $priceCents,
    ) {
        if ($priceCents < 0) {
            throw new InvalidArgumentException('Negative price');
        }
    }

    public function changePrice(int $value): void
    {
        if ($value < 0) {
            throw new InvalidArgumentException('Negative price');
        }
        $this->priceCents = $value;
    }
}
```

Encapsulation means hiding representation, exposing meaningful operations, and preventing invalid state. A public setter for every property is not good encapsulation; prefer `withdraw()` over `setBalance()`.

`public` is visible everywhere, `protected` in the class and children, and `private` only in the declaring class. Choose the narrowest visibility; protected state couples children to parent internals.

`$this` refers to the current object inside instance methods and is unavailable in static methods. Declare typed properties explicitly; dynamic undeclared properties are deprecated for most modern PHP classes.

`==` compares object properties while `===` requires the same instance. Value objects should provide domain equality deliberately.
