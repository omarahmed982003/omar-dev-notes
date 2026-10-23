---
title: "File uploads and private storage"
prev: {"link":"/en/php/09-uploads-cookies-sessions/","label":"Cookies and sessions"}
next: {"link":"/en/php/15-request-router-response/","label":"From HTTP request to router and response"}
description: "File uploads and private storage"
sidebar:
  order: 15.3
---

Requires HTTP forms, sessions, CSRF, and files. An upload transfers file bytes from client to server. Private storage sits outside public serving and requires authorization before download. A session links requests; a CSRF token protects changes. The local example does not implement login.

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


## Independent exercise

In the disposable lab, try a valid image, a text file named photo.jpg, and an invalid CSRF token. Check rejected files never reach storage.

<details><summary>Review after trying</summary>

A filename does not establish content. Validate MIME, size, upload status, and CSRF before moving accepted files outside public.

</details>

## Predict and diagnose

<details><summary>Accept avatar.php.jpg because its submitted type says image/jpeg?</summary><p>No. Check error, size, and content; generate the filename and store outside public. Rejected content must never reach the move step.</p></details>

[Return to the PHP guide](/en/php/).

