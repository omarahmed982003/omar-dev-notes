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
