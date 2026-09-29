---
title: 10. Namespaces, Composer, and quality tools
description: Names, imports, aliases, resolution rules, and mapping a namespace to directories with Composer PSR-4.
sidebar:
  order: 10
---

## Two separate problems: duplicate names and unloaded files

Your project and an external library both define a User class. A **namespace** gives the name an address, like identical street names in different cities. **Autoloading** solves another problem: who loads the file when PHP needs a class? **Composer** manages packages, resolves compatible libraries, and generates an autoloader.

We use a small class only as a container for a function; class design belongs in [OOP](/en/oop/). This project needs PHP 8.3+ and Composer 2. Check `php -v` and `composer --version` and run every command inside the project directory, not the documentation site directory.

## The complete project

A ready copy lives in `examples/php-course/composer-demo` in the repository and the [course examples download](/downloads/php-course.zip). Alternatively, create these four files with the exact casing:

~~~text
composer-demo/
  composer.json
  bin/demo.php
  src/Billing/PriceCalculator.php
  tests/PriceCalculatorTest.php
~~~

### 1. composer.json: describe the project

`require` lists runtime requirements; `require-dev` lists development tools. These version ranges are deliberately compatible choices for the example, not a claim to be the latest versions:

~~~json
{
  "name": "learning/price-demo",
  "type": "project",
  "require": {
    "php": "^8.3"
  },
  "require-dev": {
    "phpunit/phpunit": "^11.5",
    "phpstan/phpstan": "^2.1",
    "friendsofphp/php-cs-fixer": "^3.0"
  },
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  },
  "scripts": {
    "demo": "@php bin/demo.php",
    "test": "@php vendor/bin/phpunit --bootstrap vendor/autoload.php tests",
    "analyse": "@php vendor/bin/phpstan analyse src --level=6 --no-progress",
    "style": "@php vendor/bin/php-cs-fixer fix src --dry-run --diff --rules=@PSR12",
    "check": [
      "@test",
      "@analyse",
      "@style"
    ]
  },
  "config": {
    "platform": {
      "php": "8.3.0"
    }
  },
  "description": "A small PSR-4 teaching project with boundary tests and development tools"
}
~~~

In JSON, `App\\` encodes the string `App\` because backslashes are escaped. **PSR-4** maps a namespace prefix to a base directory. Composer removes `App\` and converts the rest into a path: `App\Billing\PriceCalculator` → `src/Billing/PriceCalculator.php`. PHP itself does not impose this directory structure; PSR-4 does.

### 2. The class: src/Billing/PriceCalculator.php

~~~php
<?php

declare(strict_types=1);

namespace App\Billing;

final class PriceCalculator
{
    public function subtotal(int $price, int $quantity): int
    {
        if ($price < 0 || $quantity < 1 || $price > intdiv(PHP_INT_MAX, $quantity)) {
            throw new \InvalidArgumentException('Invalid order');
        }

        return $price * $quantity;
    }
}
~~~

`namespace` follows declare and precedes definitions. The full class name is now App\Billing\PriceCalculator. `public function` exposes a method on the object. The guard rejects negative prices and quantities below 1. `||` short-circuits, so zero quantity never reaches division. Comparing price with `intdiv(PHP_INT_MAX, $quantity)` rejects multiplication overflow **before** it happens. `\InvalidArgumentException` is a fully qualified global name.

### 3. Entry point: bin/demo.php

~~~php
<?php
declare(strict_types=1);

use App\Billing\PriceCalculator;

require dirname(__DIR__) . '/vendor/autoload.php';

$calculator = new PriceCalculator();
echo $calculator->subtotal(1500, 3), PHP_EOL;
~~~

`use` is a local name alias; it neither reads a file nor constructs an object. Requiring `vendor/autoload.php` registers the loader; `new` requests the class, which Composer loads. `composer demo` runs `@php` using Composer's PHP executable. The result is `4500`.

### 4. Test behavior: tests/PriceCalculatorTest.php

A **test** is an automated experiment with input and an expected result. An **assertion** fails with a diagnostic when reality differs. PHPUnit discovers test methods; the chosen 11.5 line supports this project's PHP baseline:

~~~php
<?php
declare(strict_types=1);

use App\Billing\PriceCalculator;
use PHPUnit\Framework\TestCase;

final class PriceCalculatorTest extends TestCase
{
    public function testValidOrder(): void
    {
        self::assertSame(4500, (new PriceCalculator())->subtotal(1500, 3));
    }

    public function testZeroPriceIsAllowed(): void
    {
        self::assertSame(0, (new PriceCalculator())->subtotal(0, 1));
    }

    public function testZeroQuantityIsRejected(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new PriceCalculator())->subtotal(100, 0);
    }

    public function testNegativePriceIsRejected(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new PriceCalculator())->subtotal(-1, 1);
    }

    public function testOverflowIsRejected(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new PriceCalculator())->subtotal(PHP_INT_MAX, 2);
    }
}
~~~

`assertSame` checks both type and value. Set expectException before the operation expected to fail. These tests verify pricing and boundaries, not variable names. The first authoring run creates the lock file:

~~~bash
composer update
composer demo
composer check
composer audit
~~~

## composer.lock: the same versions on another machine

`composer.json` declares ranges; `composer.lock` records exact resolved versions. **install** with a lock installs those versions. **update** resolves ranges again and may change the lock. Commit both files for this application and do not edit the lock manually. Teammates use `composer install`, not update just to start work. `vendor` is reproducible output and should not be committed.

**SemVer** uses `major.minor.patch`: breaking changes, compatible additions, compatible fixes according to package policy. `^2.1` allows `>=2.1.0 <3.0.0`. `~2.1.0` allows `>=2.1.0 <2.2.0`. `^0.3.2` stops before `0.4.0` because pre-1.0 compatibility is narrower. Ranges express a publisher's compatibility promise, not a substitute for tests.

`composer require vendor/package` adds a dependency and updates the lock; `composer require --dev ...` adds development tooling. Review origin and diff before adopting a package. `composer audit` checks published advisories using current data; success is not proof of complete security. Update a selected dependency with `composer update vendor/package` and test afterward.

## Scripts, analysis, and formatting

A **script** is a named command in composer.json. `composer check` runs test, analyse, then style; a failure stops the sequence with a nonzero exit code. Scripts and plugins can execute code, so inspect what a project supplies before running it.

**Static analysis** checks types and code paths without executing every input. PHPStan analyzes src at level 6 here. Temporarily return a string from subtotal: analysis should fail; then restore the correct implementation. Analysis cannot replace a test for a mathematically wrong result of the correct type.

PHP-CS-Fixer checks presentation. `--dry-run --diff` reports changes without applying them. To deliberately apply fixes use `composer exec -- php-cs-fixer fix src --rules=@PSR12`. Formatting does not fix logic. Pest, Psalm, and Pint are alternatives; this lab does not install two tools for each role.

## Diagnose Class not found

Trace the name through use, the namespace declaration, Composer's prefix, the file path/casing, and the autoloader require. Linux is usually case-sensitive; `billing` working in place of `Billing` on your machine does not prove correctness. After changing autoload mappings, run `composer dump-autoload`. A new correctly placed PSR-4 class usually needs no regeneration with the ordinary loader; optimized/authoritative classmaps have their own regeneration needs.

Names starting with `\` are fully qualified. `namespace\Name` is relative to the current namespace. Short class names resolve through imports and then the current namespace; unqualified function/constant names may fall back to global definitions, so do not generalize class rules to them. Use aliases such as `use X\User as ExternalUser`, `use function X\helper`, or `use const X\LIMIT`. Imports operate at file/compile scope and differ from closure capture use.

Composer supports `classmap` for non-PSR-4 code, `files` for always-loaded functions, and `autoload-dev` for test definitions. Loading a class file should not make network requests.

## Development and production setup

Development installs require-dev and runs check. Deploy from the lock using `composer install --no-dev --optimize-autoloader`, then `composer check-platform-reqs --no-dev` on the real production platform. `config.platform` guides dependency resolution for a target but neither installs extensions nor changes the actual PHP runtime. Do not run an arbitrary update during deployment. Lessons 11 and 17 cover error settings and Xdebug.

## Predict, debug, complete

<details><summary>Predict: delete vendor, then composer install with a lock</summary><p>It restores the locked versions on a compatible platform; install does not search for the newest version. A missing required extension causes a platform failure.</p></details>

<details><summary>Debug: use is correct but the class cannot be found</summary><p>use does not load files. Check vendor/autoload.php, mappings, namespace, filename, and casing; regenerate the loader after mapping changes.</p></details>

<details><summary>Complete PSR-4 for App\Billing\PriceCalculator</summary><p>The prefix is <code>App\</code> mapped to src/, leaving Billing/PriceCalculator.php. JSON requires two backslashes to represent one.</p></details>

<details><summary>Tests and formatting pass. Does that prove all inputs work?</summary><p>No. Tests cover selected cases, analysis checks contracts, and formatting checks presentation. Add boundary cases derived from requirements, not tests that merely repeat implementation.</p></details>

References: [Composer](https://getcomposer.org/doc/01-basic-usage.md), [constraints](https://getcomposer.org/doc/articles/versions.md), [PHPUnit](https://docs.phpunit.de/en/11.5/writing-tests-for-phpunit.html), [PHPStan](https://phpstan.org/user-guide/getting-started), [PHP-CS-Fixer](https://cs.symfony.com/doc/usage.html).
