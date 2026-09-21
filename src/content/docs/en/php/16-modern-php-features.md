---
title: 16. Modern PHP 8.4 and 8.5
description: Attributes, reflection, property hooks, asymmetric visibility, lazy objects, pipe, URI, and clone-with.
sidebar:
  order: 16
---

## Declare the minimum version

Do not use a feature without declaring the runtime requirement and testing deployment:

```json
{
  "require": {
    "php": "^8.4 || ^8.5"
  }
}
```

Run `composer check-platform-reqs` during deployment.

## Attributes and reflection — PHP 8+

```php
#[Attribute(Attribute::TARGET_METHOD)]
final readonly class RequiresRole
{
    public function __construct(public string $role) {}
}

#[RequiresRole('admin')]
function deleteUser(int $id): void {}
```

Attributes are structured metadata; they do not enforce authorization until application or framework code reads and applies them.

## Property hooks and asymmetric visibility — PHP 8.4

```php
final class User
{
    public private(set) string $email {
        set => filter_var($value, FILTER_VALIDATE_EMAIL)
            ? strtolower($value)
            : throw new InvalidArgumentException('Invalid email');
    }
}
```

Hooks customize get/set behavior while asymmetric visibility controls who may read and write. Prefer named methods for complex domain operations.

## Lazy objects — PHP 8.4

Reflection supports lazy ghosts and proxies that initialize when state is observed. They primarily support DI containers and ORMs; understand identity, initialization triggers, cloning, and serialization before direct use.

## Pipe operator — PHP 8.5

```php
$slug = $title
    |> trim(...)
    |> mb_strtolower(...)
    |> (fn (string $v): string => str_replace(' ', '-', $v));
```

Each callable receives the previous result as one argument. Avoid hiding side effects in a pipeline.

## URI and clone-with — PHP 8.5

The URI extension provides standards-based parsing instead of manual string operations. Clone-with simplifies immutable “with” operations:

```php
$published = clone($draft, ['status' => Status::Published]);
```

Preserve invariants with hooks, constructors, and tests.

Other additions include `array_first()`, `array_last()`, `#[NoDiscard]`, constant attributes, and partitioned cookies. Read migration guides and run tests plus static analysis before upgrading.

## References

- [PHP 8.4](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5](https://www.php.net/releases/8.5/en.php)
- [Supported versions](https://www.php.net/supported-versions.php)

