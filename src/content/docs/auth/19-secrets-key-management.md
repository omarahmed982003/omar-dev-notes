---
title: 19. إدارة الأسرار ومفاتيح التشفير
description: Secret managers وenvelope encryption وrotation وrevocation وaccess policy وbreak-glass والاستجابة للتسريب.
sidebar:
  order: 19
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Runtime:** وقت التشغيل: الفترة اللي البرنامج بيكون شغال فيها فعلًا.
- **URL:** العنوان الكامل لمورد على الويب، زي صفحة أو صورة أو نقطة API.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Cache:** نسخة مؤقتة من البيانات هدفها تقليل وقت الانتظار والعمل المتكرر.
- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.


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

## سيناريو أمني

<details><summary>إيه أول خطوة بعد تسريب secret؟</summary><p>أبطل أو دوّر السر فورًا، حدد نطاق الاستخدام من السجلات، أصلح المصدر ثم راقب إساءة الاستخدام.</p></details>

## تدريب تهديد

**السيناريو:** تسرّب إصدار قديم من مفتاح تشفير بينما ما زالت بعض البيانات مشفرة به.

**اختبار المنع:** دوّر المفتاح، اختبر تشفير بيانات جديدة، فك بيانات قديمة خلال نافذة الهجرة، ثم عطّل الإصدار القديم.

**النتيجة المتوقعة:** تستخدم الكتابات المفتاح الجديد فورًا، تنجح الهجرة المراقبة، وبعد الإلغاء لا يستطيع المفتاح القديم تنفيذ عمليات جديدة.

### مرجع التحقق

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## اربط النقاط ببعض

حدد cryptoperiod لكل key واستخدم KMS/HSM عندما تحتاج non-exportable keys أو فصل الصلاحيات. Backup المشفر يحتاج key backup مستقلًا واختبار restore. Key destruction قرار موثق يمنع فك بيانات مستقبلًا، وrotation يختلف عن re-encryption؛ نفذ dual-read/single-write أثناء الهجرة.

### جرّب بنفسك

دوّر key ثم استعد backup قديمًا وأثبت وجود أو غياب المفتاح المطلوب وفق السياسة.
