---
title: 8. Files, streams, JSON, and CSV
description: Stream wrappers and contexts, open modes, permissions, JSON, serialization, and CSV.
sidebar:
  order: 8
---

## The problem: variables disappear when the program stops

Memory is temporary. To keep a note across runs, write it to a file. A file stores bytes; the program opens it, reads or writes, then closes it. A **stream** is an interface for moving data, like a window through which you read one piece at a time. A **handle** returned by `fopen` identifies the opened resource; it is not the file contents.

A **cursor** is the current read/write position, a **chunk** is a bounded piece of bytes, and a **buffer** temporarily collects data. These distinctions help avoid loading an entire large file just to count its lines. Examples need PHP 8.0+. `finally` performs cleanup after an attempt even if it fails; lesson 11 explains it further.

## First complete experiment without persistent files

Save `stream.php` and run `php stream.php`. `php://temp` begins in memory and may spill into a temporary file after its memory threshold:

~~~php
<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Cannot open stream');
}
try {
    $text = "Ali\nMona\n";
    $offset = 0;
    while ($offset < strlen($text)) {
        $written = fwrite($stream, substr($text, $offset));
        if ($written === false || $written === 0) {
            throw new RuntimeException('Write made no progress');
        }
        $offset += $written;
    }
    echo 'position=', ftell($stream), PHP_EOL;
    if (!rewind($stream)) {
        throw new RuntimeException('Cannot rewind');
    }
    $count = 0;
    while (($line = fgets($stream)) !== false) {
        $count++;
        echo $count, ': ', rtrim($line, "\r\n"), PHP_EOL;
    }
    if (!feof($stream)) {
        throw new RuntimeException('Read failed before EOF');
    }
    echo "count={$count}", PHP_EOL;
} finally {
    fclose($stream);
}
~~~

~~~text
position=9
1: Ali
2: Mona
count=2
~~~

The first line opens a resource; strict comparison detects failure. The text has 9 bytes: 3 for Ali, a newline, 4 for Mona, and a newline. `fwrite` reports bytes written; the offset loop retries **only the remainder** and stops on zero progress. `ftell` shows the cursor at the end. `rewind` moves it back; reading immediately after writing might otherwise find nothing.

`fgets` reads a line and `!== false` distinguishes valid text such as `'0'` from failure. This `rtrim` removes line endings only, preserving intentional spaces. Checking `feof` afterward separates normal end-of-file from a read error. `fclose` in finally releases the resource. Line-by-line memory depends on the longest line; one enormous line can still be expensive. `fread($stream, 8192)` reads bounded chunks instead.

## Choose the opening mode before writing

| Mode | Position and effect |
|---|---|
| `r / r+` | File must exist; read / read and write from the start |
| `w / w+` | Truncate immediately on opening, or create |
| `a / a+` | Create if needed; writes always append |
| `x / x+` | Exclusive creation; fail if already present |
| `c / c+` | Create if needed without truncating; start at the beginning |

`+` enables both reading and writing; `b` avoids platform-specific text translations. **Serious mistake:** opening with `w` before acquiring a lock truncates the file before protection begins. For an existing-data update, use `c+` and lock before reading/modifying. Existence and `is_writable` are preliminary checks; the operation itself may still fail.

## JSON is a representation, not semantic validation

**Serialization** turns data into a storable representation. JSON works for simple values shared across languages. Save `notes-json.php` in a writable practice folder; this example replaces `notes-demo.json` there:

~~~php
<?php
$path = __DIR__ . '/notes-demo.json';
$notes = [['name' => 'Omar', 'text' => 'Learn streams']];
$json = json_encode($notes, JSON_THROW_ON_ERROR);
$bytes = file_put_contents($path, $json, LOCK_EX);
if ($bytes === false || $bytes !== strlen($json)) {
    throw new RuntimeException('Save failed');
}
$raw = file_get_contents($path);
if ($raw === false) {
    throw new RuntimeException('Read failed');
}
$loaded = json_decode($raw, true, flags: JSON_THROW_ON_ERROR);
if (!is_array($loaded) || !is_string($loaded[0]['text'] ?? null)) {
    throw new RuntimeException('Unexpected data shape');
}
echo $loaded[0]['text'], PHP_EOL;
~~~

~~~text
Learn streams
~~~

`__DIR__` anchors the path. `json_encode` converts the array into text; `JSON_THROW_ON_ERROR` prevents silent failure. `file_put_contents` suits small files and returns bytes written. `LOCK_EX` coordinates cooperating writers; it does not protect an entire read→modify→write cycle or a reader that takes no lock.

`json_decode(..., true)` turns JSON objects into arrays, but valid JSON may also be a number or null, so shape validation is separate. PHP 8.3's `json_validate` is useful when syntax validation alone is needed; do not validate and then decode unnecessarily. `JSON_UNESCAPED_UNICODE` changes presentation, not meaning. Never use `unserialize` with untrusted input; `allowed_classes` does not make arbitrary hostile serialized input safe.

## CSV: a comma can belong inside a field

**CSV** is a text table whose comma-containing or quoted fields follow quoting rules. `explode(',')` cannot handle those rules. Save `csv.php`:

~~~php
<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Cannot open CSV');
}
try {
    $expected = ['a,b', 'say "hi"', 'back\\slash', 'عمر'];
    if (fputcsv($stream, $expected, escape: '') === false) {
        throw new RuntimeException('CSV write failed');
    }
    if (!rewind($stream)) {
        throw new RuntimeException('Cannot rewind');
    }
    $actual = fgetcsv($stream, escape: '');
    if ($actual !== $expected) {
        throw new RuntimeException('CSV round-trip failed');
    }
    echo "CSV round-trip OK", PHP_EOL;
} finally {
    fclose($stream);
}
~~~

~~~text
CSV round-trip OK
~~~

The program writes, reads back, and checks exact types and values. Explicit `escape: ''` avoids the default deprecated in 8.4 and uses conventional doubled quotes. `str_getcsv` parses an already-loaded text row. Agree on encoding and delimiter, then validate column count and types. Spreadsheet exports also need a policy for values that an application might interpret as formulas.

## Wrapper, context, and filter solve different problems

A **wrapper** maps an address to a source: `file://` files, `php://memory` memory only, `php://temp` memory then temporary storage, and `php://input` raw HTTP request bodies. Other wrappers include `http://`, `ftp://`, `data://`, and `compress.zlib://` depending on extensions/settings. Custom wrappers can use `stream_wrapper_register`, but beginners do not need to implement one.

A **context** configures an operation, such as a timeout or HTTP headers; it does not make a failed request successful. A **filter** transforms bytes as they pass. Here is complete `filter.php`:

~~~php
<?php
$stream = fopen('php://temp', 'w+b');
if ($stream === false) {
    throw new RuntimeException('Open failed');
}
try {
    if (fwrite($stream, 'hello') !== 5 || !rewind($stream)) {
        throw new RuntimeException('Prepare failed');
    }
    $filter = stream_filter_append($stream, 'string.toupper', STREAM_FILTER_READ);
    if ($filter === false) {
        throw new RuntimeException('Filter failed');
    }
    $text = stream_get_contents($stream);
    if ($text === false) {
        throw new RuntimeException('Read failed');
    }
    echo $text, PHP_EOL;
} finally {
    fclose($stream);
}
~~~

~~~text
HELLO
~~~

The read filter transforms the returned bytes; this ASCII filter is not a Unicode case-conversion tool. An HTTP context could be `stream_context_create(['http' => ['timeout' => 3, 'header' => "Accept: application/json\r\n"]])`, passed to the reading function. Real requests also need status, TLS, and size checks; `ignore_errors` permits reading an error response body, not treating it as success. `allow_url_fopen` controls URL-aware wrappers. Keep `allow_url_include` disabled and do not let arbitrary user URLs access the server's network.

## Storage and permissions

On Unix, read=4, write=2, execute=1 for owner/group/others. `0600` is owner-only, `0644` allows others to read, and `0755` is common for directories. `chmod($path, 0640)` does not replace configuring the service user; Windows uses ACLs. Do not solve permission errors with `0777`.

For appending records, acquire `flock(..., LOCK_EX)`, write all bytes, then `fflush` and release in finally. Cooperating readers take `LOCK_SH`. Replacing a complete file can use a temporary file on the same filesystem followed by rename, checking failures and platform behavior. `fflush` alone does not guarantee power-loss durability. A separate stable lock file is needed when coordinating processes that replace the data file itself.

The application chooses storage paths, not user-supplied names. `realpath` helps for existing paths but returns false for new files; check the parent and directory boundary, including symlink policy. Huge JSON needs a streaming parser, not merely fopen before json_decode.

## Predict, debug, complete

<details><summary>Predict: remove rewind from stream.php</summary><p>The cursor remains at byte 9 after writing, so reading starts at the end and count is zero. Handles do not rewind themselves.</p></details>

<details><summary>Debug: if (!$raw) after file_get_contents</summary><p>This confuses failure with empty text or '0'. Use <code>$raw === false</code>, then separately decide whether empty content is allowed.</p></details>

<details><summary>Complete a condition that stops a non-progressing write loop</summary><p><code>$written === false || $written === 0</code>. Checking only false leaves a possible infinite loop on zero progress.</p></details>

<details><summary>Does LOCK_EX on saving alone prevent two updates based on the same old data?</summary><p>No. Both may read the old state and the second may overwrite the first change. Lock the complete read-modify-write cycle, or use a database transaction as the application grows.</p></details>

Also run `php stream-lab.php fixtures/large.csv` from the [lab](/en/php/00-lab-setup/). Lesson 17 stores each note in its own file in a private directory. Treat empty, missing, and malformed JSON files as distinct cases.

References: [Streams](https://www.php.net/manual/en/book.stream.php), [CSV](https://www.php.net/manual/en/function.fgetcsv.php), [writing](https://www.php.net/manual/en/function.fwrite.php).
