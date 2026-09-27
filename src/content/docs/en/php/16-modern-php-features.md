---
title: 16. Modern PHP 8.0–8.5 roadmap
description: A versioned roadmap covering WeakMap, Fibers, DNF types, readonly classes, property hooks, and later PHP features.
sidebar:
  order: 16
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **Cache:** A temporary copy that reduces waiting and repeated work.
- **Loop:** A structure that repeats instructions according to a condition.
- **Function:** A named, reusable block of code with one defined job.


## Modern does not mean “use every feature”

Modern PHP features solve real problems, but selection starts with the project's declared minimum version and an actual need. PHP 8.4 syntax in a package claiming PHP 8.1 support fails during parsing before a runtime condition can help.

Start with `composer.json` and CI:

```json
{
  "require": {
    "php": "^8.2"
  }
}
```

For each feature ask when it appeared, whether production/CI/developers run that version, whether it clarifies design, and how compatibility is tested. The timeline is not a checklist. `WeakMap` can attach metadata to object lifetime, and fibers underpin async libraries, but an ordinary CRUD application may never use either directly.

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

## PHP 8.0 through 8.3 timeline

| Release | Features to understand |
|---|---|
| PHP 8.0 | Named arguments, attributes, constructor property promotion, union types, `match`, nullsafe access, `WeakMap`, and `ValueError` |
| PHP 8.1 | Enums, Fibers, first-class callables, intersection types, `never`, and readonly properties |
| PHP 8.2 | DNF types, readonly classes, standalone `true`, `false`, and `null` types, `#[SensitiveParameter]`, and dynamic-property deprecation |
| PHP 8.3 | Typed class constants, `#[Override]`, readonly cloning amendments, and dynamic class-constant access |

This is not a blind upgrade checklist. Read each release's backward-incompatible and deprecated changes, then run tests and static analysis before changing the PHP constraint in `composer.json`.

## WeakMap — PHP 8.0

A `WeakMap` attaches metadata to an object without keeping that object alive. Once no strong reference remains, garbage collection can remove both the object and its map entry.

```php
<?php

declare(strict_types=1);

final class Request {}

$metadata = new WeakMap();
$request = new Request();
$metadata[$request] = ['startedAt' => microtime(true)];

echo isset($metadata[$request]) ? "tracked\n" : "missing\n";
unset($request);

echo count($metadata), PHP_EOL;
```

Use it for object-associated metadata, not as a durable cache, and never make business correctness depend on the exact timing of garbage collection.

## Fibers — PHP 8.1

A Fiber is a cooperatively suspended execution unit. It is not a thread and does not make CPU work parallel automatically. Event loops and async runtimes use Fibers to present sequential-looking code while scheduling I/O.

```php
<?php

$fiber = new Fiber(function (): string {
    $reply = Fiber::suspend('waiting-for-data');
    return strtoupper((string) $reply);
});

echo $fiber->start(), PHP_EOL;
$fiber->resume('done');
echo $fiber->getReturn(), PHP_EOL;
```

Do not resume before starting or after termination. Prefer a proven async runtime over inventing a scheduler for an ordinary request-response application.

## Generator composition with yield from

`yield from` delegates iteration to another iterable, allowing streaming pipelines to be composed without loading every value into memory.

```php
function lines(string $path): Generator
{
    $file = new SplFileObject($path);
    foreach ($file as $line) {
        yield rtrim((string) $line, "\r\n");
    }
}

function allLines(array $paths): Generator
{
    foreach ($paths as $path) {
        yield from lines($path);
    }
}
```

Generators are normally single-pass, and delegation does not make blocking I/O asynchronous by itself.

## DNF types and readonly classes — PHP 8.2

A DNF type is a union of intersection types. Each intersection must be parenthesized:

```php
function export((JsonSerializable&Stringable)|array $value): string
{
    return is_array($value)
        ? json_encode($value, JSON_THROW_ON_ERROR)
        : (string) $value;
}

readonly class Money
{
    public function __construct(
        public int $minorUnits,
        public string $currency,
    ) {
        if ($minorUnits < 0) {
            throw new InvalidArgumentException('Negative money');
        }
    }
}
```

A readonly class makes declared instance properties readonly and prevents dynamic properties, but it does not make referenced mutable objects deeply immutable.

## Attributes and reflection — PHP 8+

```php
#[Attribute(Attribute::TARGET_FUNCTION)]
final readonly class RequiresRole
{
    public function __construct(public string $role) {}
}

#[RequiresRole('admin')]
function deleteUser(int $id): void {}

$attribute = (new ReflectionFunction('deleteUser'))
    ->getAttributes(RequiresRole::class)[0]->newInstance();
echo $attribute->role; // admin
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

- [PHP 8.0](https://www.php.net/manual/en/migration80.new-features.php) and [PHP 8.1](https://www.php.net/manual/en/migration81.new-features.php)
- [PHP 8.2](https://www.php.net/manual/en/migration82.new-features.php) and [PHP 8.3](https://www.php.net/manual/en/migration83.new-features.php)
- [PHP 8.4](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5](https://www.php.net/releases/8.5/en.php)
- [Supported versions](https://www.php.net/supported-versions.php)

## Progressive practice

<details><summary>1. A project supports PHP 8.2. Can it use property hooks?</summary><p>No; they require 8.4. Raise the supported runtime through a migration or keep compatible design.</p></details>

<details><summary>2. When is WeakMap useful?</summary><p>When metadata should disappear with an object's lifetime and the metadata store must not keep that object alive.</p></details>

<details><summary>3. Does a fiber provide parallel CPU execution?</summary><p>No. It supports cooperative suspension within a thread; a scheduler or event loop coordinates resumption.</p></details>

## Lesson-specific problems

<details><summary>Should a feature be used only because it is new?</summary><p>No. Tie it to a problem, declare the minimum PHP version, and verify production and tooling support.</p></details>

<details><summary>What does readonly provide?</summary><p>It makes non-reassignment intent explicit, but does not make an entire object graph deeply immutable.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php modern-features-lab.php
~~~

**Success criterion:** Tests cover valid and invalid enum values, readonly mutation, and an unmatched match expression; use each feature because it strengthens the contract, not because it is new.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Read by the project minimum PHP version: stable usable features, migration/deprecations, then features available only after a platform upgrade. Run CI on the lowest and highest supported versions and use PHPCompatibility or equivalent analysis. An 8.5 example cannot live in code claiming 8.1 support.

### Try it yourself

Create a compatibility matrix for each example and name the fallback on the minimum version.
