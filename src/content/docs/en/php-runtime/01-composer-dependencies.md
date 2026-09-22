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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Composer and dependency management">
<p class="lesson-diagram-title">Concept map: Composer and dependency management</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>The two core files</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>install versus update</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>PSR-4 autoloading</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>A production install</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Recommended workflow</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “The two core files” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> composer.json declares requirements, allowed version ranges, autoloading, and scripts. composer.lock records the exact resolved versions and metadata for reproducible installs. Commit the lock file for applications. A published library's consumers still resolve that library inside their own application dependency graph. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “The two core files” with “install versus update”. Why does neither replace the other in “Composer and dependency management”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “The two core files”: composer.json declares requirements, allowed version ranges, autoloading, and scripts. composer.lock records the exact resolved versions and metadata for reproducible installs. Commit the lock file for applications. A published library's consumers still resolve that library inside their own application dependency graph. For “install versus update”: | Command | Purpose | |---|---| | composer install | installs exact locked versions; use in CI and production | | composer update | resolves allowed constraints again and rewrites the lock | | composer update vendor/package | narrows the requested update, with related dependency changes possible | require normally edits the manifest, resolves the lock, and installs. --dev writes the package under require-dev. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “PSR-4 autoloading”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> App\Billing\InvoiceService conventionally maps to src/Billing/InvoiceService.php. Linux filesystems are commonly case-sensitive, so incorrect casing that survives on Windows can fail after deployment. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “A production install” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> --no-dev excludes development packages at deployment time. --optimize-autoloader builds a faster class map and is suited to production. Test --classmap-authoritative carefully because runtime-generated classes may be absent. Do not hide incompatible PHP or extension requirements with --ignore-platform-reqs. Composer scripts and plugins can execute code during installation; review untrusted projects before running… Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
