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
