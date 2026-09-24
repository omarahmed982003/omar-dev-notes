---
title: "المخططات الانسيابية والحلقات والتصحيح"
description: "المخطط الانسيابي يوضح حركة التنفيذ بصريًا، والحلقات تمثل التكرار، والتتبّع Debugging يقارن ما حدث بما كان يجب أن يحدث."
tableOfContents: true
---

## الفكرة العامة

المخطط الانسيابي يوضح حركة التنفيذ بصريًا، والحلقات تمثل التكرار، والتتبّع Debugging يقارن ما حدث بما كان يجب أن يحدث.

## المفاهيم الأساسية

- البداية/النهاية بيضاوية، العملية مستطيل، القرار مُعيّن، والإدخال/الإخراج متوازي أضلاع.
- كل قرار يجب أن يوضح فروعه، وغالبًا يكونان نعم/لا.
- الحلقة تحتاج بداية وشرط استمرار وتحديثًا؛ غياب التحديث سبب شائع للحلقة اللانهائية.
- Counter يعدّ العناصر، وAccumulator يجمع قيمها، وSentinel ينهي الإدخال بقيمة خاصة.
- التتبّع اليدوي يسجل قيمة المتغيرات عند كل دورة ويكشف الأخطاء المنطقية.

## مثال تطبيقي

لحساب مجموع `1..N`: ابدأ بـ`sum = 0` و`i = 1`، وكرر ما دام `i <= N`: أضف `i` إلى `sum` ثم زد `i`. بعد انتهاء الحلقة اطبع `sum`.

## تصحيح مفاهيم وأخطاء شائعة

- المخطط يشرح المنطق لكنه لا يعوض اختبار الكود.
- البرنامج الذي يعمل بلا رسالة خطأ قد يظل خطأ منطقيًا.

<div class="lesson-diagram" role="img" aria-label="مسار الحلقة: التحديث يعيد التنفيذ إلى فحص الشرط">
<p class="lesson-diagram-title">مسار الحلقة: التحديث يعيد التنفيذ إلى فحص الشرط</p>
<div class="diagram-flow">
<div class="diagram-node start"><span>ابدأ وعيّن القيم</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>هل الشرط صحيح؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>نفّذ جسم الحلقة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>حدّث الحالة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>اخرج عند فشل الشرط</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>ما العناصر الثلاثة التي يجب مراجعتها لمنع حلقة لا نهائية؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> قيمة البداية، وشرط الاستمرار، والتحديث في كل مسار. يجب أن يجعل التحديث الحالة أقرب إلى توقف الشرط.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ما الفرق بين Counter وAccumulator وSentinel؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Counter يعد الأحداث، وAccumulator يجمع قيمًا، وSentinel قيمة خاصة تنهي الإدخال ولا تدخل عادة في الحساب.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>حلقة تجمع 1..N أعادت قيمة أكبر من المتوقع بـN. ما الاشتباه الأول؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> راجع البداية والحدود: ربما بدأ sum بقيمة N أو استخدم الشرط i&lt;=N+1. جدول التتبع يكشف أول دورة انحرفت.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>صمّم تسجيل دخول بثلاث محاولات دون خطأ off-by-one.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ابدأ attempts=0، وبعد كل فشل زدها، وكرر ما دام غير ناجح وattempts&lt;3. اختبر النجاح الأول والثالث وثلاثة إخفاقات.</div></details>
</section>
</div>

## خلاصة

افهم العلاقة بين الفكرة ومدخلاتها ونتيجتها، ثم اختبرها بحالات عادية وحدّية وغير صالحة. القدرة على التفسير والتطبيق أهم من حفظ الصياغة.
