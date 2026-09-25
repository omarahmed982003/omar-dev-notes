---
title: 16. Modern PHP 8.0–8.5 roadmap
description: A versioned roadmap covering WeakMap, Fibers, DNF types, readonly classes, property hooks, and later PHP features.
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

- [PHP 8.0](https://www.php.net/manual/en/migration80.new-features.php) and [PHP 8.1](https://www.php.net/manual/en/migration81.new-features.php)
- [PHP 8.2](https://www.php.net/manual/en/migration82.new-features.php) and [PHP 8.3](https://www.php.net/manual/en/migration83.new-features.php)
- [PHP 8.4](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5](https://www.php.net/releases/8.5/en.php)
- [Supported versions](https://www.php.net/supported-versions.php)

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Modern PHP 8.0–8.5">
<p class="lesson-diagram-title">Concept map: Modern PHP 8.0–8.5</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Declare the minimum version</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Attributes and reflection — PHP 8+</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Property hooks and asymmetric visibility — PHP 8.4</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Lazy objects — PHP 8.4</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Pipe operator — PHP 8.5</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Declare the minimum version” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Do not use a feature without declaring the runtime requirement and testing deployment: Run composer check-platform-reqs during deployment. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Declare the minimum version” with “Attributes and reflection — PHP 8+”. Why does neither replace the other in “Modern PHP 8.0–8.5”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Declare the minimum version”: Do not use a feature without declaring the runtime requirement and testing deployment: Run composer check-platform-reqs during deployment. For “Attributes and reflection — PHP 8+”: Attributes are structured metadata; they do not enforce authorization until application or framework code reads and applies them. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Property hooks and asymmetric visibility — PHP 8.4”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Hooks customize get/set behavior while asymmetric visibility controls who may read and write. Prefer named methods for complex domain operations. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Lazy objects — PHP 8.4” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Reflection supports lazy ghosts and proxies that initialize when state is observed. They primarily support DI containers and ORMs; understand identity, initialization triggers, cloning, and serialization before direct use. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
