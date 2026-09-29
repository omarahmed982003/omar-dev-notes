# PHP teaching labs

Prepare files you can actually run, and distinguish a local function test from a whole-service test. If variables and functions are new, begin the PHP lessons and return to each lab as you learn its prerequisites.

## Setup

Download the [lab files](../../public/downloads/php-labs.zip), extract them, and open a terminal inside `php-labs`. In a project checkout, use `examples/php-labs`. Install PHP 8.4 or later, then run:

```bash
php -v
php -m
php tests.php
composer validate --strict
composer audit --locked
composer check-platform-reqs --lock --no-dev
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

## Composer and production configuration

`composer.lock` is committed even though this lab currently has platform requirements only. This makes `audit --locked` and `check-platform-reqs --lock` reproducible and demonstrates the application workflow used by the Composer lessons.

The `production` directory contains a small Nginx + PHP-FPM deployment:

```bash
docker compose -f production/compose.yaml config --quiet
docker compose -f production/compose.yaml up --build -d
curl -fsS http://127.0.0.1:8080/health
curl -fsS http://127.0.0.1:8080/
docker compose -f production/compose.yaml down
```

The health response must contain `"status":"ok"`; the root page is a static file served by Nginx. PHP-FPM status and ping paths are not published by this teaching Compose file. The containers use read-only filesystems, bounded FPM workers, a non-root runtime user, OPcache, explicit timeouts, and stdout/stderr logging. Replace the example images, limits, and health policy with reviewed values for the target service.

## Full production-services lab

The override adds Redis, PostgreSQL, a Redis-backed queue worker, and an OpenTelemetry Collector while retaining the base Nginx and FPM services:

~~~bash
docker compose -f production/compose.yaml -f production/compose.full.yaml config --quiet
docker compose -f production/compose.yaml -f production/compose.full.yaml up --build -d
curl -c cookies.txt -b cookies.txt http://127.0.0.1:8080/session
curl -fsS http://127.0.0.1:8080/database
curl -fsS -X POST http://127.0.0.1:8080/queue
curl -fsS http://127.0.0.1:8080/telemetry
docker compose -f production/compose.yaml -f production/compose.full.yaml logs queue-worker otel-collector
docker compose -f production/compose.yaml -f production/compose.full.yaml down
~~~

The credentials are fixed teaching values and must never be copied to a real environment. The Redis data and PostgreSQL cluster use temporary filesystems, so `down` intentionally removes all state. Acceptance requires a Redis-backed visit counter, the PostgreSQL probe row, one processed job, and an exported `lesson.telemetry` span.


## Real local HTTP

In one terminal inside the lab folder:

```bash
php -S 127.0.0.1:8097 http-router.php
```

In a second terminal in the same folder:

```bash
php http-client-lab.php
```

Expect `status=200`, `server_error=500`, `conditional=304`, and `timeout_handled=yes`. Read `http-router.php` for each endpoint and `src/Http.php` for ETag parsing. Stop the PHP server with Ctrl+C. This local development server does not test FPM, HTTPS, or production load. Use the Compose lab above for FPM and Nginx; it still does not establish capacity, TLS, or production reliability.

## Read the implementation

`bootstrap.php` loads functions relative to `__DIR__`, the file’s own directory, so inclusion does not depend on the terminal directory. Read `src/Values.php` for value rules, `schema.sql` for tables and seed data, `src/Inventory.php` for the transaction, and `tests.php` for successful and failing examples.

A fixture is a known, fixed input used to reproduce a test. `fixtures/broken.json` is deliberately malformed: importing it must reject JSON syntax, not silently succeed with empty data. Change a copy of the input, not the expected result, and identify the violated rule.

## What these tests establish

`cache-lab.php` models a race schedule locally; it does not run Redis. `profiling-lab.php` calculates percentiles from fixed data; it does not export traces. JWT tests check claims after verification and do not implement an identity protocol. SQLite success does not establish PostgreSQL/MySQL isolation or deadlock behavior. Complete service-specific exercises in an isolated environment with the actual engine and configuration.
