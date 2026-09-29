---
title: 9. رفع الملفات والكوكيز والجلسات
description: رفع الملفات بأمان، خيارات Cookies، CSRF، ودورة حياة الجلسة وحمايتها.
sidebar:
  order: 9
---

## المشكلة: كل Request بتبدأ من جديد

المتصفح يفتح صفحة ثم يرسل نموذجًا، لكن المتغيرات المحلية في الطلب الأول لا تنتقل للثاني. نحتاج طريقة تربط الطلبات. **Cookie** قيمة صغيرة يحفظها المتصفح ويرسلها مع الطلب المناسب. **Session** بيانات على الخادم مرتبطة بمعرّف عشوائي؛ المتصفح يحمل المعرّف فقط في الحالة المعتادة. **Upload** نقل Bytes ملف إلى الخادم؛ دي مشكلة مختلفة هنطبق عليها نفس التحقق من المدخلات.

الدرس لا يبني نظام تسجيل دخول؛ هدفه فهم نقل البيانات واستمرار الحالة. تفاصيل الهوية والصلاحيات في [مسار الأمان](/auth/). الأمثلة PHP 8.1+، مع mbstring وfileinfo.

## دورة الجلسة خطوة خطوة

1. المتصفح يرسل أول GET بدون Session Cookie.
2. `session_start` تطلب من مخزن الجلسات فتح حالة. بدون معرّف مقبول تنشئ PHP معرّفًا جديدًا.
3. الخادم يرسل `Set-Cookie` في **Response header**، فيحفظه المتصفح.
4. الطلب التالي يحمل `Cookie` في **Request header**.
5. `session_start` تقرأ البيانات إلى `$_SESSION`؛ مع file handler الافتراضي تأخذ قفل الجلسة أثناء الاستخدام.
6. `session_write_close` أو نهاية الطلب تحفظ التغييرات وتحرر القفل.

`setcookie` لا تغير `$_COOKIE` في الطلب الحالي؛ دي صورة لما وصل بالفعل. و`session_start` لازم تسبق HTML وأي echo لأن الجلسة قد تحتاج إرسال headers.

## برنامج كامل: النموذج يتذكر اسمك

أنشئ مجلدًا فيه `public/preferences.php`. شغّل `php -S 127.0.0.1:8081 -t public` وافتح [النموذج المحلي](http://127.0.0.1:8081/preferences.php). السيرفر التعليمي محلي فقط. هذا المثال يضبط Secure=false عمدًا لاتصال HTTP المحلي؛ عند نشر HTTPS اضبطها true من إعداد موثوق، لا من Header يرسله المستخدم.

**CSRF** إرسال موقع آخر طلب تغيير باسم متصفحك. **Token** هنا قيمة عشوائية في الجلسة والنموذج نطابقهما قبل التغيير؛ ليست Password ولا Session ID.

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

توقع أول زيارة `Hello Guest`. اكتب Omar، فالـPOST ترجع 303 ثم المتصفح يعمل GET وتظهر `Hello Omar`. افتح نافذة خاصة: ترجع Guest لأنها جلسة مختلفة. أدخل مسافات فقط: 422 ولا يتغير الاسم. احذف token من الطلب: 403 قبل الحفظ.

اقرأ البرنامج بالترتيب: نضبط الجلسة ونبدأها، ننشئ CSRF مرة، نميز POST، نفحص النوع قبل hash_equals، ثم UTF-8 والطول. `maxlength` مساعدة في المتصفح وليست تحقق الخادم؛ المتصفح وPHP قد يعدان وحدات النص بشكل مختلف، وهنفصل Unicode في الدرس 13. `303` تطبق **Post/Redirect/Get** فتحديث الصفحة يعيد GET، لكنه ليس حماية عامة من تكرار POST. ننسخ القيم المطلوبة ثم نقفل الجلسة مبكرًا. `htmlspecialchars` تحمي سياق HTML النصي والـattribute المقتبس عند العرض، ولا تغير البيانات المخزنة.

## Cookie flags وحدودها

| الإعداد | ما يفعله |
|---|---|
| Secure | إرسال عبر HTTPS؛ المثال المحلي فقط يستعمل false |
| HttpOnly | يمنع قراءة Cookie عبر JavaScript، لكنه لا يمنع طلبات XSS |
| SameSite=Lax | يقلل الإرسال في سياقات cross-site؛ لا يستبدل CSRF token |
| SameSite=None | يحتاج Secure؛ لا تستخدمه بلا سبب |
| Path/Domain | تحدد متى يرسلها المتصفح؛ ليستا نظام صلاحيات |
| expires / cookie_lifetime | عمر Cookie، وليس وحده عمر صلاحية بيانات الخادم |

Cookie تفضيل مثل theme ممكن يغيرها المستخدم؛ تحقق من قيمة ضمن `['light', 'dark']`. لا تخزن Password أو صلاحية إدارية خامًا فيها. خزن البيانات الحساسة في مخزن مناسب وخلي المعرّفات نفسها أسرارًا.

## Session Fixation: المهاجم يعرف التذكرة قبل الدخول

**Fixation** يعني إقناع الضحية باستخدام Session ID يعرفه المهاجم، ثم يظل المعرّف صالحًا بعد نجاح تسجيل الدخول. السرقة مختلفة: الحصول على معرّف ضحية موجود بالفعل. `use_strict_mode` ترفض معرّفات غير مهيأة، لكنها لا تحل كل سيناريوهات التثبيت لجلسة موجودة.

بعد التحقق الحقيقي من بيانات الدخول، غيّر المعرّف **قبل** إضافة هوية المستخدم الجديدة. المقطع التالي خاص بحد تسجيل الدخول في نظام مجهز، وليس Login جاهزًا:

~~~php
// After credentials were verified and a session was started:
if (!session_regenerate_id(false)) {
    throw new RuntimeException('Cannot rotate session');
}
$_SESSION['user_id'] = $verifiedUserId;
$_SESSION['authenticated_at'] = time();
~~~

`false` تحتفظ ببيانات الجلسة القديمة لتجنب قطع الطلبات المتزامنة؛ لكن ده مش تصميم إبطال مكتمل. النظام الفعلي يحتاج علامة obsolete/timestamp في السجل القديم، فترة انتقال قصيرة وسياسة تمنع استخدامه بصلاحيات جديدة، وانتهاء خمول وعمر كلي يطبقهما الخادم. حذف القديم فورًا بـ`true` قد يناسب مثالًا متسلسلًا، لكنه يسبب فقد جلسات وسباقات على شبكة غير مستقرة. لا تعرض المعرّف ولا تسجله في logs. اتبع [إدارة أمان الجلسات](https://www.php.net/manual/en/features.session.security.management.php) و[درس الجلسات](/auth/01-session-security/).

## إنهاء الجلسة غير مسح متغير

في مسار POST محمي بـCSRF وبعد session_start: امسح `$_SESSION = []`، واحذف Cookie بنفس Path وDomain وflags بوضع expires في الماضي، ثم `session_destroy`. الدالة وحدها لا تمسح Cookie ولا المصفوفة المحلية. `session_unset` تمسح المتغيرات فقط. `session_write_close` تحفظ وتحرر القفل؛ التعديل على `$_SESSION` بعدها لا يُحفظ تلقائيًا. `session_start(['read_and_close' => true])` للقراءة فقط، لكن انتبه لسياسة انتهاء المخزن.

مخزن Redis أو Database يحتاج `SessionHandlerInterface` أو `session_set_save_handler` وسياسة قفل وانتهاء واضحة. Garbage collection تنظيف احتمالي للتخزين، مش قرار صلاحية الطلب.

## رفع صورة: من نموذج لملف خاص

أنشئ `public/upload.php` في نفس المجلد؛ الكود ينشئ `storage/uploads` خارج public. **MIME** وصف لنوع المحتوى؛ نوع المتصفح وامتداد الاسم غير موثوقين. `multipart/form-data` طريقة إرسال حقول وملفات. المثال يسمح PNG/JPEG حتى 2 MiB، ويتطلب CSRF:

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

افتح `/upload.php`: الصورة المقبولة تعطي `Saved privately` وملفًا باسم مولد؛ نص باسم .jpg يُرفض بـ422. نتحقق من error وشكل tmp_name قبل استخدامه؛ ملف برقم خطأ قد لا يوجد أصلًا. `filesize` و`finfo` يفحصان الملف المؤقت على الخادم. `move_uploaded_file` تنقل ملف Upload فعلي. رسالة النجاح ثابتة، واسم العميل لا يدخل المسار.

`accept` اختيار واجهة فقط. MIME لا تثبت أن الصورة آمنة لكل استخدام؛ قبل العرض الفعلي طبق فك/إعادة ترميز وحد أبعاد وفحصًا مناسبًا. اضبط `upload_max_filesize` و`post_max_size` (الأخير أكبر لاستيعاب تغليف multipart) وحد جسم الطلب بالخادم. تجاوز post_max_size قد يترك POST وFILES فارغتين؛ ميّز 413 في طبقة حد الطلب كما سنعمل في المشروع. [مرجع الرفع](https://www.php.net/manual/en/features.file-upload.post-method.php).

## توقع، شخّص، كمّل

<details><summary>توقع: ضغط Save ثم فتح نافذة خاصة</summary><p>النافذة الأولى تحتفظ بالاسم؛ الخاصة لها Cookie jar مختلفة فتبدأ Guest. الاسم على الخادم، والمعرّف هو الرابط.</p></details>

<details><summary>Debugging: session_start بعد طباعة HTML</summary><p>قد تكون headers اتبعتت فلا تستطيع PHP إرسال Cookie. انقل بدء الجلسة قبل كل إخراج، وراجع مسافات/BOM قبل الوسم؛ output buffering مش إصلاحًا لترتيب غير واضح.</p></details>

<details><summary>كمّل الحماية من name[]=Omar</summary><p>افحص <code>is_string($name)</code> قبل trim أو mb_strlen. اسم الحقل لا يضمن نوعه؛ الطلب قد يحمل Array.</p></details>

<details><summary>مهاجم يعرف Session ID قبل الدخول. هل HttpOnly تكفي؟</summary><p>لا؛ HttpOnly تخص قراءة JavaScript. تحتاج strict mode وتغيير المعرّف عند انتقال الصلاحية وإبطال القديم بسياسة صحيحة؛ راجع fixation.</p></details>

<details><summary>ملف avatar.php.jpg، والحقل type يقول image/jpeg. نقبله؟</summary><p>لا بناءً على الاسمين. افحص الخطأ والحجم والمحتوى، ولّد الاسم، واحفظه خارج public. غير المسموح لا يصل لمرحلة النقل.</p></details>

برنامج preferences هو مرحلة Form→Validation→Session. احتفظ به؛ الدرس 17 يضيف Files وRouter. `php tests.php security` من [المختبر](/php/00-lab-setup/) اختبار مساعد للسياسات وليس بديلًا لتجربة multipart الفعلية.
