---
title: 1. Classes, objects, and encapsulation
description: PHP classes, objects, properties, methods, visibility, and invariant protection.
sidebar:
  order: 1
---

## Beginner bridge

A class is useful when it protects a meaningful state and offers operations that preserve its rules. Grouping unrelated values behind public getters and setters creates syntax, not a domain model.

Begin by naming an invariant such as “a balance cannot become negative through withdrawal.” Keep representation private, construct only valid objects, and expose methods that describe intent. The caller should not need to know which fields change to complete an operation.

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

## Read the boundary, not only the syntax

The constructor and <code>changePrice()</code> repeat the non-negative-price rule because both are entry points into the object’s state. If a later hydration or discount path writes <code>priceCents</code> directly, the invariant has been bypassed even though the property is private to outside callers.

Test the object from its public API:

~~~text
new Product(1, "Book", 2500)  → accepted
new Product(1, "Book", -1)    → InvalidArgumentException
changePrice(0)                → accepted boundary
changePrice(-1)               → InvalidArgumentException
~~~

This is the practical value of encapsulation: every legal route preserves the rule, every illegal route fails at the boundary, and callers do not duplicate the validation.

`public` is visible everywhere, `protected` in the class and children, and `private` only in the declaring class. Choose the narrowest visibility; protected state couples children to parent internals.

`$this` refers to the current object inside instance methods and is unavailable in static methods. Declare typed properties explicitly; dynamic undeclared properties are deprecated for most modern PHP classes.

`==` compares object properties while `===` requires the same instance. Value objects should provide domain equality deliberately.

## Lesson-specific problems

<details><summary>Why make a balance private?</summary><p>External code cannot place the object in an invalid state; changes pass through rule-enforcing methods.</p></details>

<details><summary>Does a getter for every property guarantee encapsulation?</summary><p>No. Exposing every detail preserves coupling; expose needed behavior rather than storage.</p></details>
