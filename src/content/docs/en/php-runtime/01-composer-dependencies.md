---
title: 1. Composer and dependency management
description: composer.json, composer.lock, install, update, require-dev, PSR-4, and production installs.
sidebar:
  order: 1
---

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

## A production install

```bash
composer validate --strict
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
composer audit
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
