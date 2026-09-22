---
title: "الثنائي ولغات البرمجة والخوارزميات"
description: "كل البيانات والتعليمات تنتهي داخل الجهاز في صورة بِتّات. لغات البرمجة تمنحنا مستوى أوضح لكتابة الخوارزمية ثم يحولها مترجم أو مفسر إلى خطوات قابلة للتنفيذ."
tableOfContents: true
---

## الفكرة العامة

كل البيانات والتعليمات تنتهي داخل الجهاز في صورة بِتّات. لغات البرمجة تمنحنا مستوى أوضح لكتابة الخوارزمية ثم يحولها مترجم أو مفسر إلى خطوات قابلة للتنفيذ.

## المفاهيم الأساسية

- البت Bit يأخذ 0 أو 1، وثمانية بِتّات تكوّن Byte.
- العدد الثنائي تمثيل موضعي أساسه 2؛ قيمة الخانة تتحدد بقوة 2.
- النص لا يُخزن كحروف مرئية بل كأرقام وفق ترميز مثل Unicode ثم كبِتّات.
- الخوارزمية خطوات محددة ومنتهية لحل مشكلة، وليست مرتبطة بلغة بعينها.
- اختيار اللغة يعتمد على المجال والمنظومة والأداء والفريق، لا على وجود “أفضل لغة” مطلقًا.

## مثال تطبيقي

الخوارزمية لتحديد نجاح طالب: اقرأ الدرجة، تحقق أنها بين 0 و100، ثم اطبع “ناجح” إذا كانت 50 فأكثر وإلا “راسب”. التحقق يسبق القرار حتى لا نعالج قيمة غير صالحة.

## تصحيح مفاهيم وأخطاء شائعة

- الكود ليس الخوارزمية نفسها؛ هو تنفيذ لها بلغة معينة.
- لا يكفي أن تعمل الخوارزمية مع مثال واحد؛ اختبر الحدود والمدخلات غير الصحيحة.

<div class="lesson-diagram" role="img" aria-label="من المشكلة إلى تعليمات ينفذها الجهاز">
<p class="lesson-diagram-title">من المشكلة إلى تعليمات ينفذها الجهاز</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>المشكلة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>الخوارزمية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>كود المصدر</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Compiler / Interpreter</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>تعليمات قابلة للتنفيذ</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>مثّل العدد 45 بالثنائي ثم اشرح لماذا لا تتغير قيمته.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> 45 = 32+8+4+1، لذلك تمثيله 101101. القيمة واحدة؛ الذي تغير هو الأساس والرموز المستخدمة لكتابتها.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا لا يمكن اعتبار UTF-8 “لغة برمجة” رغم أنه يحول النص إلى بايتات؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> UTF-8 ترميز يحدد تمثيل المحارف، ولا يصف تعليمات أو تحكمًا أو خوارزميات قابلة للتنفيذ مثل لغة البرمجة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>هل الخوارزمية التي تنجح مع مثال واحد تعد صحيحة؟ وضح باختبار مضاد.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا. خوارزمية القسمة قد تنجح مع 10÷2 وتفشل عند المقام صفر؛ يجب تغطية الحدود والمدخلات غير الصالحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>متى تختار مترجمًا Compiler ومتى يهمك Interpreter أو JIT؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الاختيار تابع للمنصة والأداء ودورة التطوير. الترجمة المسبقة تناسب الأداء والتوزيع الثنائي، والتفسير/JIT قد يمنح مرونة وتشغيلًا ديناميكيًا.</div></details>
</section>
</div>

## خلاصة

افهم العلاقة بين الفكرة ومدخلاتها ونتيجتها، ثم اختبرها بحالات عادية وحدّية وغير صالحة. القدرة على التفسير والتطبيق أهم من حفظ الصياغة.
