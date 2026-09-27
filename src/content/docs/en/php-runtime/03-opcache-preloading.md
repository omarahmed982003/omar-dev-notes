---
title: 3. OPcache and preloading
description: PHP bytecode caching, OPcache configuration and monitoring, data-cache differences, and preloading limits.
sidebar:
  order: 3
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **API:** A defined interface through which one program requests data or actions from another.
- **Cache:** A temporary copy that reduces waiting and repeated work.
- **CLI:** A text-based interface controlled by typed commands.


- **Composer:** PHP dependency manager that installs libraries and prepares autoloading.
- **OPcache:** Memory that keeps compiled PHP instructions for later requests.
- **Redis:** A fast in-memory store used for caches, sessions, and queues.

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

## Operational problem

<details><summary>Does OPcache cache request results?</summary><p>No. It caches compiled bytecode; an application data cache stores computed or retrieved data.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php -d opcache.enable_cli=1 -r "var_export(opcache_get_status(false) !== false);"
~~~

**Success criterion:** The output is <code>true</code>. Then compare hits and misses before and after repeat load; enabling OPcache alone is not proof of improvement.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Measure memory consumption, interned strings, hit/miss, and wasted percentage instead of copying a size. Invalidation and timestamp policy must match atomic deployment. JIT does not speed every workload and is separate from the core OPcache benefit. Preloading persists for process lifetime and needs restart.

### Try it yourself

Collect metrics before and after repeated load and explain eviction or restart behavior.
