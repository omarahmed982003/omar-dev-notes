---
title: "التفكير الحاسوبي وتحليل المتطلبات"
description: "التفكير الحاسوبي طريقة منظمة لتحويل مسألة غير واضحة إلى أجزاء وقواعد وخطوات قابلة للتنفيذ والاختبار."
tableOfContents: true
prev: {"link":"/programming-basics/math-problem-solving/08-sets-relations/","label":"المجموعات والعلاقات ومدخلات الدالة"}
next: {"link":"/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees/","label":"الخوارزميات وPseudocode وأشجار القرار"}
sidebar:
  order: 5
---

استخدم القسم بعد [القيم والقرارات والحلقات](/programming-basics/computer-fundamentals/10-decisions-and-repetition/). ارجع للحساب حسب الحاجة؛ الرسوم والتعقيد والبرمجة الديناميكية توسعات لاحقة وليست شروطًا لأول برنامج.



## مطلب واحد يتحول لاختبارات

مطلب ماكينة السحب: «اسمح بسحب مبلغ موجب، من مضاعفات 50، ولا يزيد على الرصيد». افترض رصيدًا 200 وعدم وجود رسوم. **القيود** الحدود التي يجب أن يلتزم بها المدخل.

| المدخل | المتوقع | أي قاعدة نختبر؟ |
|---|---|---|
| 150 | قبول، الباقي 50 | حالة عادية |
| 200 | قبول، الباقي 0 | الحد الأعلى نفسه |
| 250 | رفض | أكبر من الرصيد |
| 0 أو −50 | رفض | المبلغ لازم موجب |
| 75 | رفض | ليس مضاعفًا لـ50 |
| نص غير رقمي | رفض قبل الحساب | نوع المدخل |

قسم الحل إلى قراءة، تحقق، ثم خصم وعرض. الرفض لا يغيّر الرصيد. **حاول:** أضف رسمًا ثابتًا 10 لكل سحب؛ حالة 200 تصبح مرفوضة لأن التكلفة 210. تغيير المطلب يغيّر الاختبار قبل الكود.

## الفكرة العامة

التفكير الحاسوبي طريقة منظمة لتحويل مسألة غير واضحة إلى أجزاء وقواعد وخطوات قابلة للتنفيذ والاختبار.

## المفاهيم الأساسية

- التفكيك Decomposition يقسم المشكلة إلى مهام أصغر يمكن فهمها.
- التعرف على الأنماط يعيد استخدام حلول سابقة بدل البدء من الصفر.
- التجريد يحتفظ بالتفاصيل المؤثرة ويؤجل التفاصيل غير المهمة.
- تصميم الخوارزمية يرتب الخطوات ويحدد القرارات والتكرار.
- تحليل المتطلبات يحدد المدخلات والقواعد والحالات الحدية والمخرجات ومعايير النجاح.

## مثال تطبيقي

في ماكينة ATM (Automated Teller Machine؛ ماكينة الصراف الآلي): افصل التحقق من البطاقة، التحقق من الرقم السري، اختيار العملية، فحص الرصيد والحد اليومي، تنفيذ السحب، ثم تحديث الرصيد وإصدار الإيصال.

## تصحيح مفاهيم وأخطاء شائعة

- لا تبدأ بالكود قبل معرفة حالات الرفض والحدود.
- المتطلب الغامض مثل “سريع” يحتاج معيارًا قابلًا للقياس.

<div class="lesson-diagram" role="img" aria-label="خط التفكير الحاسوبي من المشكلة إلى حل قابل للاختبار">
<p class="lesson-diagram-title">خط التفكير الحاسوبي من المشكلة إلى حل قابل للاختبار</p>
<div class="diagram-flow diagram-pipeline">
<div class="diagram-node input"><span>المتطلبات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>التفكيك</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>اكتشاف الأنماط</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>التجريد</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>تصميم الخوارزمية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>اختبار الحل</span></div>
</div>
</div>

## حوّل طلبًا صغيرًا لحاجة تقدر تختبرها

في قائمة المشتريات، عبارة «اقبل كمية» مش كفاية. نحدد عددًا صحيحًا من 1 إلى 100. نقسم المهمة: قراءة النص، رفض الفراغ، التحويل لعدد، فحص الحدود، ثم الإضافة. جرّب 0 و1 و100 و101 و2.5؛ المقبول 1 و100 فقط. فصل الخطوات يخليك تعرف أول مرحلة حصل فيها الخطأ.

مقارنة كلفة التشغيل وأنماط الحل لها مكان لاحق في [مقارنة الخوارزميات](/programming-basics/08-problem-solving-algorithms/). نتيجة الدرس الحالي مسألة واضحة واختبارات تتوقع ناتجها بنفسك.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين التفكيك والتجريد؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> التفكيك يقسم النظام إلى مشكلات أصغر، أما التجريد فيختار التفاصيل المؤثرة ويخفي ما لا يحتاجه الحل الحالي.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>في نظام حجز، ما متطلب غامض يجب تحويله إلى معيار قابل للاختبار؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> “النظام سريع” غامض. صياغة قابلة للاختبار: 95% من عمليات البحث تستجيب خلال أقل من 500ms تحت حمل محدد.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>كيف يمنع اكتشاف الأنماط تكرار الحل؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يكشف بنية مشتركة مثل التحقق ثم القرار ثم التسجيل، فتُبنى وظيفة أو قاعدة عامة بدل نسخ منطق منفصل لكل حالة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حلل سحب ATM إلى وحدات وحدد أهم حالة حدية.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الوحدات: تحقق البطاقة والPIN (Personal Identification Number؛ رقم سري للتحقق من صاحب البطاقة أو الجهاز)، اختيار المبلغ، فحص الرصيد والحد، الصرف، التحديث، الإيصال. حالة حدية مهمة: مبلغ يساوي الرصيد أو الحد اليومي بالضبط.</div></details>
</section>
</div>
