---
title: 8. PHP CLI, php.ini, and extensions
description: SAPIs, configuration discovery, extensions, and separate development and production policy.
sidebar:
  order: 8
---

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

