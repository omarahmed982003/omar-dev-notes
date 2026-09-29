---
title: 9. Uploads, cookies, and sessions
description: Secure file uploads, cookie options, CSRF, session lifecycle, and session security.
sidebar:
  order: 9
---

## The problem: every request starts again

A browser opens a page and then submits a form, but local variables from the first request do not carry into the second. We need to associate requests. A **cookie** is a small value stored by the browser and sent with matching requests. A **session** stores server-side data associated with a random identifier; normally the browser holds only the identifier. An **upload** transfers file bytes to the server, a separate problem requiring input validation too.

This lesson is not a login system: it explains data transfer and persistent state. Identity and permissions belong in the [security track](/en/auth/). Examples require PHP 8.1+, mbstring, and fileinfo.

## The session lifecycle, step by step

1. The browser sends an initial GET without a session cookie.
2. `session_start` opens state through the session handler. Without an accepted identifier, PHP creates one.
3. The server sends `Set-Cookie` in a **response header**, which the browser stores.
4. The next request sends `Cookie` in a **request header**.
5. `session_start` loads data into `$_SESSION`; the default file handler locks the session while it is in use.
6. `session_write_close` or request shutdown saves changes and releases the lock.

`setcookie` does not change `$_COOKIE` in the current request; that array reflects what already arrived. Start sessions before HTML or echo because session handling may send headers.

## Complete program: a form remembers your name

Create `public/preferences.php`. Run `php -S 127.0.0.1:8081 -t public` and open the [local form](http://127.0.0.1:8081/preferences.php). The teaching server is for local use. Secure is explicitly false for local HTTP; use true for deployed HTTPS through trusted configuration, not a user-controlled header.

**CSRF** means another site causing your browser to submit an unwanted change. Here a **token** is a random value stored in both the session and form, checked before modifying state. It is neither a password nor the session ID.

~~~php
<?php
declare(strict_types=1);

if (!session_start([
    'use_strict_mode' => true,
    'use_only_cookies' => true,
    'cookie_httponly' => true,
    'cookie_secure' => false,
    'cookie_samesite' => 'Lax',
    'cookie_path' => '/',
])) {
    throw new RuntimeException('Session unavailable');
}
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf'] ?? null;
    if (!is_string($token) || !hash_equals($_SESSION['csrf'], $token)) {
        http_response_code(403);
        exit('Invalid form token');
    }
    $name = $_POST['name'] ?? null;
    if (!is_string($name) || !mb_check_encoding($name, 'UTF-8')) {
        $error = 'Name must be UTF-8 text';
    } else {
        $name = trim($name);
        if ($name === '' || mb_strlen($name, 'UTF-8') > 40) {
            $error = 'Use 1 to 40 code points';
        } else {
            $_SESSION['name'] = $name;
            session_write_close();
            header('Location: /preferences.php', true, 303);
            exit;
        }
    }
    http_response_code(422);
}
$name = $_SESSION['name'] ?? 'Guest';
$csrf = $_SESSION['csrf'];
session_write_close();
function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
?>
<!doctype html>
<html lang="en"><meta charset="utf-8"><title>Preferences</title>
<p>Hello <?= escape($name) ?></p>
<p><?= escape($error) ?></p>
<form method="post">
  <input type="hidden" name="csrf" value="<?= escape($csrf) ?>">
  <label>Name <input name="name" maxlength="40" required></label>
  <button>Save</button>
</form>
</html>
~~~

Expect `Hello Guest` on the first visit. Submit Omar: POST returns 303, the browser follows with GET, and `Hello Omar` appears. A private window starts as Guest because it has another session. Submit only spaces: 422 with no name change. Remove the token: 403 before saving.

Read in order: configure/start the session, create a CSRF token once, recognize POST, check type before hash_equals, then validate UTF-8 and length. `maxlength` assists the browser but does not replace server validation; browsers and PHP can count different text units, covered in lesson 13. `303` implements **Post/Redirect/Get**, so refreshing repeats GET, not a general guarantee against duplicate POSTs. Copy needed values before closing the session early. `htmlspecialchars` encodes HTML text and quoted attribute output without changing stored data.

## Cookie flags and their limits

| Setting | Effect |
|---|---|
| Secure | Send over HTTPS; false is used only for the local example |
| HttpOnly | Blocks JavaScript from reading the cookie, not XSS-triggered requests |
| SameSite=Lax | Restricts cross-site sending; does not replace a CSRF token |
| SameSite=None | Requires Secure; use only for a concrete need |
| Path/Domain | Select matching requests; they are not authorization controls |
| expires / cookie_lifetime | Cookie lifetime, not the server-side validity policy by itself |

Users can modify preference cookies such as theme; validate against `['light', 'dark']`. Do not store passwords or raw administrative authority in them. Keep sensitive data in appropriate storage and treat session identifiers themselves as secrets.

## Session fixation: the attacker knows the ticket before login

**Fixation** convinces a victim to use an identifier known to the attacker, which remains valid after login. Theft instead obtains an existing victim's identifier. `use_strict_mode` rejects uninitialized identifiers but cannot solve every fixation scenario involving an existing session.

After credentials have genuinely been verified, rotate the identifier **before** storing the newly authenticated identity. The following is a login-boundary excerpt for an existing authentication system, not a working login system:

~~~php
// After credentials were verified and a session was started:
if (!session_regenerate_id(false)) {
    throw new RuntimeException('Cannot rotate session');
}
$_SESSION['user_id'] = $verifiedUserId;
$_SESSION['authenticated_at'] = time();
~~~

`false` keeps old session data to avoid abruptly breaking concurrent requests, but it is not a complete revocation design. A real system needs obsolete markers/timestamps on old records, a short transition policy that denies new privileges to old identifiers, and server-enforced idle/absolute expiry. Immediate deletion with `true` can suit a serialized demonstration but cause lost sessions and races on unreliable connections. Never display or log identifiers. Follow [session security management](https://www.php.net/manual/en/features.session.security.management.php) and the [session security lesson](/en/auth/01-session-security/).

## Ending a session is more than clearing a variable

In a CSRF-protected POST after session_start, clear `$_SESSION = []`, expire the cookie using the same Path, Domain, and flags, then call `session_destroy`. Destroy alone clears neither the browser cookie nor the local array. `session_unset` clears session variables only. `session_write_close` saves and unlocks; later `$_SESSION` changes are not automatically persisted. `session_start(['read_and_close' => true])` is for reading only, with attention to storage expiry policy.

Redis/database storage needs `SessionHandlerInterface` or `session_set_save_handler` plus explicit locking and expiry policies. Garbage collection is storage cleanup, not the authorization decision for a request.

## Uploading an image into private storage

Create `public/upload.php` in the same folder; it creates `storage/uploads` outside public. **MIME** describes content type; neither browser-supplied type nor filename extension is trustworthy. `multipart/form-data` carries fields and files. This example allows PNG/JPEG up to 2 MiB and requires CSRF:

~~~php
<?php
declare(strict_types=1);
session_start([
    'use_strict_mode' => true,
    'use_only_cookies' => true,
    'cookie_httponly' => true,
    'cookie_secure' => false,
    'cookie_samesite' => 'Lax',
]);
$_SESSION['upload_csrf'] ??= bin2hex(random_bytes(32));
$csrf = $_SESSION['upload_csrf'];
session_write_close();
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf'] ?? null;
    if (!is_string($token) || !hash_equals($csrf, $token)) {
        http_response_code(403);
        exit('Invalid form token');
    }
    $file = $_FILES['avatar'] ?? null;
    if (!is_array($file)
        || ($file['error'] ?? null) !== UPLOAD_ERR_OK
        || !is_string($file['tmp_name'] ?? null)
        || !is_uploaded_file($file['tmp_name'])) {
        http_response_code(422);
        exit('Upload failed');
    }
    $size = filesize($file['tmp_name']);
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    $extensions = ['image/png' => 'png', 'image/jpeg' => 'jpg'];
    if ($size === false || $size < 1 || $size > 2 * 1024 * 1024
        || !is_string($mime) || !isset($extensions[$mime])) {
        http_response_code(422);
        exit('Unsupported file');
    }
    $directory = dirname(__DIR__) . '/storage/uploads';
    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Storage unavailable');
    }
    $name = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
    if (!move_uploaded_file($file['tmp_name'], $directory . '/' . $name)) {
        throw new RuntimeException('Save failed');
    }
    $message = 'Saved privately';
}
?>
<!doctype html>
<html lang="en"><meta charset="utf-8"><title>Upload</title>
<p><?= $message ?></p>
<form method="post" enctype="multipart/form-data">
  <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') ?>">
  <input type="file" name="avatar" accept="image/png,image/jpeg" required>
  <button>Upload</button>
</form>
</html>
~~~

Open `/upload.php`: a permitted image produces `Saved privately` and a generated filename; text renamed .jpg receives 422. Check the upload error and tmp_name shape before using it: an errored upload may have no file. `filesize` and `finfo` inspect the server's temporary file. `move_uploaded_file` moves a genuine HTTP upload. The success message is fixed, and the client filename never enters the path.

`accept` is only a UI hint. MIME detection does not establish that an image is safe for every use; actual display pipelines need decoding/re-encoding, dimension limits, and suitable inspection. Configure `upload_max_filesize` and a larger `post_max_size` to allow multipart overhead, plus a server body limit. Exceeding post_max_size can leave POST and FILES empty; identify 413 in the body-limit layer, as the project will demonstrate. See the [upload reference](https://www.php.net/manual/en/features.file-upload.post-method.php).

## Predict, debug, complete

<details><summary>Predict: save a name, then open a private window</summary><p>The original window retains the name; the private cookie jar starts as Guest. The name is on the server and the identifier connects requests to it.</p></details>

<details><summary>Debug: session_start after HTML output</summary><p>Headers may already be sent, preventing the cookie header. Start the session before output and check for whitespace/BOM before the opening tag. Buffering is not a substitute for a clear order.</p></details>

<details><summary>Complete the defense against name[]=Omar</summary><p>Check <code>is_string($name)</code> before trim or mb_strlen. A field name does not guarantee its type; the request can supply an array.</p></details>

<details><summary>An attacker knows an ID before login. Is HttpOnly enough?</summary><p>No. HttpOnly controls JavaScript access. Use strict mode, rotate at privilege transitions, and invalidate old identifiers with a correct policy; this is fixation.</p></details>

<details><summary>Accept avatar.php.jpg because its submitted type says image/jpeg?</summary><p>No. Check error, size, and content; generate the filename and store outside public. Rejected content must never reach the move step.</p></details>

Preferences is the Form→Validation→Session stage. Keep it: lesson 17 adds Files and Router. `php tests.php security` in the [lab](/en/php/00-lab-setup/) is a supporting policy test, not a substitute for actual multipart requests.
