---
title: 8. قائمة مراجعة OOP
description: قائمة أسئلة وتمرين يجمع التغليف والواجهات والتركيب والحقن والاختبار.
sidebar:
  order: 8
---

# قائمة مراجعة OOP

قبل اعتماد تصميم اسأل:

- هل لكل class مسؤولية واضحة واسم من مجال المشروع؟
- هل constructor ينتج object صالحًا؟
- هل الـproperties محمية بأقل visibility؟
- هل الوراثة تعبّر عن is-a حقيقية، أم composition أوضح؟
- هل الواجهة صغيرة ويحتاجها المستدعي فعلًا؟
- هل الـTrait صغيرة ولا تخفي dependencies؟
- هل static state ستعقّد الاختبار أو workers طويلة العمر؟
- هل readonly تحمي المرجع فقط أم نحتاج deep immutability؟
- هل Magic Method تحسن API فعلًا أم تخفي typo؟
- هل الاعتماديات صريحة وقابلة للاستبدال في الاختبار؟

## تمرين جامع

صمّم Checkout:

1. `Order` يحمي حالته ولا يسمح بالدفع مرتين.
2. `PaymentGateway` interface لها تنفيذ fake للاختبار.
3. `Receipt` و`Money` كـreadonly value objects.
4. `OrderService` يستقبل gateway وrepository وclock بالـDI.
5. أضف notification بالـcomposition لا بجعل Order ترث Email.
6. اختبر نجاح الدفع، فشل المزود، والطلب المدفوع مسبقًا.

إذا احتجت `instanceof` متكررًا أو setters كثيرة أو Service Locator، عد لمراجعة حدود الكائنات والعقود.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: قائمة مراجعة OOP">
<p class="lesson-diagram-title">خريطة مفاهيم: قائمة مراجعة OOP</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>تمرين جامع</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>هل لكل class مسؤولية واضحة واسم من مجال</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>تصميم العقود والاعتماديات القابلة للاختبار</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>اختبار النجاح والفشل وتكرار العملية</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «تمرين جامع» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> صمّم Checkout: Order يحمي حالته ولا يسمح بالدفع مرتين. PaymentGateway interface لها تنفيذ fake للاختبار. Receipt وMoney كـreadonly value objects. OrderService يستقبل gateway وrepository وclock بالـDI. أضف notification بالـcomposition لا بجعل Order ترث Email. اختبر نجاح الدفع، فشل المزود، والطلب المدفوع مسبقًا. إذا احتجت instanceof متكررًا أو setters كثيرة أو Service Locator، عد لمراجعة حدود الكائنات والعقود. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «تمرين جامع» و«هل لكل class مسؤولية واضحة واسم من مجال». لماذا لا يغني أحدهما عن الآخر داخل موضوع «قائمة مراجعة OOP»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «تمرين جامع»: صمّم Checkout: Order يحمي حالته ولا يسمح بالدفع مرتين. PaymentGateway interface لها تنفيذ fake للاختبار. Receipt وMoney كـreadonly value objects. OrderService يستقبل gateway وrepository وclock بالـDI. أضف notification بالـcomposition لا بجعل Order ترث Email. اختبر نجاح الدفع، فشل المزود، والطلب المدفوع مسبقًا. إذا احتجت instanceof متكررًا أو setters كثيرة أو Service Locator، عد لمراجعة حدود الكائنات والعقود. أما «هل لكل class مسؤولية واضحة واسم من مجال»: هل لكل class مسؤولية واضحة واسم من مجال المشروع؟ هل constructor ينتج object صالحًا؟ هل الـproperties محمية بأقل visibility؟ هل الوراثة تعبّر عن is-a حقيقية، أم composition أوضح؟ هل الواجهة صغيرة ويحتاجها المستدعي فعلًا؟ هل الـTrait صغيرة ولا تخفي dependencies؟ هل static state ستعقّد الاختبار أو workers طويلة العمر؟ هل readonly تحمي المرجع فقط أم نحتاج deep immutability؟ هل Magic Method تحسن API فعلًا أم تخفي typo؟… العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «تصميم العقود والاعتماديات القابلة للاختبار». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> قائمة أسئلة وتمرين يجمع التغليف والواجهات والتركيب والحقن والاختبار. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «اختبار النجاح والفشل وتكرار العملية» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> قائمة أسئلة وتمرين يجمع التغليف والواجهات والتركيب والحقن والاختبار. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
