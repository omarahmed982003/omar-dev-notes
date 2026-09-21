---
title: 15. API Keys وهوية الأنظمة
description: إصدار مفاتيح API وتخزينها وتدويرها وScopes وService Accounts وmTLS والفرق عن جلسة المستخدم.
sidebar:
  order: 15
---

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

