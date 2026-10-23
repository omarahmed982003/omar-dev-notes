---
title: "File uploads: من form لتخزين private"
prev: {"link":"/php/09-uploads-cookies-sessions/","label":"Cookies وSessions"}
next: {"link":"/php/15-request-router-response/","label":"من HTTP Request إلى Router وResponse"}
description: "File uploads: من form لتخزين private"
sidebar:
  order: 15.3
---

بعد HTTP وform وSession وCSRF وfiles. **Upload** انتقال bytes ملف من العميل للخادم. **Private storage** مكان خارج public يحتاج فحص صلاحية قبل تنزيله؛ الاسم مش حماية لو السيرفر بيقدمه للعامة. **Session** حالة مرتبطة بbrowser، و**CSRF token** قيمة نطابقها لمنع طلب تغيير غير مقصود. ده درس upload مستقل؛ المثال محلي ولا يبني login.

## رفع صورة: من نموذج لملف خاص

أنشئ `public/upload.php` في نفس المجلد؛ الكود ينشئ `storage/uploads` خارج public. **MIME** وصف لنوع المحتوى؛ نوع browser وامتداد الاسم غير موثوقين. `multipart/form-data` طريقة إرسال حقول وملفات. المثال يسمح PNG/JPEG حتى 2 MiB، ويتطلب CSRF:

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

افتح `/upload.php`: الصورة المقبولة تعطي `Saved privately` وملفًا باسم مولد؛ نص باسم .jpg يُرفض بـ422. نتحقق من error وشكل tmp_name قبل استخدامه؛ ملف برقم خطأ قد لا يوجد أصلًا. `filesize` و`finfo` يفحصان الملف المؤقت على server. `move_uploaded_file` تنقل ملف Upload فعلي. رسالة النجاح ثابتة، واسم العميل لا يدخل المسار.

`accept` اختيار واجهة فقط. MIME لا تثبت أن الصورة آمنة لكل استخدام؛ قبل العرض الفعلي طبق فك/إعادة ترميز وحد أبعاد وفحصًا مناسبًا. اضبط `upload_max_filesize` و`post_max_size` (الأخير أكبر لاستيعاب تغليف multipart) وحد جسم الطلب بserver. تجاوز post_max_size قد يترك POST وFILES فارغتين؛ ميّز 413 في طبقة حد الطلب كما سنعمل في المشروع. [مرجع الرفع](https://www.php.net/manual/en/features.file-upload.post-method.php).


## جرّب بنفسك

في مجلد التدريب فقط: جرّب صورة صحيحة وملف نصي اسمه photo.jpg وطلبًا من غير CSRF token صحيح. تأكد إن المرفوض مش بيتخزن.

<details><summary>راجع بعد المحاولة</summary>

الاسم مش دليل محتوى. افحص MIME والحجم وupload error وCSRF قبل النقل، واحفظ المقبول فقط خارج public.

</details>

## توقع وشخّص

<details><summary>ملف avatar.php.jpg، والحقل type يقول image/jpeg. نقبله؟</summary><p>لا بناءً على الاسمين. افحص الخطأ والحجم والمحتوى، ولّد الاسم، واحفظه خارج public. غير المسموح لا يصل لمرحلة النقل.</p></details>

[ارجع لدليل PHP](/php/).

