---
title: 5. كلمات المرور وHashing
description: تخزين كلمات المرور باستخدام password_hash وpassword_verify وArgon2id وbcrypt وإعادة الـhash.
sidebar:
  order: 5
---

## Hashing ليس Encryption

كلمة المرور لا نحتاج استعادتها؛ نحتاج التحقق منها. لذلك نخزن **password hash بطيئًا ومملحًا**، لا تشفيرًا قابلًا للفك ولا SHA-256 سريعًا وحده.

دوال PHP تدير salt والصيغة والمعاملات داخل hash:

```php
$hash = password_hash($password, PASSWORD_DEFAULT);
if ($hash === false) {
    throw new RuntimeException('Password hashing failed');
}
```

اجعل عمود قاعدة البيانات `VARCHAR(255)` لأن `PASSWORD_DEFAULT` قد تتغير خوارزميته وطول ناتجه.

إذا كان Argon2id متاحًا في البناء:

```php
$hash = password_hash($password, PASSWORD_ARGON2ID, [
    'memory_cost' => 64 * 1024,
    'time_cost' => 3,
    'threads' => 2,
]);
```

القيم مثال وليست وصفة عالمية؛ benchmark على خادم الإنتاج واختر تكلفة تؤخر المهاجم دون تعطيل المستخدمين.

## التحقق وإعادة الـhash

```php
if (!password_verify($password, $user['password_hash'])) {
    // رسالة عامة لا تكشف هل البريد موجود
    throw new AuthenticationException('Invalid credentials');
}

if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
    $newHash = password_hash($password, PASSWORD_DEFAULT);
    $users->updatePasswordHash($user['id'], $newHash);
}
```

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
