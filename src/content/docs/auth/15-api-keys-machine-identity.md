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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: API Keys وهوية الأنظمة">
<p class="lesson-diagram-title">خريطة مفاهيم: API Keys وهوية الأنظمة</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>API key ليست هوية مستخدم</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>شكل وتخزين</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>صلاحيات ودورة حياة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Rate limits وService Accounts</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>mTLS</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «API key ليست هوية مستخدم» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> المفتاح يعرّف application أوintegration غالبًا، ولا يثبت وحده المستخدم النهائي أو التفويض المفوض مثل OAuth. اربطه بـprincipal واضح مع owner وpurpose وبيئة وصلاحيات. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «API key ليست هوية مستخدم» و«شكل وتخزين». لماذا لا يغني أحدهما عن الآخر داخل موضوع «API Keys وهوية الأنظمة»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «API key ليست هوية مستخدم»: المفتاح يعرّف application أوintegration غالبًا، ولا يثبت وحده المستخدم النهائي أو التفويض المفوض مثل OAuth. اربطه بـprincipal واضح مع owner وpurpose وبيئة وصلاحيات. أما «شكل وتخزين»: استخدم prefix يوضح النوع ومعرفًا عامًا وسرًا عشوائيًا: ابحث بالمعرف، وخزّن hash للسر: الـprefix يساعد secret scanners والدعم، لكنه ليس سرًا. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «صلاحيات ودورة حياة». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> scopes صغيرة وdeny-by-default. expiry عند الإمكان. last-used metadata بلا body حساس. rotation بفترة overlap قصيرة. revoke فوري. مفاتيح منفصلة لكل نظام وبيئة. أرسل key في Authorization header أو header مخصص عبر TLS، لا query string. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Rate limits وService Accounts» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> طبّق quota لكل key/tenant. IP allow-list طبقة إضافية وليست هوية وحدها. امنح الحساب الآلي أقل صلاحية واربط actions به في audit trail. فضّل credentials قصيرة العمر بدل ملفات keys ثابتة عند توفر workload identity. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
