---
title: 10. Testing and code quality
description: PHPUnit, unit/integration/feature tests, data providers, doubles, coverage, static analysis, and style.
sidebar:
  order: 10
---

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

