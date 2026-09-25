---
title: 7. Environment variables and configuration
description: getenv, $_ENV, putenv, .env files, typed validation, and secret handling with PHP-FPM.
sidebar:
  order: 7
---

# Separate configuration from code

Environment variables are values supplied to a process by the operating system, container, or service manager.

```text
OS / container / service manager
              -> PHP-FPM master
              -> worker process
              -> getenv() / $_SERVER / $_ENV
```

## PHP access paths

```php
$dsn = getenv('DATABASE_DSN');
if ($dsn === false || $dsn === '') {
    throw new RuntimeException('DATABASE_DSN is required');
}
```

Use `=== false`; the string `"0"` is a valid value even though it is falsy.

- `getenv()` reads an environment variable.
- `$_ENV` contains values imported by PHP and may be empty when `variables_order` excludes `E`.
- `$_SERVER` can contain environment/CGI values depending on the SAPI.
- `putenv()` changes the current process environment for the request and does not automatically synchronize `$_ENV`.

PHP does not load `.env` files by itself. A framework, a package such as `vlucas/phpdotenv`, or custom bootstrap code does so. Production can inject values directly with no file.

## Development files

```php
require dirname(__DIR__) . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->safeLoad();
$dotenv->required(['APP_ENV', 'DATABASE_DSN']);
```

Commit a non-secret `.env.example`, ignore the real `.env`, and keep it outside the document root. If a secret leaks, revoke or rotate it; deleting one commit does not invalidate the credential.

## Parse once into typed configuration

```php
final readonly class AppConfig
{
    public function __construct(
        public string $environment,
        public bool $debug,
        public string $databaseDsn,
        public int $httpTimeoutMs,
    ) {}

    public static function fromEnvironment(): self
    {
        $dsn = getenv('DATABASE_DSN');
        if ($dsn === false || $dsn === '') {
            throw new RuntimeException('DATABASE_DSN is required');
        }

        $debug = filter_var(
            getenv('APP_DEBUG') ?: 'false',
            FILTER_VALIDATE_BOOL,
            FILTER_NULL_ON_FAILURE,
        );
        if ($debug === null) {
            throw new RuntimeException('APP_DEBUG must be true or false');
        }

        $timeout = filter_var(
            getenv('HTTP_TIMEOUT_MS') ?: '5000',
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 100, 'max_range' => 60_000]],
        );
        if ($timeout === false) {
            throw new RuntimeException('HTTP_TIMEOUT_MS is invalid');
        }

        return new self(
            getenv('APP_ENV') ?: 'production',
            $debug,
            $dsn,
            $timeout,
        );
    }
}
```

Validate once at startup and inject configuration instead of calling `getenv()` throughout domain classes.

## FPM and secrets

FPM commonly clears worker environments. Pass an explicit allowlist through a pool or service manager:

```ini
clear_env = yes
env[APP_ENV] = $APP_ENV
env[DATABASE_DSN] = $DATABASE_DSN
```

Environment variables are configuration transport, not encryption. They may be visible to diagnostics or child processes. Use a secret manager for rotation, auditing, and policy; never expose `phpinfo()`, full environment dumps, or server secrets to a browser.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Environment variables and configuration">
<p class="lesson-diagram-title">Concept map: Environment variables and configuration</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>PHP access paths</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Development files</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Parse once into typed configuration</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>FPM and secrets</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “PHP access paths” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Use <code>=== false</code>; the string &quot;0&quot; is a valid value even though it is falsy. getenv() reads an environment variable. $_ENV contains values imported by PHP and may be empty when variables_order excludes E. $_SERVER can contain environment/CGI values depending on the SAPI. putenv() changes the current process environment for the request and does not automatically synchronize $_ENV. PHP does not load .env files by itself. A… In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “PHP access paths” with “Development files”. Why does neither replace the other in “Environment variables and configuration”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “PHP access paths”: Use <code>=== false</code>; the string &quot;0&quot; is a valid value even though it is falsy. getenv() reads an environment variable. $_ENV contains values imported by PHP and may be empty when variables_order excludes E. $_SERVER can contain environment/CGI values depending on the SAPI. putenv() changes the current process environment for the request and does not automatically synchronize $_ENV. PHP does not load .env files by itself. A… For “Development files”: Commit a non-secret .env.example, ignore the real .env, and keep it outside the document root. If a secret leaks, revoke or rotate it; deleting one commit does not invalidate the credential. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Parse once into typed configuration”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Validate once at startup and inject configuration instead of calling getenv() throughout domain classes. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “FPM and secrets” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> FPM commonly clears worker environments. Pass an explicit allowlist through a pool or service manager: Environment variables are configuration transport, not encryption. They may be visible to diagnostics or child processes. Use a secret manager for rotation, auditing, and policy; never expose phpinfo(), full environment dumps, or server secrets to a browser. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
