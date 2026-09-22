---
title: "الصيغ والتمارين وتتبع الناتج"
description: "تحويل الصيغة إلى برنامج يمر بثلاث مراحل: فهم الوحدات، كتابة العلاقة، ثم اختبار النتيجة بقيم يمكن حسابها يدويًا."
tableOfContents: true
---

## الفكرة العامة

تحويل الصيغة إلى برنامج يمر بثلاث مراحل: فهم الوحدات، كتابة العلاقة، ثم اختبار النتيجة بقيم يمكن حسابها يدويًا.

## المفاهيم التي تحتاجها

- سمِّ المتغيرات بحسب معناها ووحدتها.
- ضع الأقواس لتطابق الصيغة الرياضية.
- تحقق من المقام قبل القسمة.
- صيغة مجموع 1..n هي n(n+1)/2 ويمكن مقارنتها بحلقة للتحقق.
- العامل الثلاثي مناسب لاختيار قصير، وليس لتفرعات معقدة متداخلة.

## مثال

```cpp
double celsius{25.0};
double fahrenheit = celsius * 9.0 / 5.0 + 32.0;
int n{100};
long long sum = 1LL * n * (n + 1) / 2;
```

## أخطاء شائعة وتصحيحات

- استخدام 9/5 قبل التحويل يعطي 1 بسبب القسمة الصحيحة.
- قد يحدث overflow في الضرب قبل تخزين النتيجة في نوع أوسع؛ وسّع أحد العوامل أولًا.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الصيغ والتمارين وتتبع الناتج">
<p class="lesson-diagram-title">خريطة مفاهيم: الصيغ والتمارين وتتبع الناتج</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>الفكرة العامة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>المفاهيم التي تحتاجها</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>أخطاء شائعة وتصحيحات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الخلاصة</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الخطأ في fahrenheit = celsius*9/5+32 إذا كانت القيم int؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الضرب قبل القسمة قد يحفظ بعض الدقة لكن الناتج يظل صحيحًا فقط لمدخلات معينة؛ استخدم 9.0/5.0 ونوع double.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>كيف تتحقق من صيغة مجموع 1..n دون افتراض صحتها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> قارنها بحلقة لقيم صغيرة وحدود مثل 0 و1، ثم برهنها مثل pairing أو induction.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا يجب حفظ الوحدات في أسماء المتغيرات؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لمنع جمع أو مقارنة كميات غير متوافقة، مثل milliseconds مع seconds، ولتوضيح التحويل المطلوب.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>متى يصبح ternary أسوأ من if؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما تتعدد الشروط أو الآثار الجانبية أو يتداخل ternary؛ الوضوح والصيانة أهم من قصر السطر.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
