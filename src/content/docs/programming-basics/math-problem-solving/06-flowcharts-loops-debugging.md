---
title: "المخططات الانسيابية والحلقات والتصحيح"
description: "المخطط الانسيابي يوضح حركة التنفيذ بصريًا، والحلقات تمثل التكرار، والتتبّع Debugging يقارن ما حدث بما كان يجب أن يحدث."
tableOfContents: true
prev: {"link":"/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees/","label":"الخوارزميات وPseudocode وأشجار القرار"}
next: {"link":"/programming-basics/08-problem-solving-algorithms/","label":"مقارنة الخوارزميات وطرق تنظيم البيانات"}
sidebar:
  order: 7
---

استخدم القسم بعد [القيم والقرارات والحلقات](/programming-basics/computer-fundamentals/10-decisions-and-repetition/). ارجع للحساب حسب الحاجة؛ الرسوم والتعقيد والبرمجة الديناميكية توسعات لاحقة وليست شروطًا لأول برنامج.


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

<div class="lesson-diagram" role="img" aria-label="فحص الشرط: نعم تعيد الدورة إلى الفحص، ولا تخرج">
<p class="lesson-diagram-title">مساران واضحان من الشرط</p>
<div class="diagram-flow">
<div class="diagram-node start"><span>ابدأ: sum=0 وi=1</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>i ≤ N?</span></div>
</div>
<div class="diagram-branches">
<div class="diagram-node process"><span>نعم: اجمع i، ثم زوّد i بواحد، ثم ارجع لفحص i≤N</span></div>
<div class="diagram-node output"><span>لا: اطبع sum ثم انتهِ</span></div>
</div>
</div>

## امشِ مع الحلقة دورة بدورة

**Counter — عدّاد** يعد مرات، زي attempts لعدد المحاولات. **Accumulator — قيمة تتجمع** زي sum لمجموع الأسعار. **Sentinel — علامة توقف** قيمة متفق عليها، مثل كلمة "stop" لإنهاء الإدخال؛ لازم نختار علامة لا تتعارض مع البيانات المسموحة.

في جمع1 إلىN، نفترض أن N عدد صحيح غير سالب:

| قبل فحص الشرط | i | sum | هل i≤3؟ | بعد الدورة |
|---|---:|---:|---|---|
| البداية |1|0|نعم|sum=1، i=2|
| الثانية |2|1|نعم|sum=3، i=3|
| الثالثة |3|3|نعم|sum=6، i=4|
| الرابعة |4|6|لا|اخرج واطبع6|

التحديث يرجع لفحص الشرط؛ الخروج فرع «لا» من الشرط نفسه. مع N=0 لا ندخل جسم الحلقة والناتج0؛ مع N=1 الناتج1. **Off-by-one — خطأ بزيادة أو نقص دورة واحدة** مثل استخدام i<N بدل i≤N؛ عند N=3 الناتج3 لأننا أسقطنا3.

**تدريب محلول:** لو نسينا i=i+1 وكان N≥1، يظل الشرط صحيحًا ويتكرر الجسم بلا نهاية. راقب i في جدول التتبع أو بأداة إيقاف التنفيذ خطوة بخطوة، ثم أعد اختبار0 و1 و3.

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
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> راجع البداية والحدود: ربما بدأ sum بقيمة N أو جُمعت N مرتين. الشرط i&lt;=N+1 يضيف N+1، مش N؛ لما N=3 الصحيح 6، ومع الدورة الرابعة الناتج 10 والزيادة 4. جدول التتبع يكشف أول دورة انحرفت.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>صمّم تسجيل دخول بثلاث محاولات دون خطأ off-by-one.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ابدأ attempts=0، وبعد كل فشل زدها، وكرر ما دام غير ناجح وattempts&lt;3. اختبر النجاح الأول والثالث وثلاثة إخفاقات.</div></details>
</section>
</div>
