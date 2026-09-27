---
title: "النسب والمتوسط والقوى"
description: "النسب والمتوسط والقوى"
tableOfContents: true
prev: false
next: {"link":"/programming-basics/math-problem-solving/07-division-and-precision/","label":"القسمة والباقي ودقة الحساب"}
sidebar:
  order: 1
---

استخدم القسم بعد [القيم والقرارات والحلقات](/programming-basics/computer-fundamentals/10-decisions-and-repetition/). ارجع للحساب حسب الحاجة؛ الرسوم والتعقيد والبرمجة الديناميكية توسعات لاحقة وليست شروطًا لأول برنامج.



## حساب واحد بمعنى واضح

ثلاث كراسات سعر الواحدة 20: الإجمالي `3×20=60`. خصم 10% يعني `60×10÷100=6`، فتدفع 54. **تمرين:** لو السعر 30 والكمية 2، هل يتغير الإجمالي؟ لا؛ يفضل 60. القوة `2³` تساوي `2×2×2=8`، والجذر `√25=5` لأن `5×5=25`. لا تخلط رمز النسبة % في الكلام بمعامل الباقي في كود لغة معينة.

## الفكرة العامة

العمليات الحسابية الأساسية تظهر مباشرة في البرامج: الباقي، النسب، المتوسطات، القوى، الجذور، وترتيب التنفيذ. المهم هو ربط الصيغة بمعنى المسألة قبل حسابها.

## المفاهيم الأساسية

- الباقي يساعد في الزوجي والفردي، الدورات، وتقسيم الوقت.
- النسبة المئوية جزء من 100؛ قيمة الخصم = السعر × النسبة ÷ 100.
- المعدل يقارن كميتين بوحدتين مختلفتين، مثل كم/ساعة.
- المتوسط الحسابي = مجموع القيم ÷ عددها، ويتأثر بالقيم المتطرفة.
- الأقواس ثم القوى ثم الضرب والقسمة ثم الجمع والطرح؛ الضرب والقسمة في المستوى نفسه يُجمعان من اليسار، وكذلك الجمع والطرح. لكن القوى ومعاملات البرمجة لها قواعد ارتباط مختلفة؛ اكتب أقواسًا عندما يلتبس المقصود.

## مثال تطبيقي

سعر منتج 800 وخصمه 15%: الخصم 120 والسعر النهائي 680. لا تطرح 15 مباشرة لأن 15 هنا نسبة وليست مبلغًا.

## تصحيح مفاهيم وأخطاء شائعة

- لا تستخدم قسمة صحيحة عندما تحتاج كسورًا.
- اكتب الوحدات بجوار القيم لتكتشف الصيغ غير المنطقية.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الأساس الرياضي: الباقي والنسب والمتوسط والقوى">
<p class="lesson-diagram-title">خريطة مفاهيم: الأساس الرياضي: الباقي والنسب والمتوسط والقوى</p>
<div class="diagram-flow diagram-grid">
<div class="diagram-node input"><span>قيمة ومعناها</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>اختر العملية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>احسب مع الوحدات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>اختبر الصفر والحدود</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>فسّر النتيجة</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا يعطي 9/5 نتيجة خاطئة في بعض اللغات عند تحويل الحرارة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> إذا كان الطرفان صحيحين تنفذ قسمة صحيحة فتصبح النتيجة 1. استخدم 9.0/5.0 أو حوّل أحد الطرفين إلى نوع عشري.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>منتج سعره 800 خُصم 15% ثم أضيفت ضريبة 15%. هل يعود إلى 800؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا؛ الخصم يعطي 680، والضريبة عليه 102، فيصبح 782. النسبتان تطبقان على أساسين مختلفين.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى يكون المتوسط الحسابي مضللًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عند وجود قيم متطرفة أو توزيع غير متوازن؛ قد يكون الوسيط أو توزيع القيم أكثر تعبيرًا من المتوسط وحده.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل 10,000 ثانية إلى ساعات ودقائق وثوانٍ باستخدام القسمة والباقي.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الساعات 10000÷3600 = 2، والباقي 2800. الدقائق 2800÷60 = 46، والباقي 40؛ النتيجة 2:46:40.</div></details>
</section>
</div>

## الخطوة التالية

كمّل في [القسمة والباقي ودقة الحساب](/programming-basics/math-problem-solving/07-division-and-precision/) بعد تنفيذ التجربة هنا.
