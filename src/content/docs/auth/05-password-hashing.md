---
title: 5. كلمات المرور وHashing
description: تخزين كلمات المرور باستخدام password_hash وpassword_verify وArgon2id وbcrypt وإعادة الـhash.
sidebar:
  order: 5
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **URL:** العنوان الكامل لمورد على الويب، زي صفحة أو صورة أو نقطة API.
- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.


## Hashing ليس Encryption

كلمة المرور لا نحتاج استعادتها؛ نحتاج التحقق منها. لذلك نخزن **password hash بطيئًا ومملحًا**، لا تشفيرًا قابلًا للفك ولا SHA-256 سريعًا وحده.

دوال PHP تدير salt والصيغة والمعاملات داخل hash:

```php
<?php
declare(strict_types=1);

$password = 'a long example passphrase';
// One policy for registration AND rehashing after successful login.
$algorithm = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT;
$options = $algorithm === PASSWORD_DEFAULT ? [] : [
    'memory_cost' => 64 * 1024, 'time_cost' => 3, 'threads' => 2,
];
$storedHash = password_hash($password, $algorithm, $options);
echo password_verify($password, $storedHash) ? "valid\n" : "invalid\n";
echo password_verify('wrong password', $storedHash) ? "valid\n" : "invalid\n";
if (password_verify($password, $storedHash)
    && password_needs_rehash($storedHash, $algorithm, $options)) {
    $storedHash = password_hash($password, $algorithm, $options);
    // Persist using a conditional update against the previous hash.
}
```

اجعل عمود قاعدة البيانات `VARCHAR(255)` لأن `PASSWORD_DEFAULT` قد تتغير خوارزميته وطول ناتجه.

المثال بيختار Argon2id لو موجود، وبيحتفظ بنفس الخوارزمية ونفس الخيارات وقت إعادة الـhash.



القيم مثال وليست وصفة عالمية؛ benchmark على خادم الإنتاج واختر تكلفة تؤخر المهاجم دون تعطيل المستخدمين.

## التحقق وإعادة الـhash



`password_verify()` يستخرج salt/options من hash. لا تقارن hashes يدويًا، ولا تنشئ salt بنفسك.

## سياسة صحيحة

- اسمح بعبارات مرور طويلة، ولا تفرض قواعد تركيب مزعجة بلا سبب.
- لا تقص كلمة المرور بصمت. راعِ حد الخوارزمية؛ bcrypt يتعامل تاريخيًا مع أول 72 bytes.
- لا تغيّر case أو trim لكلمة مرور المستخدم دون سياسة معلنة.
- افحص كلمات المرور المسربة إن كانت لديك خدمة مناسبة تحفظ الخصوصية.
- أضف Rate Limiting وتأخيرًا تدريجيًا ومراقبة، وMFA للحسابات الحساسة.
- لا تسجل كلمة المرور أو تضعها في URL.

## Pepper اختياري

يمكن إضافة secret server-side منفصل عن قاعدة البيانات باستخدام HMAC قبل `password_hash`، لكنه يزيد تعقيد التدوير والاسترجاع. احفظه في secret manager لا في Git، وخطط لتغيير المفاتيح. Salt ليس سرًا وموجود داخل hash؛ Pepper سر مختلف.

## تغيير واسترجاع كلمة المرور

- اطلب إعادة المصادقة للتغيير الحساس.
- Reset token عشوائي، قصير العمر، single-use، وخزّن hash له لا قيمته الخام.
- بعد التغيير ألغِ الجلسات/refresh tokens الأخرى حسب سياسة المنتج.
- لا ترسل كلمة المرور القديمة أو الجديدة عبر البريد.

## سيناريو أمني

<details><summary>ليه نستخدم Argon2id أو bcrypt بدل SHA-256؟</summary><p>password hashes بطيئة ومملحة عمدًا لمقاومة التخمين؛ hash سريع يساعد المهاجم على تجربة كلمات أكثر.</p></details>

## تدريب تهديد

**السيناريو:** تتسرب قاعدة المستخدمين؛ الهدف أن تبقى كلمات المرور مكلفة للكسر وألا تكشف السجلات أو الاستجابات قيمة حساسة.

**اختبار المنع:** تحقق أن نفس كلمة المرور تنتج hash مختلفًا مرتين، وأن كلمة خاطئة تفشل، وأن <code>password_needs_rehash</code> يكتشف الإعداد القديم.

**النتيجة المتوقعة:** تنجح المطابقة الصحيحة فقط، ولا تُخزن كلمة المرور الخام، ويُحدّث الـhash بعد تسجيل دخول ناجح عند الحاجة.

### مرجع التحقق

- [PHP password hashing functions](https://www.php.net/manual/en/ref.password.php)

## اربط النقاط ببعض

اختر Argon2 أو bcrypt parameters بقياس latency وذاكرة على عتاد الإنتاج، ثم version policy عبر needs_rehash. افحص كلمات المرور المسربة بطريقة تحمي الخصوصية مع rate limits، واربط reset token بعمر واستخدام واحد وتخزين hash وإلغاء الجلسات حسب السياسة.

### جرّب بنفسك

قِس إعدادين للhash وحدد budget ثم اختبر reset token مستخدمًا مرتين.


## افهم الناتج والفشل

البرنامج الكامل بيطبع `valid` وبعدها `invalid`. `PASSWORD_DEFAULT` سياسة ممكن PHP يغيرها؛ استخدامها مش معناه تثبيت Argon2id. اختار إعداداتك بالقياس. في PHP 8 فشل التوليد بيرمي استثناء/خطأ، زي `ValueError` للإعداد غير الصحيح أو `Error` لبعض حالات الفشل؛ فحص `=== false` يخص سلوكًا أقدم. خلي معالج الأخطاء المركزي يعيد رسالة عامة من غير تسجيل كلمة السر. تحديث قاعدة البيانات مسؤولية التطبيق: استخدم تحديثًا مشروطًا بالقيمة السابقة حتى لا تكتب فوق تغيير كلمة سر حصل بالتزامن.

تدريب: غيّر `time_cost` فقط بعد إنشاء الـhash. التحقق يفضل ناجح لأن الإعداد القديم محفوظ داخل الـhash، لكن `password_needs_rehash` يرجع true مع السياسة الجديدة.
