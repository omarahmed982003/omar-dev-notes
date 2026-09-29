---
title: 8. PHP CLI, php.ini, and extensions
description: SAPIs, configuration discovery, extensions, and separate development and production policy.
sidebar:
  order: 8
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **HTTP:** The rules used to exchange requests and responses on the web.
- **CLI:** A text-based interface controlled by typed commands.


## The SAPI changes the environment

PHP may run through CLI, FPM/FastCGI, or an Apache module. The same code can load different `php.ini` files, extensions, users, and environment values.

```bash
php -v
php --ini
php -m
php -i
php -r "echo PHP_SAPI, PHP_EOL;"
```

When code works in a terminal but not through HTTP, compare the executable, SAPI, loaded configuration, process user, and environment.

## Configuration and extensions

`php --ini` shows the main file and scanned `conf.d` directory. Later files may override earlier values.

```php
printf(
    "sapi=%s ini=%s memory=%s\n",
    PHP_SAPI,
    php_ini_loaded_file() ?: 'none',
    ini_get('memory_limit'),
);
```

Some directives cannot change at runtime. Declare extension requirements in Composer and run:

```bash
php --ri opcache
php --ri pdo_mysql
composer check-platform-reqs --lock --no-dev
```

## Environment policy

Development can show detailed errors and load Xdebug. Production should hide errors, log them safely, enable OPcache, set resource limits, and remove unnecessary extensions. The distributed development/production ini files are starting points, not complete application policy.

## CLI programs

```php
#!/usr/bin/env php
<?php
declare(strict_types=1);

set_time_limit(0);
$options = getopt('', ['dry-run', 'limit:']);
```

Use meaningful exit codes, timeouts, logging, signal handling for workers, and a lock when duplicate execution is unsafe. `set_time_limit(0)` does not stop the operating system or orchestrator from terminating a process.

## PHP lifecycle and upgrades

Saying an application supports PHP 8.x is insufficient. Record the minimum and maximum tested minor versions, support deadlines, and extension versions. Before upgrading:

1. Read the migration guide, backward-incompatible changes, and deprecations.
2. Run tests and static analysis on both versions in CI.
3. Build a new image with every extension instead of replacing only the binary.
4. Watch startup warnings, OPcache, and FPM errors in a canary.
5. Keep a rollback path compatible with schema and queue payloads.

Treat `E_DEPRECATED` as early CI work rather than output for users. `display_errors=Off` and `error_reporting=E_ALL` can coexist: record complete errors without exposing them in a response.

## Startup failures and extension ABI

Check startup errors before declaring the service healthy. An extension compiled for another PHP ABI or thread-safety mode can fail before application code runs. Pin its source and version in the image, then run:

~~~bash
php -v
php --ini
php -m
php --ri opcache
composer check-platform-reqs --lock --no-dev
~~~

Compare CLI and FPM through a protected internal endpoint and deliberately test a missing extension and startup failure. Never expose `phpinfo()` publicly; it reveals paths, configuration, and environment data.

## Operational problem

<details><summary>Why can CLI and Web PHP behave differently?</summary><p>They may use different SAPIs, ini files, extensions, and users; inspect each environment directly.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php --ini
~~~

**Success criterion:** Identify the CLI configuration file, then run <code>php -m</code> and confirm the required extension exists in that same execution environment.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

INI modes determine whether a setting changes in php.ini, per-directory configuration, or runtime. Compare <code>php --ini</code> with FPM configuration to avoid editing CLI only. A PECL extension must match PHP ABI, thread-safety mode, and platform; inspect startup errors after upgrades.

#### Practice cycle

Write your prediction before running the example and record the output. Introduce one controlled failure, collect evidence from logs or metrics, repair the cause, and rerun the check to prove the fix handles the fault instead of hiding it.


### Try it yourself

Prove CLI and FPM load the intended version, ini file, and extension.
