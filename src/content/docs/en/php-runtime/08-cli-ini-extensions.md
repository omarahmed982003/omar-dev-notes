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
composer check-platform-reqs
```

## Environment policy

Development can show detailed errors and load Xdebug. Production should hide errors, log them safely, enable OPcache, set resource limits, and remove unnecessary extensions. The distributed development/production ini files are starting points, not complete application policy.

## CLI programs

Use meaningful exit codes, timeouts, logging, signal handling for workers, and a lock when duplicate execution is unsafe. `set_time_limit(0)` does not stop the operating system or orchestrator from terminating a process.

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

### Try it yourself

Prove CLI and FPM load the intended version, ini file, and extension.
