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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Files, streams, JSON, and CSV">
<p class="lesson-diagram-title">Concept map: Files, streams, JSON, and CSV</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>A stream is a common interface for flowing</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>A wrapper selects a protocol such as file://,</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Do not enable allow_url_include</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Modes: r/r+ require an existing file; w/w+ truncate</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Use fwrite, fflush, flock, and fclose deliberately</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “A stream is a common interface for flowing” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A stream is a common interface for flowing data from or to files, memory, networks, URLs, and processes. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “A stream is a common interface for flowing” with “A wrapper selects a protocol such as file://,”. Why does neither replace the other in “Files, streams, JSON, and CSV”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “A stream is a common interface for flowing”: A stream is a common interface for flowing data from or to files, memory, networks, URLs, and processes. For “A wrapper selects a protocol such as file://,”: A wrapper selects a protocol such as file://, http://, ftp://, php://, data://, or zlib://. A context supplies options such as timeouts and headers. A filter transforms data while it is read or written. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Do not enable allow_url_include”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Do not enable allow_url_include. For production HTTP, use a client that handles TLS, status codes, and retries. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Modes: r/r+ require an existing file; w/w+ truncate” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Modes: r/r+ require an existing file; w/w+ truncate or create; a/a+ append or create; x/x+ exclusively create; c/c+ create if absent without truncating. Add b for binary portability. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
