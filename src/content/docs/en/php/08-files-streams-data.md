---
title: 8. Files, streams, JSON, and CSV
description: Stream wrappers and contexts, open modes, permissions, JSON, serialization, and CSV.
sidebar:
  order: 8
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **TLS:** An encryption layer that protects data while it moves between two parties.
- **API:** A defined interface through which one program requests data or actions from another.
- **Loop:** A structure that repeats instructions according to a condition.


A file is data on storage, not automatically a string in memory. The OS opens a resource, PHP reads or writes bytes, and the resource must be closed. Loading a huge file at once can exhaust memory; line-by-line processing keeps memory roughly bounded.

```php
$path = __DIR__ . '/orders.txt';
$handle = fopen($path, 'rb');

if ($handle === false) {
    throw new RuntimeException("Cannot open {$path}");
}

try {
    while (($line = fgets($handle)) !== false) {
        echo rtrim($line), PHP_EOL;
    }
} finally {
    fclose($handle);
}
```

A stream is a common interface for flowing data from files, memory, networks, URLs, and processes. The handle returned by `fopen()` is not the content itself.

Before writing, decide whether old data should be truncated, appended to, or preserved unless a new file can be created exclusively. Choosing `w` accidentally can erase a file as soon as it opens. Always check operation results; directory permission does not guarantee disk capacity or a complete write.

## Streams, wrappers, contexts, and filters

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

## Progressive practice

<details><summary>1. What happens when an existing file is opened with <code>w</code>?</summary><p>Its content is truncated immediately. Use append, exclusive creation, or another mode that matches the required policy.</p></details>

<details><summary>2. Process a large file without loading it all</summary><p>Open it, call <code>fgets()</code> in a loop, handle read failure, and close the handle in <code>finally</code>.</p></details>

<details><summary>3. Why is <code>explode(',', $line)</code> not a CSV parser?</summary><p>A quoted field can contain commas. Use <code>fgetcsv()</code> or <code>str_getcsv()</code>.</p></details>

## Lesson-specific problems

<details><summary>Why not load a huge file entirely into memory?</summary><p>It may exceed the memory limit; stream or process it in bounded chunks.</p></details>

<details><summary>What should follow a failed <code>json_decode</code>?</summary><p>Inspect the error or use <code>JSON_THROW_ON_ERROR</code>; do not treat silent null as valid data.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php stream-lab.php fixtures/large.csv
~~~

**Success criterion:** The row count matches the fixture and memory remains below budget; missing or unreadable input fails differently from an empty file.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

For safer replacement, write to a temporary file, flush/close, and rename appropriately for the platform; use locking for concurrent writers. Normalize paths and keep them inside an allowed directory to prevent traversal. Large JSON may need streaming, and encoding/CSV dialect is part of the contract.

### Try it yourself

Run two writers concurrently and prove readers never observe a partial file.


## CSV round trip on PHP 8.4+

Specify `escape: ''` explicitly: relying on the default escape parameter is deprecated from PHP 8.4. The empty value uses doubled quotes instead of PHP’s proprietary backslash escape. This complete program writes and reads a comma, quotes, a backslash, and Arabic, then verifies exact equality.

```php
<?php
$handle = fopen('php://temp', 'w+');
if ($handle === false) throw new RuntimeException('Cannot open stream');
try {
    $expected = ['a,b', 'say "hi"', 'back\\slash', 'عمر'];
    if (fputcsv($handle, $expected, escape: '') === false) throw new RuntimeException('Write failed');
    rewind($handle);
    $actual = fgetcsv($handle, escape: '');
    if ($actual !== $expected) throw new RuntimeException('CSV round-trip failed');
    echo "CSV round-trip OK", PHP_EOL;
} finally { fclose($handle); }
```
