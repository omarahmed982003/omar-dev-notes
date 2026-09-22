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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Rate Limiting ومقاومة الإساءة">
<p class="lesson-diagram-title">خريطة مفاهيم: Rate Limiting ومقاومة الإساءة</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>ما الذي نحده؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الخوارزميات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>استجابة HTTP</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Login وCredential Stuffing</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>CAPTCHA وRisk</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «ما الذي نحده؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تعتمد على IP فقط؛ قد يشترك مستخدمون في NAT وقد يوزع المهاجم الطلبات. كوّن مفاتيح حسب العملية: login: account + IP/network + device signals. password reset: account/contact + IP. API: key + tenant + endpoint. expensive search: user + query cost. ضع حدودًا أقسى للفشل والعمليات المكلفة، مع حد عالمي يحمي السعة. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «ما الذي نحده؟» و«الخوارزميات». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Rate Limiting ومقاومة الإساءة»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «ما الذي نحده؟»: لا تعتمد على IP فقط؛ قد يشترك مستخدمون في NAT وقد يوزع المهاجم الطلبات. كوّن مفاتيح حسب العملية: login: account + IP/network + device signals. password reset: account/contact + IP. API: key + tenant + endpoint. expensive search: user + query cost. ضع حدودًا أقسى للفشل والعمليات المكلفة، مع حد عالمي يحمي السعة. أما «الخوارزميات»: | الأسلوب | الفكرة | |---|---| | Fixed window | عداد داخل فترة؛ بسيط وله burst عند الحدود | | Sliding log/window | أدق وأعلى تكلفة | | Token bucket | tokens تتجدد وتسمح burst مضبوط | | Leaky bucket | يصقل معدل الخروج | يجب أن تكون العملية atomic في التخزين المشترك عند تعدد الخوادم. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «استجابة HTTP». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تكشف هل username موجود. أضف delay/backoff بحذر دون حجز workers طويلًا. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Login وCredential Stuffing» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تستخدم lockout دائمًا يسمح للمهاجم بقفل حساب الضحية. استخدم progressive delay وحدودًا متعددة. راقب passwords مسربة وفق سياسة الخصوصية. MFA/Passkeys تقللان أثر password المسروقة. أخطر المستخدم عند نشاط غير معتاد. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
