---
title: 9. Uploads, cookies, and sessions
description: Secure file uploads, cookie options, CSRF, session lifecycle, and session security.
sidebar:
  order: 9
---

File-upload forms use POST and `enctype="multipart/form-data"`. PHP exposes metadata in `$_FILES` and initially stores data in `upload_tmp_dir`.

```php
$file = $_FILES['avatar'] ?? null;
if (!is_array($file) || $file['error'] !== UPLOAD_ERR_OK) {
    throw new RuntimeException('Upload failed');
}
if ($file['size'] > 2 * 1024 * 1024) {
    throw new RuntimeException('Maximum size is 2MB');
}

$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png'];
if (!isset($extensions[$mime])) {
    throw new RuntimeException('Unsupported type');
}

$name = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
if (!move_uploaded_file($file['tmp_name'], __DIR__ . '/../storage/uploads/' . $name)) {
    throw new RuntimeException('Could not store upload');
}
```

Check `UPLOAD_ERR_*`, size, and server-detected MIME; generate the filename, store outside the public root where possible, and never execute an upload.

```php
setcookie('theme', 'dark', [
    'expires' => time() + 2592000,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax',
]);
```

`Secure` requires HTTPS; `HttpOnly` blocks JavaScript access; `SameSite` controls cross-site sending. `SameSite=None` requires `Secure`. These controls do not replace CSRF tokens for sensitive actions.

Session data normally lives server-side while the browser holds an identifier cookie.

```php
session_start([
    'use_strict_mode' => true,
    'cookie_httponly' => true,
    'cookie_secure' => true,
    'cookie_samesite' => 'Lax',
]);

session_regenerate_id();
$_SESSION['user_id'] = $user->id;
```

Regenerate after authentication/privilege changes, before setting the elevated authentication state. Immediately deleting old session data with `session_regenerate_id(true)` can lose sessions or race with concurrent requests; security-sensitive systems should use a documented timestamp-based transition.

For logout, clear `$_SESSION`, expire the session cookie using its existing parameters, then call `session_destroy()`. The latter does not itself clear the in-memory array or client cookie. Close locks early with `session_write_close()`; use `read_and_close` for read-only access. Implement custom storage with `SessionHandlerInterface` or `session_set_save_handler()`.

Continue with [Session security](/en/auth/01-session-security/) for fixation, hijacking, and lifecycle defenses.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Uploads, cookies, and sessions">
<p class="lesson-diagram-title">Concept map: Uploads, cookies, and sessions</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>File-upload forms use POST and enctype=&quot;multipart/form-data&quot;</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Check UPLOAD_ERR_*, size, and server-detected MIME; generate the</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Secure requires HTTPS; HttpOnly blocks JavaScript access; SameSite</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Session data normally lives server-side while the browser</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Regenerate after authentication/privilege changes, before setting the el…</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “File-upload forms use POST and enctype=&quot;multipart/form-data&quot;” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> File-upload forms use POST and enctype=&quot;multipart/form-data&quot;. PHP exposes metadata in $_FILES and initially stores data in upload_tmp_dir. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “File-upload forms use POST and enctype=&quot;multipart/form-data&quot;” with “Check UPLOAD_ERR_*, size, and server-detected MIME; generate the”. Why does neither replace the other in “Uploads, cookies, and sessions”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “File-upload forms use POST and enctype=&quot;multipart/form-data&quot;”: File-upload forms use POST and enctype=&quot;multipart/form-data&quot;. PHP exposes metadata in $_FILES and initially stores data in upload_tmp_dir. For “Check UPLOAD_ERR_*, size, and server-detected MIME; generate the”: Check UPLOAD_ERR_*, size, and server-detected MIME; generate the filename, store outside the public root where possible, and never execute an upload. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Secure requires HTTPS; HttpOnly blocks JavaScript access; SameSite”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Secure requires HTTPS; HttpOnly blocks JavaScript access; SameSite controls cross-site sending. SameSite=None requires Secure. These controls do not replace CSRF tokens for sensitive actions. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Session data normally lives server-side while the browser” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Session data normally lives server-side while the browser holds an identifier cookie. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
