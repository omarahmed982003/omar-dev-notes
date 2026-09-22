---
title: "التفكير الحاسوبي وتحليل المتطلبات"
description: "التفكير الحاسوبي طريقة منظمة لتحويل مسألة غير واضحة إلى أجزاء وقواعد وخطوات قابلة للتنفيذ والاختبار."
tableOfContents: true
---

## الفكرة العامة

التفكير الحاسوبي طريقة منظمة لتحويل مسألة غير واضحة إلى أجزاء وقواعد وخطوات قابلة للتنفيذ والاختبار.

## المفاهيم الأساسية

- التفكيك Decomposition يقسم المشكلة إلى مهام أصغر يمكن فهمها.
- التعرف على الأنماط يعيد استخدام حلول سابقة بدل البدء من الصفر.
- التجريد يحتفظ بالتفاصيل المؤثرة ويؤجل التفاصيل غير المهمة.
- تصميم الخوارزمية يرتب الخطوات ويحدد القرارات والتكرار.
- تحليل المتطلبات يحدد المدخلات والقواعد والحالات الحدية والمخرجات ومعايير النجاح.

## مثال تطبيقي

في ماكينة ATM: افصل التحقق من البطاقة، التحقق من الرقم السري، اختيار العملية، فحص الرصيد والحد اليومي، تنفيذ السحب، ثم تحديث الرصيد وإصدار الإيصال.

## تصحيح مفاهيم وأخطاء شائعة

- لا تبدأ بالكود قبل معرفة حالات الرفض والحدود.
- المتطلب الغامض مثل “سريع” يحتاج معيارًا قابلًا للقياس.

<div class="lesson-diagram" role="img" aria-label="خط التفكير الحاسوبي من المشكلة إلى حل قابل للاختبار">
<p class="lesson-diagram-title">خط التفكير الحاسوبي من المشكلة إلى حل قابل للاختبار</p>
<div class="diagram-flow">
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
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الوحدات: تحقق البطاقة والPIN، اختيار المبلغ، فحص الرصيد والحد، الصرف، التحديث، الإيصال. حالة حدية مهمة: مبلغ يساوي الرصيد أو الحد اليومي بالضبط.</div></details>
</section>
</div>

## خلاصة

افهم العلاقة بين الفكرة ومدخلاتها ونتيجتها، ثم اختبرها بحالات عادية وحدّية وغير صالحة. القدرة على التفسير والتطبيق أهم من حفظ الصياغة.
