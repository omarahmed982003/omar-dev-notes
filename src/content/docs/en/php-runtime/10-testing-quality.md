---
title: 10. Testing and code quality
description: PHPUnit, unit/integration/feature tests, data providers, doubles, coverage, static analysis, and style.
sidebar:
  order: 10
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **Function:** A named, reusable block of code with one defined job.


## A practical test pyramid

- **Unit:** small logic without network or database.
- **Integration:** real collaboration with a database, filesystem, or adapter.
- **Feature/HTTP:** a complete request through the application.
- **End-to-end:** user-visible system behavior; fewer and more expensive.

Do not replace every collaborator with a mock. Test contracts at boundaries and behavior that matters to users.

## PHPUnit

```bash
composer require --dev phpunit/phpunit
vendor/bin/phpunit
```

```php
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class DiscountTest extends TestCase
{
    #[DataProvider('cases')]
    public function testDiscount(int $price, int $percent, int $expected): void
    {
        self::assertSame($expected, discount($price, $percent));
    }

    public static function cases(): iterable
    {
        yield 'none' => [1000, 0, 1000];
        yield 'ten percent' => [1000, 10, 900];
    }
}
```

Test boundaries, exceptions, and side effects. Make test names describe behavior.

## Doubles and coverage

A stub returns prepared data, a fake is a lightweight working implementation, and a mock verifies interaction. Prefer fakes or stubs where possible; excessive mocks couple tests to implementation.

Coverage finds unexecuted code but cannot prove useful assertions. Focus on branches and critical behavior rather than an isolated 100% target.

## Automated quality

Run PHPUnit, PHPStan/Psalm, and PHPCS/PHP-CS-Fixer locally and in CI with the same configuration. Control clocks and randomness, isolate database tests, avoid ordering dependencies, and never copy real production personal data into fixtures.

## Reference

- [PHPUnit Manual](https://docs.phpunit.de/)

## Operational problem

<details><summary>When should you choose an integration test?</summary><p>When validating real boundaries such as a database or HTTP collaboration rather than isolated function logic.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php tests.php
~~~

**Success criterion:** Happy-path, boundary, and failure tests pass; deliberately break one condition once and confirm the relevant test fails before restoring it.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Separate unit, integration, contract, and end-to-end tests by boundary. Control time, randomness, and external services, and run tests in parallel without shared state. Coverage does not prove assertion quality; mutation testing exposes tests that survive logic changes, and CI starts clean.

### Try it yourself

Mutate an operator and prove a test fails, then run the suite in random order.
