---
title: 19. إدارة الأسرار ومفاتيح التشفير
description: Secret managers وenvelope encryption وrotation وrevocation وaccess policy وbreak-glass والاستجابة للتسريب.
sidebar:
  order: 19
---

## ما السر؟

كلمات مرور قواعد البيانات وAPI keys وprivate keys وencryption keys وsigning secrets أسرار. اسم البيئة وURL عامة ليست أسرارًا. التصنيف يحدد التخزين والوصول والدوران.

ملف `.env` وسيلة تحميل في التطوير وليس secret manager، وBase64 ليست تشفيرًا.

## دورة الحياة

```text
generate -> store -> distribute -> use -> rotate -> revoke -> destroy
```

لكل سر owner وpurpose وconsumers وcreated/expiry وrotation policy. لا تشارك سرًا واحدًا بين خدمات كثيرة؛ يصعب معرفة المتسبب وإلغاؤه.

## Secret Manager

التطبيق يحصل على السر بهوية workload وبأقل صلاحية. فضّل secrets قصيرة العمر أوdynamic credentials. Cache في الذاكرة مدة محدودة وتوقع renewal/failure دون كتابتها إلى disk أوlogs.

## Envelope Encryption

```text
KMS/HSM master key encrypts a data-encryption key (DEK)
DEK encrypts application data
store ciphertext + encrypted DEK + algorithm/version metadata
```

لا تستخدم master key مباشرة لكل record. استخدم authenticated encryption مثل Sodium AEAD، مع nonce صحيحة وassociated data تربط ciphertext بالسياق.

## Rotation

احفظ key ID/version مع البيانات أوtoken. أثناء الدوران:

1. أنشئ key جديدة.
2. ابدأ الكتابة بها.
3. استمر في قراءة النسخ القديمة.
4. أعد التشفير/التوقيع حسب الحاجة.
5. ألغِ القديمة بعد نافذة آمنة.

تدوير signing key يختلف عن encryption key؛ حذف مفتاح تشفير قد يجعل البيانات غير قابلة للقراءة.

## الوصول والتدقيق

- least privilege وفصل admin عن runtime.
- audit لكل قراءة/تغيير وإلغاء.
- approval أوbreak-glass للعمليات شديدة الحساسية.
- تنبيه على access غير معتاد.
- backups مشفرة واختبار recovery للمفاتيح المطلوبة.

## عند التسريب

أوقف/قيّد الاستخدام، دوّر السر، حدّد النطاق من audit logs، أصلح المصدر، وافحص history وartifacts وlogs. حذف السر من Git لا يلغيه. لا تطبع قيم secrets في رسائل CI.

## مرجع

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

