---
title: 7. Environment variables and configuration
prev: {"link":"/en/php-runtime/08-cli-ini-extensions/","label":"PHP CLI, php.ini, and extensions"}
next: {"link":"/en/php-runtime/01-composer-dependencies/","label":"Composer and dependency management"}
description: getenv, $_ENV, putenv, .env files, typed validation, and secret handling with PHP-FPM.
sidebar:
  order: 7
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Worker:** A background process that takes jobs from a queue and runs them.
- **Boolean:** A logical value with only two states: true or false.
- **Function:** A named, reusable block of code with one defined job.


- **Variable:** A name used to access a value that may change at runtime.
- **PHP-FPM:** A process manager that runs PHP workers for a web server.
- **Container:** An isolated environment packaging an application and its dependencies.

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

```bash
composer require vlucas/phpdotenv
```

```php
require dirname(__DIR__) . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->safeLoad();
$dotenv->required(['APP_ENV', 'DATABASE_DSN']);
```

```dotenv
# .env.example - names and non-secret examples
APP_ENV=local
APP_DEBUG=false
DATABASE_DSN=mysql:host=127.0.0.1;dbname=app;charset=utf8mb4
```

Commit a non-secret `.env.example`, ignore the real `.env`, and keep it outside the document root. If a secret leaks, revoke or rotate it; deleting one commit does not invalidate the credential.

## Parse once into typed configuration

This example requires PHP 8.2+ for `readonly class` and prior knowledge of classes and constructors. Its accepted environment names are an explicit application contract; adapt them deliberately for another project.

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
        $dsn = $_ENV['DATABASE_DSN'] ?? getenv('DATABASE_DSN');
        if ($dsn === false || $dsn === '') {
            throw new RuntimeException('DATABASE_DSN is required');
        }

        $environment = $_ENV['APP_ENV'] ?? (($raw = getenv('APP_ENV')) === false ? 'production' : $raw);
        if (!in_array($environment, ['local', 'testing', 'staging', 'production'], true)) {
            throw new RuntimeException('APP_ENV is invalid');
        }

        $debug = filter_var(
            $_ENV['APP_DEBUG'] ?? (($raw = getenv('APP_DEBUG')) === false ? 'false' : $raw),
            FILTER_VALIDATE_BOOL,
            FILTER_NULL_ON_FAILURE,
        );
        if ($debug === null) {
            throw new RuntimeException('APP_DEBUG must be true or false');
        }

        $timeout = filter_var(
            $_ENV['HTTP_TIMEOUT_MS'] ?? (($raw = getenv('HTTP_TIMEOUT_MS')) === false ? '5000' : $raw),
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 100, 'max_range' => 60_000]],
        );
        if ($timeout === false) {
            throw new RuntimeException('HTTP_TIMEOUT_MS is invalid');
        }

        return new self(
            $environment,
            $debug,
            $dsn,
            $timeout,
        );
    }
}
```

Validate once at startup and inject configuration instead of calling `getenv()` throughout domain classes.

Defaults apply to absence, not explicitly invalid values. HTTP_TIMEOUT_MS='0' is present but outside the range. createImmutable loads $_ENV and $_SERVER by default, not getenv; this example reads $_ENV before falling back to process environment. This source precedence is deliberate. Never print secret values during diagnosis.

## FPM and secrets

FPM commonly clears worker environments. Pass an explicit allowlist through a pool or service manager:

```ini
clear_env = yes
env[APP_ENV] = $APP_ENV
env[DATABASE_DSN] = $DATABASE_DSN
```

Environment variables are configuration transport, not encryption. They may be visible to diagnostics or child processes. Use a secret manager for rotation, auditing, and policy; never expose `phpinfo()`, full environment dumps, or server secrets to a browser.

```text
hard-coded safe defaults
  <- committed non-secret config
  <- environment-specific values
  <- secret manager
```

## Operational problem

<details><summary>Why must secrets stay out of Git?</summary><p>History retains them and clones spread them; use a secret manager and rotate any exposed secret.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php app-config-check.php
~~~

The downloadable `app-config-check.php` contains the same AppConfig shown above, not the older LESSON_MODE exercise. In a disposable PowerShell window inside the lab directory:

~~~powershell
$env:DATABASE_DSN = 'sqlite::memory:'
$env:HTTP_TIMEOUT_MS = '0'
php app-config-check.php
$LASTEXITCODE
Remove-Item Env:HTTP_TIMEOUT_MS
php app-config-check.php
$LASTEXITCODE
Remove-Item Env:DATABASE_DSN
~~~

The first run rejects the timeout with exit 2; the second uses the default, prints key names only, and exits 0. Do not use a terminal holding your project's real configuration; cleanup removes the teaching values from this shell. In Bash use `DATABASE_DSN='sqlite::memory:' HTTP_TIMEOUT_MS=0 php app-config-check.php` for rejection and omit the timeout assignment to test absence.

**Success criterion:** Startup fails early when DATABASE_DSN is absent or a value is invalid, without printing secret values.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Build a typed configuration schema that validates once at startup and explicitly parses durations, sizes, and booleans. Define precedence among defaults, files, environment, and secret managers. Keep configuration immutable during a request and rotate secrets with an overlap window without printing values.

#### Practice cycle

Write your prediction before running the example and record the output. Introduce one controlled failure, collect evidence from logs or metrics, repair the cause, and rerun the check to prove the fix handles the fault instead of hiding it.


### Try it yourself

Remove a required variable, provide an ambiguous boolean, and verify fail-fast behavior.
