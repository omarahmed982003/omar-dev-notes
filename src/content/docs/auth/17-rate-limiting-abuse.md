---
title: 17. Rate Limiting ومقاومة الإساءة
description: Fixed وSliding Window وToken Bucket وحدود تسجيل الدخول وCredential Stuffing وCAPTCHA وسياسة الفشل.
sidebar:
  order: 17
---

## ما الذي نحده؟

لا تعتمد على IP فقط؛ قد يشترك مستخدمون في NAT وقد يوزع المهاجم الطلبات. كوّن مفاتيح حسب العملية:

- login: account + IP/network + device signals.
- password reset: account/contact + IP.
- API: key + tenant + endpoint.
- expensive search: user + query cost.

ضع حدودًا أقسى للفشل والعمليات المكلفة، مع حد عالمي يحمي السعة.

## الخوارزميات

| الأسلوب | الفكرة |
|---|---|
| Fixed window | عداد داخل فترة؛ بسيط وله burst عند الحدود |
| Sliding log/window | أدق وأعلى تكلفة |
| Token bucket | tokens تتجدد وتسمح burst مضبوط |
| Leaky bucket | يصقل معدل الخروج |

يجب أن تكون العملية atomic في التخزين المشترك عند تعدد الخوادم.

## استجابة HTTP

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 30
```

لا تكشف هل username موجود. أضف delay/backoff بحذر دون حجز workers طويلًا.

## Login وCredential Stuffing

- لا تستخدم lockout دائمًا يسمح للمهاجم بقفل حساب الضحية.
- استخدم progressive delay وحدودًا متعددة.
- راقب passwords مسربة وفق سياسة الخصوصية.
- MFA/Passkeys تقللان أثر password المسروقة.
- أخطر المستخدم عند نشاط غير معتاد.

## CAPTCHA وRisk

CAPTCHA friction وليست proof of humanity كاملة، ويمكن تجاوزها. استخدمها بعد إشارة خطر لا لكل المستخدمين، وراعِ accessibility والخصوصية.

## الفشل والتشغيل

حدد fail-open أوfail-closed لكل عملية إذا تعطل مخزن limits. login إداري حساس يختلف عن endpoint عامة. راقب allow/deny latency وtop keys دون تخزين credentials.

