---
title: 8. Files, streams, JSON, and CSV
description: Stream wrappers and contexts, open modes, permissions, JSON, serialization, and CSV.
sidebar:
  order: 8
---

A stream is a common interface for flowing data from or to files, memory, networks, URLs, and processes.

- A **wrapper** selects a protocol such as `file://`, `http://`, `ftp://`, `php://`, `data://`, or `zlib://`.
- A **context** supplies options such as timeouts and headers.
- A **filter** transforms data while it is read or written.

```php
$context = stream_context_create([
    'http' => ['timeout' => 3, 'header' => "Accept: application/json\r\n"],
]);
$body = file_get_contents('https://example.com/api', false, $context);
```

Do not enable `allow_url_include`. For production HTTP, use a client that handles TLS, status codes, and retries.

```php
$handle = fopen(__DIR__ . '/data.txt', 'rb');
if ($handle === false) {
    throw new RuntimeException('Cannot open file');
}
try {
    while (($line = fgets($handle)) !== false) {
        echo rtrim($line), PHP_EOL;
    }
} finally {
    fclose($handle);
}
```

Modes: `r/r+` require an existing file; `w/w+` truncate or create; `a/a+` append or create; `x/x+` exclusively create; `c/c+` create if absent without truncating. Add `b` for binary portability.

Use `fwrite`, `fflush`, `flock`, and `fclose` deliberately. Check return values. On Unix, permissions use read=4, write=2, execute=1: `0644` is owner read/write and others read; `0755` adds execution; `0600` is owner-only read/write. Do not default to `0777`.

```php
$json = json_encode(
    ['name' => 'Omar', 'active' => true],
    JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
);
$data = json_decode($json, true, flags: JSON_THROW_ON_ERROR);
```

`json_validate()` is available from PHP 8.3. Never `unserialize()` untrusted data because object injection may result; use JSON or tightly restrict allowed classes.

Use `fputcsv()`, `fgetcsv()`, and `str_getcsv()` rather than splitting on commas, because CSV quoting may contain commas.
