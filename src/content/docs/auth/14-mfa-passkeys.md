---
title: 14. MFA وTOTP وPasskeys
description: عوامل المصادقة وTOTP وRecovery Codes وWebAuthn/Passkeys وStep-up والاسترجاع الآمن.
sidebar:
  order: 14
---

## العامل ليس مجرد خطوة ثانية

- شيء تعرفه: password/PIN.
- شيء تملكه: authenticator أو security key.
- شيء تكونه: biometric محلي يفتح credential.

عاملان من الفئة نفسها ليسا MFA قوية. SMS أفضل أحيانًا من password وحدها لكنه معرض لـSIM swap وphishing.

## TOTP

عند التسجيل أنشئ secret عشوائية، اعرض QR عبر قناة authenticated، واطلب code لإثبات الإعداد قبل التفعيل. خزّن السر مشفرًا بمفتاح مُدار، لا hashed فقط لأن الخادم يحتاجه للتحقق.

- نافذة زمنية صغيرة مع clock متزامن.
- امنع replay لنفس time step إن أمكن.
- rate limit للتحقق.
- لا تسجل secret أو code.

## Recovery Codes

أنشئ codes عشوائية أحادية الاستخدام، اعرضها مرة، وخزّن hashes قوية لها. عند استخدام code علّمها مستخدمة وأخبر المستخدم، واسمح بتجديد المجموعة بعد re-authentication.

## WebAuthn وPasskeys

```text
server challenge -> browser/authenticator -> public-key credential
server stores credential ID + public key + metadata
```

في الدخول يتحقق الخادم من signature وchallenge وorigin وRP ID وuser verification وسياسة counter. الخادم لا يخزن private key. Passkeys مقاومة للتصيد لأنها مرتبطة بالـRP/origin.

## Step-up

اطلب assurance أعلى عند تغيير وسائل الاسترجاع، دفع كبير، عرض سر، أو سلوك عالي المخاطر. اربط النتيجة بالعملية ومدة قصيرة.

## Recovery هي أضعف حلقة

- عدة قنوات/إثباتات حسب المخاطر.
- تأخير وإشعارات للتغيير الحساس.
- مراجعة دعم بشري بإجراءات وتدقيق.
- إلغاء credentials المفقودة وتسجيل الحدث.

## مرجع

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

