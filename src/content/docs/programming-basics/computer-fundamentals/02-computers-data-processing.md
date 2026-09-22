---
title: "الكمبيوتر والبيانات ودورة المعالجة"
description: "الكمبيوتر نظام يستقبل بيانات، ينفذ عليها تعليمات، ينتج نتيجة، وقد يحفظها. فهم هذه الدورة يربط بين البرنامج والذاكرة والمعالج وأجهزة الإدخال والإخراج."
tableOfContents: true
---

## الفكرة العامة

الكمبيوتر نظام يستقبل بيانات، ينفذ عليها تعليمات، ينتج نتيجة، وقد يحفظها. فهم هذه الدورة يربط بين البرنامج والذاكرة والمعالج وأجهزة الإدخال والإخراج.

## المفاهيم الأساسية

- البيانات حقائق خام؛ المعلومات بيانات جرى تنظيمها أو تفسيرها؛ والمعرفة هي القدرة على استخدامها لاتخاذ قرار.
- Hardware هو المكوّن المادي، وSoftware هو التعليمات التي تدير هذا المكوّن.
- البرنامج سلسلة تعليمات، أما العملية Process فهي نسخة من برنامج قيد التنفيذ.
- الذاكرة RAM سريعة ومؤقتة، بينما التخزين دائم نسبيًا وأبطأ.
- نموذج IPO يبسّط أي برنامج إلى مدخلات ومعالجة ومخرجات، مع تخزين عند الحاجة.

## مثال تطبيقي

عند إرسال رسالة: لوحة المفاتيح تنتج Input، التطبيق يعالج النص ويشفّره، الشبكة تنقله، ثم يظهر Output عند المستلم وقد يُحفظ في Storage.

## تصحيح مفاهيم وأخطاء شائعة

- المعالج لا “يفهم” نية المستخدم؛ ينفذ تعليمات محددة فقط.
- الملف على القرص لا يصبح برنامجًا يعمل إلا بعد تحميله وتشغيله.

<div class="lesson-diagram" role="img" aria-label="دورة معالجة البيانات داخل الكمبيوتر">
<p class="lesson-diagram-title">دورة معالجة البيانات داخل الكمبيوتر</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>إدخال البيانات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>المعالجة في CPU/RAM</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>إخراج النتيجة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node start"><span>الحفظ عند الحاجة</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين البرنامج والـProcess، ومتى يمكن أن توجد عدة Processes للبرنامج نفسه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> البرنامج تعليمات مخزنة، والـProcess نسخة عاملة لها ذاكرة وحالة. فتح التطبيق أكثر من مرة أو تشغيل عدة Workers ينشئ عمليات متعددة من البرنامج نفسه.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>تتبّع إرسال صورة وحدد مثالًا للبيانات والمعلومة والمعرفة.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> البايتات بيانات، والصورة المعروضة مع اسم المرسل معلومة، والاستنتاج أن الملف موثوق أو يحتاج ردًا معرفة مبنية على السياق.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا لا يعد التخزين بديلًا عن RAM رغم أنه يحتفظ بالبيانات؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> التخزين أبطأ ومصمم للاستمرار، بينما RAM مساحة العمل السريعة للبرنامج. ينقل النظام الأجزاء النشطة من التخزين إلى الذاكرة قبل التنفيذ.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>إذا كانت المخرجات خاطئة والمدخلات صحيحة، فأين تبدأ التشخيص في نموذج IPO؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> افحص خطوات المعالجة وحالة البرنامج الوسيطة أولًا، ثم تحقق من أن المخرجات تعرض القيمة الصحيحة لا نسخة قديمة أو منسقة خطأ.</div></details>
</section>
</div>

## خلاصة

افهم العلاقة بين الفكرة ومدخلاتها ونتيجتها، ثم اختبرها بحالات عادية وحدّية وغير صالحة. القدرة على التفسير والتطبيق أهم من حفظ الصياغة.
