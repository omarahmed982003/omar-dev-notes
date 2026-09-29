---
title: 1. Composer and dependency management
description: composer.json, composer.lock, install, update, require-dev, PSR-4, and production installs.
sidebar:
  order: 1
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.


- **Autoloading:** Loading a class file when the class is first used.
- **Composer:** PHP dependency manager that installs libraries and prepares autoloading.

### New terms in this lesson

This lesson introduces no extra technical label that needs memorizing; its new ideas are explained where they first appear.

# Composer: PHP dependency management

Composer resolves project libraries and versions and generates an autoloader. It does not install PHP itself; it resolves constraints in `composer.json` and normally installs packages under `vendor/`.

## The two core files

- `composer.json` declares requirements, allowed version ranges, autoloading, and scripts.
- `composer.lock` records the exact resolved versions and metadata for reproducible installs.

```json
{
  "require": {
    "php": "^8.3",
    "guzzlehttp/guzzle": "^7.9"
  },
  "require-dev": {
    "phpunit/phpunit": "^11.0"
  },
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  }
}
```

Commit the lock file for applications. A published library's consumers still resolve that library inside their own application dependency graph.

## install versus update

| Command | Purpose |
|---|---|
| `composer install` | installs exact locked versions; use in CI and production |
| `composer update` | resolves allowed constraints again and rewrites the lock |
| `composer update vendor/package` | narrows the requested update, with related dependency changes possible |

```bash
composer install
composer require monolog/monolog
composer require --dev phpunit/phpunit
composer update guzzlehttp/guzzle --with-all-dependencies
```

`require` normally edits the manifest, resolves the lock, and installs. `--dev` writes the package under `require-dev`.

## PSR-4 autoloading

```bash
composer dump-autoload
```

```php
<?php
declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';

$service = new App\Billing\InvoiceService();
```

`App\Billing\InvoiceService` conventionally maps to `src/Billing/InvoiceService.php`. Linux filesystems are commonly case-sensitive, so incorrect casing that survives on Windows can fail after deployment.

```text
src/Billing/InvoiceService.php
```

## A production install

```bash
composer validate --strict
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
composer audit --locked
composer check-platform-reqs --lock --no-dev
```

- `--no-dev` excludes development packages at deployment time.
- `--optimize-autoloader` builds a faster class map and is suited to production.
- Test `--classmap-authoritative` carefully because runtime-generated classes may be absent.
- Do not hide incompatible PHP or extension requirements with `--ignore-platform-reqs`.
- Composer scripts and plugins can execute code during installation; review untrusted projects before running them.

## Recommended workflow

1. Resolve dependency changes during development.
2. Review both manifest and lock diffs.
3. Run tests and `composer audit`.
4. Commit both files; normally exclude `vendor/`.
5. Deploy with `composer install`, never an uncontrolled `update`.

## Operational problem

<details><summary>Why commit composer.lock for an application?</summary><p>It reproduces tested versions across environments; composer.json states constraints while the lock records the resolved set.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Run this checkpoint inside `examples/php-labs` or the extracted lab package:

~~~bash
composer validate --strict
composer audit --locked
composer check-platform-reqs --lock --no-dev
~~~

**Success criterion:** All commands exit 0; <code>composer.lock</code> is valid, its contents have no known advisory, and the real PHP version and extensions satisfy production requirements. The lock makes <code>--locked</code> reproducible; <code>validate</code> alone neither creates nor guarantees a lock.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Treat SemVer as a compatibility contract, not a quality guarantee: <code>^</code> and <code>~</code> open different ranges while the lock records actual choices. Validate platform requirements and extensions, configure private repositories without committed tokens, and review scripts because Composer executes them.

#### Practice cycle

Write your prediction before running the example and record the output. Introduce one controlled failure, collect evidence from logs or metrics, repair the cause, and rerun the check to prove the fix handles the fault instead of hiding it.


### Try it yourself

Explain why install from the lock differs from update in production.
