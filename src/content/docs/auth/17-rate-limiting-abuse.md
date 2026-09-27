---
title: 17. Rate Limiting ومقاومة الإساءة
description: Fixed وSliding Window وToken Bucket وحدود تسجيل الدخول وCredential Stuffing وCAPTCHA وسياسة الفشل.
sidebar:
  order: 17
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **IP:** عنوان رقمي بيميز جهازًا أو واجهة شبكة.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.


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

## سيناريو أمني

<details><summary>هل rate limit بالـIP كفاية؟</summary><p>لا؛ عناوين مشتركة وbotnets تجعلها إشارة واحدة. ادمج identity وdevice وroute وتكلفة العملية.</p></details>

## تدريب تهديد

**السيناريو:** يوزع المهاجم محاولات تسجيل الدخول على عناوين IP متعددة لتجاوز عدّاد بسيط لكل عنوان.

**اختبار المنع:** أرسل دفعة محاولات لحساب واحد من مصادر مختلفة، ثم طلبًا شرعيًا لحساب آخر.

**النتيجة المتوقعة:** يتباطأ أو يُحظر الهجوم حسب الحساب والسياق، بينما يبقى المستخدم الآخر قادرًا على العمل؛ لا يتحول الدفاع إلى DoS شامل.

### مرجع التحقق

- [OWASP Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

## اربط النقاط ببعض

Distributed limiter يحتاج atomic shared state أو خوارزمية تتحمل التقريب، مع فهم clock skew وfailover. لا تثق في X-Forwarded-For إلا من proxies معروفة. أضف cost-based limits للعمليات الثقيلة وميزانية حسب الحساب والجهاز وIP، وراقب أن الدفاع لا يتحول إلى DoS على المستخدمين الشرعيين.

### جرّب بنفسك

شغّل limiter على عقدتين وحاكِ فقد التخزين المشترك وتبديل IP.
