---
title: 8. Server وProxy وLoad Balancer وAPI Gateway
description: الفرق العملي بين الخادم والوسيط وموازن الأحمال وبوابة APIs، ومسؤوليات كل طبقة ومخاطر الإعداد الخاطئ.
sidebar:
  order: 8
---

## لماذا توجد طبقات أمام التطبيق؟

يمكن للعميل الاتصال بتطبيق واحد مباشرة، لكن الأنظمة الحقيقية تحتاج TLS وحماية وتوزيع حمل وتوجيهًا ومراقبة وسياسات موحدة. لذلك توضع طبقات أمام التطبيق. قد يجمع منتج واحد أكثر من دور، لكن هذا لا يلغي الفرق بين المسؤوليات.

```text
Client → DNS → CDN/WAF → Load Balancer → Reverse Proxy → API Gateway
                                                        ├─ Identity
                                                        ├─ Orders
                                                        └─ Catalog → Cache / DB / Queue
```

ليست كل الطبقات إلزامية. تطبيق صغير قد يستخدم Nginx كتأمين TLS وReverse Proxy أمام تطبيق واحد، بينما منظومة خدمات متعددة قد تحتاج Gateway.

## Forward Proxy

يعمل **Forward Proxy** نيابة عن العميل. يعرف العميل أنه سيرسل اتصالاته إلى الوسيط، ثم يتصل الوسيط بالخارج باسمه. يُستخدم في شبكات الشركات لتطبيق سياسة خروج، وحجب وجهات، وتسجيل الاستخدام، أو التخزين المؤقت.

```text
Employees → Corporate Forward Proxy → Internet servers
```

قد يرى الخادم الخارجي عنوان الوسيط، لكن هذا لا يجعل الاتصال مجهولًا؛ الوسيط نفسه قد يسجل الهوية والوجهة، ويحدد إعداد TLS ما يستطيع فحصه.

## Reverse Proxy

يعمل **Reverse Proxy** نيابة عن الخوادم. يطلب العميل نطاق التطبيق طبيعيًا، فيصل إلى وسيط يختار Upstream ويرسل إليه الطلب. من وظائفه:

- TLS termination وتجديد الشهادات مركزيًا.
- توجيه Paths أو Hosts إلى خدمات مختلفة.
- Compression وCaching وحدود حجم الطلب.
- إضافة Request ID وSecurity Headers.
- إخفاء العناوين الداخلية ومنع الوصول المباشر إليها.

Nginx وHAProxy وEnvoy أمثلة تستطيع أداء بعض هذه الأدوار. الـReverse Proxy لا يصلح تلقائيًا أخطاء Validation والمصادقة والصلاحيات داخل التطبيق.

## Load Balancer

يوزع **Load Balancer** العمل بين نسخ متعددة لرفع السعة والتوافر:

```text
Load Balancer
  ├─ App A: healthy
  ├─ App B: healthy
  └─ App C: unhealthy → removed by health check
```

قد يعمل في Layer 4 على TCP/UDP، أو Layer 7 ويفهم HTTP. من خوارزمياته Round Robin وLeast Connections وConsistent Hashing. ميّز بين **Liveness** التي تسأل هل العملية حية و**Readiness** التي تسأل هل تستطيع استقبال عمل الآن.

إعادة المحاولة بلا حدود تضاعف الضغط على خدمة متعبة. اضبط Timeout وRetry Budget، واجعل العملية Idempotent أو استخدم Idempotency Key عندما يمكن تكرارها.

## API Gateway

الـ**API Gateway** نقطة دخول منظمة لواجهات عدة خدمات، ويركز على سياسات الـAPI. يمكنه:

- مطابقة Routes وإصدارات `/v1` و`/v2`.
- التحقق الأولي من Token وتمرير هوية موثوقة.
- Rate Limits وQuotas حسب المستخدم أو التطبيق.
- تحويل Protocol أو شكل Request/Response.
- تجميع نتائج عدة خدمات لعميل محدد.
- توحيد Metrics وTraces وAccess Logs.

تبقى صلاحية الوصول إلى المورد داخل الخدمة المالكة للبيانات. ولا تضع كل Business Logic في الـGateway؛ وإلا يتحول إلى تطبيق مركزي ضخم وعنق زجاجة للنشر والاختبار.

## مقارنة الأدوار

| المكوّن | يعمل نيابة عن | القرار الأساسي | مثال |
|---|---|---|---|
| Server | الخدمة | كيف يعالج الطلب | تطبيق أو قاعدة بيانات |
| Forward Proxy | العميل | هل وإلى أين يخرج الاتصال | شبكة شركة |
| Reverse Proxy | الخوادم | لأي Upstream يمر الطلب | TLS وتوجيه النطاق |
| Load Balancer | نسخ الخدمة | أي نسخة سليمة تستقبل الحمل | توزيع Workers |
| API Gateway | منظومة APIs | أي API وهوية وسياسة تنطبق | مدخل Microservices |

قد يكون المنتج Reverse Proxy وLoad Balancer معًا، وقد تحتوي منصة Gateway على الدورين. راجع المسؤولية وحدود الثقة والفشل، لا اسم المنتج فقط.

## العناوين الحقيقية والثقة

يضيف الوسطاء `Forwarded` أو `X-Forwarded-For` و`X-Forwarded-Proto`. لا تثق بها من أي اتصال؛ يستطيع العميل تزويرها. امسح القيم غير الموثوقة عند الحافة، واضبط التطبيق على Trusted Proxies معروفة فقط.

لا تمرر Authorization أو Cookies إلى Upstream غير مقصود، وحدد أحجام Headers وBody والمهل، واحم لوحة إدارة الـGateway، واستخدم TLS داخليًا عندما يتطلب Threat Model ذلك.

## الفشل والمراقبة

كل طبقة تضيف زمنًا ونقطة فشل. شغّل أكثر من نسخة للطبقات الحرجة، واستخدم Health Checks واقعية، وانشر Configuration تدريجيًا مع Rollback. مرر Correlation/Trace ID وقس زمن كل Hop ومعدل الأخطاء ورفض Rate Limit وتشبع الاتصالات.

`502 Bad Gateway` يعني غالبًا أن الوسيط لم يحصل على استجابة صالحة من Upstream، و`504 Gateway Timeout` يعني انتهاء مهلة الانتظار. اربط الرمز بسجلات الطرفين والـTrace قبل الحكم.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لديك ثلاث نسخ متطابقة من تطبيق واحد. ما الطبقة المطلوبة أولًا، ولماذا لا تحتاج Gateway بالضرورة؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Load Balancer يختار نسخة سليمة ويوزع الحمل. Gateway مفيد لسياسات APIs أو خدمات متعددة، وليس شرطًا لمجرد تعدد النسخ.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا لا يجوز الثقة مباشرة في <code>X-Forwarded-For</code>؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يستطيع العميل تزويره. تُقبل معلومات العنوان من Proxy موثوق يزيل القيم غير الموثوقة ويضيف ما رآه بنفسه.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ما خطر وضع قواعد الطلبات والمخزون والأسعار كلها في Gateway؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> يتحول إلى Monolith مركزي وعنق زجاجة، وتتسرب ملكية المجال من الخدمات. احتفظ فيه بالسياسات المشتركة فقط.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ظهر <code>504</code>. ما خطوات التشخيص؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> اتبع Trace ID، وقارن مهلة الوسيط بزمن Upstream، وافحص التشبع والخدمات التابعة، وحدد هل اكتمل العمل بعد قطع الاتصال قبل إعادة المحاولة.</div></details></section>
</div>
