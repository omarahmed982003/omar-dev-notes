---
title: 7. Magic methods and cloning
description: __get, __set, __call, __toString, __invoke, __clone, __debugInfo, and serialization.
sidebar:
  order: 7
---

## Beginner bridge

Magic methods hook language operations such as reading an inaccessible property, calling an unknown method, converting to a string, or serializing. They can support a precise abstraction, but broad dynamic behavior hides typos and weakens static analysis.

Default cloning is shallow: the outer object is copied while referenced objects remain shared. Implement clone behavior only after deciding which nested identities should be shared, duplicated, or regenerated, and test that decision explicitly.

PHP reserves names beginning with `__` for magic behaviour. Except for `__construct`, `__destruct`, and `__clone`, magic methods must be public.

`__get/__set/__isset/__unset` intercept inaccessible properties. They support dynamic bags and proxies but weaken static analysis and hide typos. `__call/__callStatic` intercept inaccessible methods and should fail clearly for unknown names.

```php
final class Slugify
{
    public function __invoke(string $value): string
    {
        return strtolower(trim(str_replace(' ', '-', $value)));
    }
}
```

Invokable objects make small injectable strategies.

`clone` is shallow by default; nested object references stay shared. Implement `__clone` for selected mutable children. Do not clone ORM entities without understanding identity and Unit of Work.

`__debugInfo` can redact secrets from `var_dump`, but avoid logging sensitive objects. Prefer `__serialize/__unserialize` over legacy hooks and never unserialize untrusted data. Destructors are unsuitable for critical business commits; use explicit methods and `try/finally`.

## Lesson-specific problems

<details><summary>What is risky about excessive <code>__get</code> and <code>__call</code>?</summary><p>They hide mistakes from static analysis and obscure the API; keep their contract narrow.</p></details>

<details><summary>When is <code>__clone</code> needed?</summary><p>When nested objects need copying or identity must reset; default cloning is shallow.</p></details>
