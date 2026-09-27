---
title: 15. API Keys وهوية الأنظمة
description: إصدار مفاتيح API وتخزينها وتدويرها وScopes وService Accounts وmTLS والفرق عن جلسة المستخدم.
sidebar:
  order: 15
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **IP:** عنوان رقمي بيميز جهازًا أو واجهة شبكة.
- **TLS:** طبقة تشفير بتحمي البيانات وهي ماشية بين طرفين.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Scope:** نطاق التفويض: اسم صلاحية يطلبها التطبيق أو يحصل عليها، زي orders:read لقراءة الطلبات؛ ولسه لازم نتحقق إن المستخدم يملك الطلب.


## API key ليست هوية مستخدم

المفتاح يعرّف application أوintegration غالبًا، ولا يثبت وحده المستخدم النهائي أو التفويض المفوض مثل OAuth. اربطه بـprincipal واضح مع owner وpurpose وبيئة وصلاحيات.

## شكل وتخزين

استخدم prefix يوضح النوع ومعرفًا عامًا وسرًا عشوائيًا:

```text
live_ak_7F2K.<random-secret>
```

ابحث بالمعرف، وخزّن hash للسر:

```php
$secret = bin2hex(random_bytes(32));
$hash = hash('sha256', $secret);
// اعرض السر مرة واحدة ثم خزّن hash فقط.
```

الـprefix يساعد secret scanners والدعم، لكنه ليس سرًا.

## صلاحيات ودورة حياة

- scopes صغيرة وdeny-by-default.
- expiry عند الإمكان.
- last-used metadata بلا body حساس.
- rotation بفترة overlap قصيرة.
- revoke فوري.
- مفاتيح منفصلة لكل نظام وبيئة.

أرسل key في `Authorization` header أو header مخصص عبر TLS، لا query string.

## Rate limits وService Accounts

طبّق quota لكل key/tenant. IP allow-list طبقة إضافية وليست هوية وحدها. امنح الحساب الآلي أقل صلاحية واربط actions به في audit trail. فضّل credentials قصيرة العمر بدل ملفات keys ثابتة عند توفر workload identity.

## mTLS

Mutual TLS يسمح للطرفين بتقديم شهادات. يحتاج إصدار وتجديد وإلغاء وربط subject بصلاحيات؛ التشفير المتبادل لا يلغي authorization على العملية.

## سيناريو أمني

<details><summary>كيف نخزن API key؟</summary><p>اعرض السر مرة، خزّن hash أو استخدم secret manager، أضف scope وexpiry وrotation وسجل الاستخدام.</p></details>

## تدريب تهديد

**السيناريو:** يتسرب API key لخدمة ذات صلاحيات واسعة ويُستخدم من بيئة غير متوقعة.

**اختبار المنع:** جرّب المفتاح بعد إلغائه، ومن مصدر غير مسموح، وعلى عملية خارج نطاقه.

**النتيجة المتوقعة:** تُرفض المحاولات الثلاث، ويكون الدوران ممكنًا بلا توقف الخدمة، وتعرض السجلات معرّف المفتاح لا قيمته السرية.

### مرجع التحقق

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## اربط النقاط ببعض

للخدمات الحديثة فضل workload identity federation أو short-lived credentials بدل secret ثابت عندما تتوفر البنية. Client assertion الموقعة تحتاج audience ووقت وjti ومنع replay. HSM/KMS يحمي private key غير القابل للتصدير، ودوران المفتاح يحتاج overlap ومعرفًا يحدد الإصدار دون توقف.

### جرّب بنفسك

دوّر credential لخدمة حية وتأكد أن القديم ينتهي بعد نافذة محددة.
