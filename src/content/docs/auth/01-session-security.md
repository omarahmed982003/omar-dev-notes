---
title: 1. حماية الجلسات
description: دورة الجلسة الآمنة ومنع Session Fixation وHijacking وإدارة المعرف والكوكي.
sidebar:
  order: 1
---

## كيف تعمل الجلسة؟

يحفظ الخادم البيانات، ويحمل المتصفح عادة Cookie تحتوي Session ID عشوائيًا. المعرّف **بيانات اعتماد**؛ من يسرقه قد ينتحل الجلسة حتى لو لم يعرف كلمة المرور.

أهم المخاطر:

- **Session Fixation:** يجبر المهاجم الضحية على استخدام ID يعرفه، ثم ينتظر تسجيل الدخول.
- **Session Hijacking:** يسرق ID فعّالًا عبر XSS أو شبكة غير محمية أو Logs أو جهاز مخترق.
- **Brute force:** محاولة تخمين IDs ضعيفة؛ يجب أن يولدها PHP عشوائيًا ولا تنشئها بـ`uniqid()`.
- **Race conditions:** حذف الجلسة القديمة فورًا أثناء طلبات متزامنة قد يفقد الحالة.

## إعداد البداية

```php
<?php
declare(strict_types=1);

session_start([
    'use_strict_mode' => true,
    'use_only_cookies' => true,
    'cookie_secure' => true,
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);
```

- `Secure`: لا ترسل الكوكي إلا عبر HTTPS.
- `HttpOnly`: يمنع JavaScript من قراءتها، لكنه لا يمنع XSS من تنفيذ أفعال باسم المستخدم.
- `SameSite`: يقلل الإرسال cross-site، وليس بديلًا مطلقًا عن CSRF token.
- `use_strict_mode`: يرفض Session ID غير مهيأ من الخادم.

استدعِ `session_start()` قبل الإخراج. لا تمرر Session ID في URL لأنه يتسرب في History وLogs وReferer.

## تسجيل الدخول وتغيير الصلاحية

بعد إثبات كلمة المرور غيّر المعرّف **قبل** تثبيت حالة المصادقة الجديدة:

```php
if (password_verify($password, $user['password_hash'])) {
    session_regenerate_id();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['auth_time'] = time();
    $_SESSION['last_seen'] = time();
}
```

غيّر المعرف عند login، ورفع الصلاحية، وتغيير كلمة المرور أو حدث أمني مهم. لا تغيّره في كل request دون تصميم؛ الطلبات المتوازية قد تتسابق.

:::caution
استخدام `session_regenerate_id(true)` لحذف التخزين القديم فورًا قد يسبب فقدًا على شبكات غير مستقرة أو مع AJAX المتزامن. الأنظمة الحساسة تستخدم انتقالًا زمنيًا وتمنع استخدام القديم بعد مهلة قصيرة ثم تترك GC يزيله.
:::

## انتهاء خمول وعمر كلي

```php
$now = time();
$idleLimit = 15 * 60;
$absoluteLimit = 8 * 60 * 60;

if (
    isset($_SESSION['last_seen'], $_SESSION['auth_time'])
    && ($now - $_SESSION['last_seen'] > $idleLimit
        || $now - $_SESSION['auth_time'] > $absoluteLimit)
) {
    logout();
}

$_SESSION['last_seen'] = $now;
```

لا تعتمد على `session.gc_maxlifetime` وحده؛ GC تنظيف تخزين وليس سياسة وصول دقيقة.

## Fingerprinting بحذر

يمكن تسجيل User-Agent وتغيرات IP كإشارة مخاطرة، لكن لا تربط الجلسة تطابقًا كاملًا بـIP؛ شبكات الهاتف وVPN وNAT تتغير. استخدم الإشارات لطلب إعادة المصادقة أو تسجيل تنبيه، لا لطرد المستخدم عشوائيًا.

## إغلاق القفل والخروج

```php
// بعد تعديل الجلسة، احفظ وأغلق القفل مبكرًا
session_write_close();
```

لتسجيل الخروج: ابدأ الجلسة، امسح `$_SESSION`، احذف Cookie بنفس path/domain/options، ثم `session_destroy()`. أبطل كذلك refresh tokens والجلسات المسجلة في قاعدة البيانات إن وجدت.
