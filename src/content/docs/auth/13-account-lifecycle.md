---
title: 13. دورة حياة الحساب
description: التسجيل وتأكيد البريد واسترجاع كلمة المرور وتغيير الهوية وإعادة المصادقة وإلغاء الجلسات.
sidebar:
  order: 13
---

## التسجيل

عامل التسجيل كعملية هوية لا مجرد `INSERT`:

1. طبّع البريد وفق سياسة موثقة دون تغيير عشوائي.
2. تحقق من الشكل والنطاق وقواعد المنتج.
3. طبّق rate limit ومراقبة الإساءة.
4. خزّن password بـ`password_hash()`.
5. لا تمنح صلاحيات حساسة قبل إثبات البريد/الهاتف المطلوب.

لتقليل account enumeration استخدم رسالة متقاربة مثل “إن كان العنوان صالحًا فستصل رسالة”، مع logging داخلي.

## Token التأكيد

```php
$token = bin2hex(random_bytes(32));
$tokenHash = hash('sha256', $token);
// خزّن hash + user_id + expires_at + used_at
// أرسل token الخام في رابط HTTPS مرة واحدة
```

عند الاستخدام: hash القيمة، افحص expiry وused_at، ثم علّمها مستخدمة داخل transaction. لا تخزن token الخام.

## Password reset

- رسالة عامة سواء الحساب موجودًا أم لا.
- token عشوائية قصيرة العمر وأحادية الاستخدام.
- لا تغير password قبل إثبات token.
- بعد النجاح دوّر session ID وألغِ جلسات/refresh tokens حسب السياسة.
- أرسل إشعارًا أمنيًا.

لا تستخدم أسئلة أمان قابلة للتخمين.

## العمليات الحساسة

اطلب re-authentication أو MFA قبل تغيير البريد أو password أو وسائل MFA أو تنفيذ تحويل مالي. لا تعتبر session قديمة دليلًا كافيًا؛ سجل `auth_time` وحدد max age.

## تغيير البريد والحذف

تحقق من البريد الجديد، وأبلغ القديم، وتعامل مع uniqueness race داخل database. عرّف الفرق بين suspension وdeactivation وdeletion، وألغِ credentials والجلسات وسجل actor/reason/time.

## حالات السباق

استخدم transaction وunique constraints، وامنَع استخدام token نفسها مرتين. اختبر click مزدوج وطلب reset متزامن وتغيير البريد أثناء وجود جلسات أخرى.

