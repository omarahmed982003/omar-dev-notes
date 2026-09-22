---
title: "الخوارزميات وPseudocode وأشجار القرار"
description: "الـPseudocode وشجرة القرار تمثيلان للتفكير قبل الكود: الأول يوضح تسلسل الخطوات، والثانية توضح مسارات القرارات المتفرعة."
tableOfContents: true
---

## الفكرة العامة

الـPseudocode وشجرة القرار تمثيلان للتفكير قبل الكود: الأول يوضح تسلسل الخطوات، والثانية توضح مسارات القرارات المتفرعة.

## المفاهيم الأساسية

- الخوارزمية الجيدة لها مدخلات واضحة، خطوات غير ملتبسة، نهاية، ومخرجات صحيحة.
- استخدم أسماء تعبّر عن المعنى بدل x وy في مسائل الأعمال.
- الـPseudocode لا يلتزم بصياغة لغة، لكنه يجب أن يظل دقيقًا.
- شجرة القرار مناسبة عندما تقود الإجابات إلى حالات نهائية متعددة.
- رتّب التحقق من العام إلى الخاص، ومن رفض المدخل غير الصالح إلى قواعد العمل.

## مثال تطبيقي

إيجاد الأكبر بين ثلاثة أعداد: ابدأ بالعدد الأول كأكبر قيمة، قارنه بالثاني وحدّثه عند الحاجة، ثم كرر مع الثالث. هذه الطريقة أبسط من كتابة كل التركيبات الممكنة.

## تصحيح مفاهيم وأخطاء شائعة

- شجرة القرار الكبيرة قد تصبح صعبة الصيانة؛ اجمع القواعد المتشابهة وسمِّ الشروط.
- لا تجعل مسارًا بلا نتيجة أو تترك حالة ممكنة دون معالجة.

<div class="lesson-diagram" role="img" aria-label="شجرة قرار مبسطة تبدأ بالتحقق قبل قواعد العمل">
<p class="lesson-diagram-title">شجرة قرار مبسطة تبدأ بالتحقق قبل قواعد العمل</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>اقرأ المدخلات</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>هل المدخل صالح؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>هل تتحقق القاعدة؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>نفّذ الإجراء</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>اعرض النتيجة</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا طريقة “ابدأ بالأول كأكبر قيمة ثم حدّثه” أفضل من تعداد ترتيبات ثلاثة أعداد؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تحتاج مقارنتين فقط وتتوسع لأي عدد من القيم، بينما تعداد الترتيبات يزداد بسرعة ويصعب التحقق منه.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>متى تصبح شجرة القرار اختيارًا سيئًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عندما تتكاثر الفروع والقواعد المشتركة فتتكرر العقد. عندها يفيد جدول قرار أو قواعد مسماة أو State Machine.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>ما الخصائص الأربع التي يجب إثباتها في خوارزمية جيدة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> وضوح المدخلات والمخرجات، دقة الخطوات، الانتهاء في وقت محدود، والصحة لكل الحالات الواقعة داخل المتطلبات.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>رتب فحوص خصم يعتمد على صلاحية السعر والعضوية وقيمة الطلب.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تحقق من صلاحية السعر أولًا، ثم احسب الأهلية، ثم طبق قاعدة العضوية والحد المالي. لا تسمح لمدخل غير صالح بالدخول في حساب الخصم.</div></details>
</section>
</div>

## خلاصة

افهم العلاقة بين الفكرة ومدخلاتها ونتيجتها، ثم اختبرها بحالات عادية وحدّية وغير صالحة. القدرة على التفسير والتطبيق أهم من حفظ الصياغة.
