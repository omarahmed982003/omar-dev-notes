---
title: 7. Magic methods and cloning
description: __get, __set, __call, __toString, __invoke, __clone, __debugInfo, and serialization.
sidebar:
  order: 7
---

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
