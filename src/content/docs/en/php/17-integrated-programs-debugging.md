---
title: 17. Notebook project and practical debugging
description: Complete PHP programs connecting types, functions, files, requests, and exceptions, with output-prediction and debugging exercises.
sidebar:
  order: 17
---

## The problem: individual pieces work, but does the request work?

A function may be correct while a form sends an array instead of text, storage fails, or early output breaks a redirect. We will connect forms, validation, sessions, files, and routing in a **local learning notebook**. Each browser session owns its notebook; there is no login or database. For accounts and larger shared storage, continue to [security](/en/auth/) and [databases](/en/database/) instead of inventing them here.

Complete files live in `examples/php-course/notebook` or the [course examples package](/downloads/php-course.zip). You need PHP 8.1+, mbstring, and writable session storage. Study in three sittings: request/validation, storage/presentation, then tests/debugging.

## The stages we have built

| Stage | Learned | Practical evidence |
|---|---|---|
| Lessons 5–7 | Conditions, functions, callbacks | Reject or continue, then invoke a handler |
| Lesson 8 | Files, JSON, I/O failure | Verify written bytes and decoded shape |
| Lesson 9 | Form→Validation→Session | preferences.php remembers names and checks CSRF |
| Lesson 10 | Composer and quality tools | composer-demo has a lock and real tests |
| Lessons 13–15 | Unicode, time, request flow | UTF-8, UTC, router, and emitter |
| Here | Connect boundaries | Save a note, then display it through GET |

Do not paste unrelated fragments together. Create this tree and write each complete file:

~~~text
notebook/
  config.php
  public/index.php
  src/notebook.php
  views/notebook.php
  storage/              (created on first save)
~~~

## 1. Explicit configuration

`config.php` reads deployment configuration, never a request field:

~~~php
<?php
$environment = getenv('APP_ENV') ?: 'development';
if (!in_array($environment, ['development', 'production'], true)) {
    throw new RuntimeException('Invalid APP_ENV');
}
return [
    'secure_cookie' => $environment === 'production',
    'storage' => getenv('NOTEBOOK_STORAGE') ?: __DIR__ . '/storage',
];
~~~

Local HTTP uses a non-Secure cookie. Production enables Secure and requires actual HTTPS. NOTEBOOK_STORAGE is a trusted test/deployment storage path; the default is outside public. Unknown environments fail instead of choosing an accidental policy. Server/php.ini body limits complement the application limit; production errors are logged, not displayed.

## 2. Validation, storage, presentation: src/notebook.php

~~~php
<?php
declare(strict_types=1);

function validateNote(array $input): array
{
    $data = [];
    $errors = [];
    foreach (['name' => 40, 'text' => 200] as $field => $limit) {
        $value = $input[$field] ?? null;
        if (!is_string($value) || strlen($value) > $limit * 4
            || !mb_check_encoding($value, 'UTF-8')) {
            $errors[$field] = 'Use valid UTF-8 text';
            $data[$field] = '';
            continue;
        }
        $value = trim($value);
        $data[$field] = $value;
        if ($value === '' || mb_strlen($value, 'UTF-8') > $limit) {
            $errors[$field] = "Use 1 to {$limit} code points";
        }
    }
    return ['data' => $data, 'errors' => $errors];
}
function ownerDirectory(string $root, string $owner): string
{
    if (preg_match('/\A[a-f0-9]{32}\z/', $owner) !== 1) {
        throw new RuntimeException('Invalid storage identifier');
    }
    return $root . '/' . $owner;
}
function readNotes(string $root, string $owner): array
{
    $directory = ownerDirectory($root, $owner);
    if (file_exists($root) && (!is_dir($root) || !is_readable($root))) {
        throw new RuntimeException('Storage unavailable');
    }
    if (!is_dir($directory)) {
        return [];
    }
    $paths = glob($directory . '/*.json');
    if ($paths === false || count($paths) > 100) {
        throw new RuntimeException('Cannot list notes');
    }
    $notes = [];
    foreach ($paths as $path) {
        $raw = file_get_contents($path, false, null, 0, 8193);
        if ($raw === false || strlen($raw) > 8192) {
            throw new RuntimeException('Cannot read note');
        }
        $note = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
        if (!is_array($note)
            || !is_string($note['name'] ?? null)
            || !is_string($note['text'] ?? null)
            || !is_string($note['created_at'] ?? null)
            || !is_string($note['id'] ?? null)) {
            throw new RuntimeException('Invalid stored note');
        }
        $notes[] = $note;
    }
    usort($notes, static fn (array $a, array $b): int =>
        [$a['created_at'], $a['id']] <=> [$b['created_at'], $b['id']]);
    return $notes;
}
function saveNote(string $root, string $owner, array $data, DateTimeImmutable $now): void
{
    $directory = ownerDirectory($root, $owner);
    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Cannot create storage');
    }
    $id = bin2hex(random_bytes(16));
    $note = [
        'id' => $id,
        'name' => $data['name'],
        'text' => $data['text'],
        'created_at' => $now->setTimezone(new DateTimeZone('UTC'))->format(DateTimeInterface::ATOM),
    ];
    $json = json_encode($note, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    $temporary = tempnam($directory, '.pending-');
    if ($temporary === false) {
        throw new RuntimeException('Cannot create temporary file');
    }
    if (realpath(dirname($temporary)) !== realpath($directory)) {
        unlink($temporary);
        throw new RuntimeException('Temporary file outside storage');
    }
    try {
        if (file_put_contents($temporary, $json) !== strlen($json)) {
            throw new RuntimeException('Cannot write complete note');
        }
        if (!rename($temporary, $directory . '/' . $id . '.json')) {
            throw new RuntimeException('Cannot publish note');
        }
    } finally {
        if (is_file($temporary)) {
            unlink($temporary);
        }
    }
}
function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function renderNotes(array $notes, array $errors, array $old, string $csrf, string $flash): string
{
    ob_start();
    try {
        require dirname(__DIR__) . '/views/notebook.php';
        return (string) ob_get_contents();
    } finally {
        ob_end_clean();
    }
}
~~~

### Read one function at a time

`validateNote` returns cleaned values and errors. Check is_string before strlen and mb_check_encoding so `name[]=x` cannot crash it. Byte limits precede Unicode processing, followed by trim and code-point bounds. Continue skips remaining checks for rejected values. The string `'0'` is valid; empty would incorrectly reject it.

`ownerDirectory` accepts only a generated 32-character hex identifier. The browser never chooses a filename; owner comes from server-side session state. This isolates session notebooks, not recoverable user accounts.

`readNotes` treats a not-yet-created directory as an empty notebook. Glob selects published json files only. Reads are bounded and JSON failures are explicit. Corrupt storage must not silently become “no notes,” hiding data loss. Validate shape and sort by timestamp then id; random IDs do not express creation order within one second.

`saveNote` creates private storage and an ID, converting the injected now to UTC. Tempnam creates a temporary file; verify all bytes were written, then rename to the final json name on the same filesystem. Readers ignore pending files. Verify rename guarantees on the deployment platform; this example promises no power-loss durability. Finally cleans up the temporary file on failure.

`renderNotes` buffers template output into a string rather than sending it immediately; finally cleans the buffer even when rendering fails. `escapeHtml` encodes at presentation, not storage.

## 3. The template: views/notebook.php

~~~php
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>My learning notebook</title>
<h1>My learning notebook</h1>
<p>This browser session owns this notebook. This demo has no login.</p>
<p role="status"><?= escapeHtml($flash) ?></p>
<?php foreach ($errors as $field => $message): ?>
  <p role="alert"><?= escapeHtml($field . ': ' . $message) ?></p>
<?php endforeach; ?>
<form method="post" action="/notes">
  <input type="hidden" name="csrf" value="<?= escapeHtml($csrf) ?>">
  <p><label>Name <input name="name" required value="<?= escapeHtml($old['name'] ?? '') ?>"></label></p>
  <p><label>Note <textarea name="text" required><?= escapeHtml($old['text'] ?? '') ?></textarea></label></p>
  <button>Save note</button>
</form>
<h2>Saved notes</h2>
<?php if ($notes === []): ?><p>No notes yet.</p><?php endif; ?>
<ol>
<?php foreach ($notes as $note): ?>
  <li><strong><?= escapeHtml($note['name']) ?></strong>:
    <span class="note-text"><?= escapeHtml($note['text']) ?></span>
    <time datetime="<?= escapeHtml($note['created_at']) ?>"><?= escapeHtml($note['created_at']) ?></time>
  </li>
<?php endforeach; ?>
</ol>
</html>
~~~

The hidden csrf field comes from the session, but users can change hidden fields; protection comes from server comparison, not visual hiding. Errors appear beside the form, and valid input is retained after 422. Every name, note, and time passes through escapeHtml even when loaded from our own files. Trusted storage does not turn text into allowed HTML. Enter `<b>hello</b>` and it should appear literally, not bold.

The English UI deliberately keeps the example identical in both lesson languages; names and notes accept Arabic/UTF-8. Translating UI strings does not change the lesson's logic.

## 4. Entry point, middleware, and router

`public/index.php` is the single entry point for every route:

~~~php
<?php
declare(strict_types=1);
require dirname(__DIR__) . '/src/notebook.php';

function reply(string $body, int $status = 200, array $headers = []): array
{
    return ['status' => $status, 'headers' => $headers, 'body' => $body];
}
function routeNotebook(string $method, string $path, array $config): array
{
    $routes = ['/' => 'GET', '/notes' => 'POST'];
    if (!isset($routes[$path])) {
        return reply('Not found', 404);
    }
    if ($routes[$path] !== $method) {
        return reply('Method not allowed', 405, ['Allow' => $routes[$path]]);
    }
    $owner = $_SESSION['owner'];
    $csrf = $_SESSION['csrf'];
    if ($method === 'POST') {
        $type = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
        if ($type !== 'application/x-www-form-urlencoded') {
            return reply('Unsupported media type', 415);
        }
        $token = $_POST['csrf'] ?? null;
        if (!is_string($token) || !hash_equals($csrf, $token)) {
            return reply('Invalid form token', 403);
        }
        $result = validateNote($_POST);
        $notes = readNotes($config['storage'], $owner);
        if ($result['errors'] !== []) {
            return reply(renderNotes($notes, $result['errors'], $result['data'], $csrf, ''), 422);
        }
        if (count($notes) >= 100) {
            return reply('Notebook is full', 409);
        }
        saveNote($config['storage'], $owner, $result['data'], new DateTimeImmutable('now', new DateTimeZone('UTC')));
        $_SESSION['name'] = $result['data']['name'];
        $_SESSION['flash'] = 'Note saved';
        return reply('', 303, ['Location' => '/']);
    }
    $flash = $_SESSION['flash'] ?? '';
    unset($_SESSION['flash']);
    return reply(renderNotes(
        readNotes($config['storage'], $owner),
        [],
        ['name' => $_SESSION['name'] ?? '', 'text' => ''],
        $csrf,
        $flash,
    ));
}
function sessionMiddleware(callable $next, array $config): array
{
    $raw = file_get_contents('php://input', false, null, 0, 4097);
    if ($raw === false) {
        throw new RuntimeException('Cannot read body');
    }
    if (strlen($raw) > 4096 || (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 4096) {
        return reply('Body too large', 413);
    }
    if (!session_start([
        'use_strict_mode' => true,
        'use_only_cookies' => true,
        'cookie_secure' => $config['secure_cookie'],
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
        'cookie_path' => '/',
    ])) {
        throw new RuntimeException('Session unavailable');
    }
    try {
        $_SESSION['owner'] ??= bin2hex(random_bytes(16));
        $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
        return $next();
    } finally {
        session_write_close();
    }
}

ini_set('display_errors', '0');
ini_set('log_errors', '1');
$requestId = bin2hex(random_bytes(8));
try {
    $config = require dirname(__DIR__) . '/config.php';
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $response = sessionMiddleware(
        static fn (): array => routeNotebook($method, is_string($path) ? $path : '', $config),
        $config,
    );
} catch (Throwable $error) {
    error_log(json_encode(['request_id' => $requestId, 'type' => get_class($error)], JSON_THROW_ON_ERROR));
    $response = reply('Internal error. Reference: ' . $requestId, 500);
}
http_response_code($response['status']);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Request-ID: ' . $requestId);
foreach ($response['headers'] as $name => $value) {
    header("{$name}: {$value}");
}
echo $response['body'];
~~~

### Trace a save through each decision

Read configuration and method/path. Session middleware bounds the body and opens the session. Owner is a random session-stable value; csrf is another random value. Owner never appears in the form. Calling next reaches the router: path, method, media type, token, then validateNote. **No file is written until those checks succeed.**

Rejected input returns 422 with the form. A notebook containing 100 notes returns 409. On success, read the list, save, store name/flash, and return 303. Finally closes the session before emission. With PHP's default file session handler, the lock spans count then save; concurrent same-session requests cannot bypass the limit by reading the same count. A different handler needs equivalent locking.

The browser follows Location with GET /. The handler reads then removes flash, making Note saved appear once. Reading never saves again. One emitter sends status, headers, then body. Unexpected errors receive 500 and a log reference; logs contain neither note text nor cookies.

303 does not prevent deliberate repeated POSTs or every double-click scenario; another POST can create another note here. Idempotency keys are a separate extension when needed. Session expiry loses the browser-to-notebook association; old-file cleanup and account recovery are outside this exercise and documented in README.

## Run and verify

From the notebook directory, run `php tests.php` first. Expect `PASS: 15 notebook checks` for validation, persistence, isolation, UTC, and output encoding. Then start the server:

~~~bash
php -S 127.0.0.1:8083 -t public public/index.php
~~~

Open the [local notebook](http://127.0.0.1:8083/). Submit Omar and Learn PHP. Expect POST 303 followed by GET 200, Note saved, and a stored note. Refresh again: the message disappears while the note remains. A private window starts empty. Restarting the server preserves files; access also requires the same cookie and a still-valid session store.

| Experiment | Required result |
|---|---|
| Empty name or name[] | 422, no new file |
| Arabic and emoji | Correct storage and display |
| HTML in note text | Displayed literally, never executed |
| Missing/wrong CSRF | 403, no save |
| GET /notes | 405 with Allow: POST |
| /missing | 404 |
| JSON instead of form-urlencoded | 415 |
| Body over 4096 bytes | 413 |
| Corrupt stored JSON | 500 with reference, never a false empty notebook |
| GET /storage/... | 404; only public is exposed |

Test corrupt files in separate test storage using NOTEBOOK_STORAGE, not your real notes. The repository's automated checks exercise sessions, isolation, CSRF, UTF-8, encoding, storage, and failure paths.

## Debugging: collect evidence before changing code

1. Capture a small request reproducing the defect and record expected versus actual.
2. Locate the boundary: parsing, validation, storage, or presentation.
3. Inspect a value and type there without printing into the response.
4. Test one hypothesis and change one cause.
5. Add a regression test that fails before the fix and passes afterward.

A **breakpoint** pauses execution before a selected line. Xdebug is a PHP extension; the IDE is a client displaying variables and the call stack. Install a binary matching PHP's version/build using the [official installation guide](https://xdebug.org/docs/install), then verify with `php --ri xdebug`. Local configuration, with zend_extension pointing to your actual binary:

~~~ini
xdebug.mode=debug
xdebug.start_with_request=trigger
xdebug.client_host=127.0.0.1
xdebug.client_port=9003
~~~

Start the IDE listener and configure path mappings if PHP runs in a container. Set a breakpoint on `$result = validateNote($_POST);` and submit with XDEBUG_TRIGGER via a browser helper/cookie. **Step Into** enters a function, **Step Over** executes the line, and **Step Out** returns to its caller. Watch `$_POST['name']`, errors, and the stack: index→middleware→route→validateNote.

For PowerShell CLI, set `$env:XDEBUG_TRIGGER='1'`, run the script, then `Remove-Item Env:XDEBUG_TRIGGER`. If no pause occurs, check PHP binary, ini, listener, trigger, and mapping. CLI loading Xdebug does not mean FPM loads it. See [step debugging](https://xdebug.org/docs/step_debug). Production should use protected logs, request IDs, and display_errors=Off rather than a publicly enabled debugger. Lesson 11 explains configuration. Log sanitized fields, never the entire session.

## Use the tools on a real project

Return to lesson 10's composer-demo: `composer install`, `composer check`, then `composer audit`. PHPUnit checks results, PHPStan checks contracts, and PHP-CS-Fixer checks formatting. The lock pins versions; do not delete it to fix a failing test. Deploy using install from the lock and check-platform-reqs against the target platform, with separate development/production PHP settings.

## Further practice: the earlier complete programs remain available

The [original PHP lab](/en/php/00-lab-setup/) includes complete `total.php`, `orders.php`, and `stream-lab.php` programs:

- `php total.php 12.50 3.25` → `15.75`. Amounts are converted to integer minor units as text: enforce `\A`/`\z`, pad the fraction to two digits, compare digit length and lexicographic order against PHP_INT_MAX **before conversion**. Addition checks `left <= PHP_INT_MAX - right`. Test 0, 12, 12.5, 12.50; reject -1, 1.234, trailing newlines, and oversized amounts. `php tests.php values` checks these boundaries.
- `php orders.php fixtures/orders.json` → `orders=2`, `items=3`, `total_minor=2999` for 1250×2 and 499×1. Broken JSON returns `ERROR invalid JSON` and exit code 2. Separate reading, validation, calculation, and output; test zero quantity, negative price, and overflow.
- `php stream-lab.php fixtures/large.csv` processes sequentially. Test empty/missing files and long lines. Generators or SplFileObject cannot make an unbounded single line safe. Observe count and memory; distinguish read failure from empty input.

Lesson 15's http-demo contains the complete JSON endpoint and 400/422/415/413 distinctions. Each program needs a README, fixtures, and checks; running from a clean copy reveals forgotten local dependencies.

## Predict, debug, complete

<details><summary>Predict a successful save followed by two refreshes</summary><p>POST saves once and returns 303. The first GET shows and removes flash; the next displays the note without flash or another save. Repeating POST itself is different and may add a note.</p></details>

<details><summary>Debug name[]=Omar causing TypeError</summary><p>An array reached a string function before validation. Check is_string in validateNote before trim/mb_strlen, then assert 422 and an unchanged file count.</p></details>

<details><summary>Complete a stored-XSS regression test</summary><p>Save text such as &lt;img src=x onerror=alert(1)&gt;, then inspect the actual response: encoded text appears in note-text and no corresponding img element is created. Testing escapeHtml alone misses integration failures.</p></details>

<details><summary>Corrupt JSON produces an empty notebook and success. What is wrong?</summary><p>The failure was swallowed. Throw on decode/shape failure, log a reference, and return 500 without sensitive details. Do not change expectations to accommodate data loss.</p></details>

<details><summary>Money totals work normally but fail at the integer limit. First step?</summary><p>Capture boundary and overflow cases in tests; check before multiplication/addition. Overflow may already convert a result to float by the time you inspect it.</p></details>

Completing this lesson means tracing one request from form through storage and response, proving a rejected request has no effect, and explaining each HTTP result.
