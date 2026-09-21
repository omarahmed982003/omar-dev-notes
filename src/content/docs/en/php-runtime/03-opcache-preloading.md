---
title: 3. OPcache and preloading
description: PHP bytecode caching, OPcache configuration and monitoring, data-cache differences, and preloading limits.
sidebar:
  order: 3
---

# Avoid repeated parsing and compilation

PHP normally parses source and compiles it to opcodes before execution. OPcache keeps compiled bytecode in shared memory so later requests can skip much of that work.

```text
PHP source -> parse -> compile to opcodes -> execute
                       |
                       +-> OPcache shared memory
```

OPcache does not cache final HTML, SQL results, or API responses. Those belong to HTTP or application caches such as Redis.

## Production baseline

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
```

Treat the numbers as a starting point, not universal truth.

- Timestamp validation detects changed scripts according to `revalidate_freq`.
- With validation disabled, restart or gracefully reload FPM on every release.
- CLI OPcache is configured separately through `opcache.enable_cli` and may not help short commands.

## Observe before tuning

```php
$status = opcache_get_status(false);
if ($status !== false) {
    printf(
        "hit-rate=%.2f%% used=%d free=%d\n",
        $status['opcache_statistics']['opcache_hit_rate'],
        $status['memory_usage']['used_memory'],
        $status['memory_usage']['free_memory'],
    );
}
```

Keep status data behind internal authorization because it can expose file paths. Watch `cache_full`, OOM/hash restarts, hit rate after warm-up, and the number of cached keys.

## Preloading

PHP 7.4+ can execute a preload file once at server startup and keep loaded functions, classes, interfaces, and traits available:

```ini
opcache.preload=/var/www/app/config/preload.php
opcache.preload_user=www-data
```

```php
foreach ([
    __DIR__ . '/../src/Domain/Money.php',
    __DIR__ . '/../src/Domain/Order.php',
] as $file) {
    opcache_compile_file($file);
}
```

Preloading increases baseline memory, needs a process restart for code changes, and is useful only for persistent processes. Measure it rather than preloading everything. The PHP manual also notes that preloading is not supported on Windows.

## Deployment sequence

Install exact Composer dependencies, optimize the autoloader, test a separate release directory, switch releases atomically, then gracefully reload FPM. Composer's class map speeds file discovery; OPcache caches compiled bytecode. They optimize different stages.
