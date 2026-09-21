---
title: 9. رفع الملفات والكوكيز والجلسات
description: رفع الملفات بأمان، خيارات Cookies، CSRF، ودورة حياة الجلسة وحمايتها.
sidebar:
  order: 9
---

## رفع الملفات

يجب أن يكون النموذج `POST` وبـ `multipart/form-data`:

```html
<form method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" accept="image/png,image/jpeg">
  <button>رفع</button>
</form>
```

تضع PHP البيانات في `$_FILES` وتنقل الملف أولًا إلى `upload_tmp_dir`. لا تثق في الاسم أو MIME القادم من المتصفح.

```php
<?php
declare(strict_types=1);

$file = $_FILES['avatar'] ?? null;

if (!is_array($file) || $file['error'] !== UPLOAD_ERR_OK) {
    throw new RuntimeException('فشل الرفع');
}

if ($file['size'] > 2 * 1024 * 1024) {
    throw new RuntimeException('الحد الأقصى 2MB');
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
$extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png'];

if (!isset($extensions[$mime])) {
    throw new RuntimeException('نوع غير مسموح');
}

$name = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
$target = __DIR__ . '/../storage/uploads/' . $name;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    throw new RuntimeException('تعذر حفظ الملف');
}
```

افحص `UPLOAD_ERR_*` والحجم الحقيقي وMIME بـ `finfo`، وأعد تسمية الملف، وخزنه خارج public web root إن أمكن. لا تنفذ الملف، واضبط `upload_max_filesize` و`post_max_size`.

## Cookies

الكوكي قيمة صغيرة يخزنها المتصفح ويرسلها مع الطلبات المطابقة للنطاق والمسار.

```php
setcookie('theme', 'dark', [
    'expires' => time() + 60 * 60 * 24 * 30,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax',
]);

$theme = $_COOKIE['theme'] ?? 'light';
```

- `Secure`: الإرسال عبر HTTPS فقط.
- `HttpOnly`: يمنع JavaScript من قراءة الكوكي، فيقلل سرقة session عبر XSS.
- `SameSite=Lax/Strict/None`: يقيّد الطلبات cross-site. `None` يتطلب `Secure`.
- هذه الإعدادات تساعد ضد CSRF لكنها لا تستبدل CSRF token في العمليات الحساسة.
- لا تضع أسرارًا أو بيانات حساسة خامًا في Cookies.

## Sessions

بيانات الجلسة تُحفظ عادة على الخادم، بينما يحتفظ المتصفح بمعرّف session في Cookie. عند `session_start()` تنشئ PHP جلسة أو تستعيدها وتملأ `$_SESSION`.

```php
session_start([
    'use_strict_mode' => true,
    'cookie_httponly' => true,
    'cookie_secure' => true,
    'cookie_samesite' => 'Lax',
]);

$_SESSION['cart'][] = 42;
$userId = $_SESSION['user_id'] ?? null;
```

بعد نجاح تسجيل الدخول أو رفع الصلاحية، غيّر المعرّف **قبل** تثبيت حالة المصادقة الجديدة:

```php
session_regenerate_id();
$_SESSION['user_id'] = $user->id;
$_SESSION['authenticated_at'] = time();
```

:::caution[تصحيح أمني مهم]
كتابة `session_regenerate_id(true)` وحذف الجلسة القديمة فورًا تبدو أكثر أمانًا، لكنها قد تسبب فقد الجلسة أو race conditions مع الطلبات المتزامنة والشبكات غير المستقرة. في نظام حساس استخدم timestamps وفترة انتقال قصيرة وفق تصميم موثق، ولا تجمع حذفًا فوريًا عشوائيًا مع `session_destroy()`.
:::

## تنظيف الجلسة وتسجيل الخروج

```php
session_start();
$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 42000,
        'path' => $p['path'],
        'domain' => $p['domain'],
        'secure' => $p['secure'],
        'httponly' => $p['httponly'],
        'samesite' => $p['samesite'] ?? 'Lax',
    ]);
}

session_destroy();
```

- `session_unset()` يزيل متغيرات الجلسة، ويمكن أيضًا تعيين `$_SESSION = []`.
- `session_destroy()` يحذف بيانات التخزين الحالية، لكنه لا يمسح تلقائيًا مصفوفة `$_SESSION` أو Cookie عند العميل.
- `session_write_close()`/ `session_commit()` يحفظ ويغلق القفل مبكرًا.
- للقراءة فقط: `session_start(['read_and_close' => true]);`.

يمكن تخصيص التخزين في قاعدة بيانات أو Redis عبر `SessionHandlerInterface` أو `session_set_save_handler()`. طبّق انتهاءً زمنيًا للخمول والعمر الكلي، وسجّل الجلسات النشطة، ولا تعتمد على garbage collection وحده.

للتفاصيل الأمنية والهجمات المرتبطة بالجلسات، تابع [حماية الجلسات](/auth/01-session-security/).
