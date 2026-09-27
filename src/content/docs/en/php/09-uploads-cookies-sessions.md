---
title: 9. Uploads, cookies, and sessions
description: Secure file uploads, cookie options, CSRF, session lifecycle, and session security.
sidebar:
  order: 9
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Session:** Temporary server-side state used to recognize a user across requests.
- **Cookie:** A small value stored by the browser and sent with matching requests.


## Three related but different mechanisms

- An **upload** moves bytes from a user device to the server.
- A **cookie** is a small browser-stored value sent with matching requests.
- A **session** stores user state, commonly on the server while the browser holds only an identifier.

For uploads, a browser-provided filename or content type is not proof. Validate the upload error, size, and server-detected MIME; generate a new name; store outside the public root when possible; and never execute uploaded content.

```text
Browser selects file → temporary upload → validation
                     → generated safe name → private storage
```

A session cookie is like a random ticket. If an attacker steals it, they may act as the user. HTTPS, `Secure`, `HttpOnly`, `SameSite`, identifier regeneration, expiration, and server-side invalidation are core lifecycle controls rather than decorative flags.

## Secure file uploads

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

## Progressive practice

<details><summary>1. Is <code>avatar.php.jpg</code> safe because of its extension?</summary><p>No. Check upload status, size, and server-detected MIME; generate a name; keep it outside the public root; and never execute it.</p></details>

<details><summary>2. What does HttpOnly prevent, and what does it not fix?</summary><p>It blocks JavaScript from reading the cookie, reducing direct theft through XSS. It does not stop browser sending or repair the XSS vulnerability.</p></details>

<details><summary>3. Describe a complete logout</summary><p>Load the session, clear its state, expire the cookie with matching attributes, destroy server-side state, and revoke central/session records when applicable.</p></details>

## Lesson-specific problems

<details><summary>Why distrust the uploaded name and browser MIME type?</summary><p>Both are user-controlled; generate a safe name and validate content and size outside executable paths.</p></details>

<details><summary>When should a session ID change?</summary><p>After login or privilege change to prevent fixation, while invalidating the old session correctly.</p></details>

## Run and verify

The local test covers CSRF tokens and origin policy only. Upload behavior requires multipart requests through a web server: exercise the preceding example with accepted/rejected files, then inspect storage and session regeneration after login.

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php tests.php security
~~~

**Extended integration exercise target:** Disallowed name, size, or MIME is rejected; accepted content moves under a generated name outside web root, and login regenerates the session identifier.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Check UPLOAD_ERR, size, and content-derived MIME; generate a new name, store outside web root, and scan or process by type. Cookies need Secure, HttpOnly, SameSite, and lifetime policy. Regenerate the session ID after login and protect state changes from CSRF; never trust extension or client name.

### Try it yourself

Test a double-extension file, spoofed MIME, and session identity before/after login.
