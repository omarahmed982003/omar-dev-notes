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
