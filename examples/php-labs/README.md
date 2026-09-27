# PHP teaching labs

Prepare files you can actually run, and distinguish a local function test from a whole-service test. If variables and functions are new, begin the PHP lessons and return to each lab as you learn its prerequisites.

## Setup

Download the [lab files](../../public/downloads/php-labs.zip), extract them, and open a terminal inside `php-labs`. In a project checkout, use `examples/php-labs`. Install PHP 8.4 or later, then run:

```bash
php -v
php -m
php tests.php
```

Core tests require `pdo_sqlite`, `sodium`, and `mbstring`; HTTP tests additionally require `curl`. No third-party library is required for core tests. Examples explicitly marked PHP 8.5 in the modern-features lesson require 8.5. For “could not find driver,” enable `pdo_sqlite` in the configuration reported by `php --ini` for the same executable you run.

Expect `PASS` lines and a final `failures=0`. Exit code 0 means success; a failed test returns 1. Tests throw explicit exceptions rather than relying on PHP `assert`, which configuration may disable. Read the exit code with `$LASTEXITCODE` in PowerShell or `echo $?` in Bash.

## Select a test

| Command | Coverage |
|---|---|
| `php tests.php values` | Amount grammar, addition/conversion bounds, ID lists |
| `php tests.php php` | Attributes, CSV, references, Unicode, dates |
| `php tests.php security` | Post-signature claims policy, CSRF, encrypted context, hashing policy |
| `php tests.php inventory` | Purchase transaction, deduplication, rollback, constraints |
| `php locking-lab.php` | Two processes competing for SQLite stock |
| `php total.php 12.50 3.25` | Addition printing `15.75` |
| `php orders.php fixtures/orders.json` | Bounded JSON order import |
| `php stream-lab.php fixtures/large.csv` | Incremental reading of 10000 CSV records |
| `php orm-query-lab.php` | 21 queries versus two for relationship loading |
| `php restore-verify.php` | Create, open, and validate a SQLite snapshot |

In-memory SQLite starts fresh on each run. Concurrency and restore tests create and clean up their own temporary files; they do not connect to your application database.

## Real local HTTP

In one terminal inside the lab folder:

```bash
php -S 127.0.0.1:8097 http-router.php
```

In a second terminal in the same folder:

```bash
php http-client-lab.php
```

Expect `status=200`, `server_error=500`, `conditional=304`, and `timeout_handled=yes`. Read `http-router.php` for each endpoint and `src/Http.php` for ETag parsing. Stop the PHP server with Ctrl+C. This local development server does not test FPM, HTTPS, or production load.

## Read the implementation

`bootstrap.php` loads functions relative to `__DIR__`, the file’s own directory, so inclusion does not depend on the terminal directory. Read `src/Values.php` for value rules, `schema.sql` for tables and seed data, `src/Inventory.php` for the transaction, and `tests.php` for successful and failing examples.

A fixture is a known, fixed input used to reproduce a test. `fixtures/broken.json` is deliberately malformed: importing it must reject JSON syntax, not silently succeed with empty data. Change a copy of the input, not the expected result, and identify the violated rule.

## What these tests establish

`cache-lab.php` models a race schedule locally; it does not run Redis. `profiling-lab.php` calculates percentiles from fixed data; it does not export traces. JWT tests check claims after verification and do not implement an identity protocol. SQLite success does not establish PostgreSQL/MySQL isolation or deadlock behavior. Complete service-specific exercises in an isolated environment with the actual engine and configuration.
