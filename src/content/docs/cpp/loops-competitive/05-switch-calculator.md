---
pagefind: false
title: "switch وتطبيق الآلة الحاسبة"
description: "الآلة الحاسبة مثال مناسب لاختيار العملية بـswitch، بشرط فصل قراءة البيانات والتحقق من تنفيذ العملية ومعالجة القسمة على صفر."
tableOfContents: true
---

## اختيار عملية الحاسبة

الآلة الحاسبة مثال مناسب لاختيار العملية بـswitch، بشرط فصل قراءة البيانات والتحقق من تنفيذ العملية ومعالجة القسمة على صفر.

## case وbreak وفحص القسمة

- اقرأ العددين ورمز العملية وتحقق من نجاح الإدخال.
- كل case تنفذ عملية واحدة ثم break.
- تحقق من المقام داخل حالة القسمة.
- default يرفض العملية غير المعروفة.
- إذا زادت العمليات، يمكن نقل كل عملية إلى دالة واستخدام تصميم أكثر قابلية للتوسع.

## مثال: حاسبة باستخدام switch

```cpp
switch (op) {
case '+': std::cout << a + b; break;
case '-': std::cout << a - b; break;
case '*': std::cout << a * b; break;
case '/':
    if (b == 0) std::cout << "Cannot divide by zero";
    else std::cout << a / b;
    break;
default: std::cout << "Unsupported operation";
}
```

## أخطاء Fall-through والقسمة على صفر

- إن كان a وb من int فالقسمة صحيحة؛ استخدم double إذا أردت كسرًا.
- لا تعتمد على fall-through دون قصد موثق.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: switch وتطبيق الآلة الحاسبة">
<p class="lesson-diagram-title">خريطة مفاهيم: switch وتطبيق الآلة الحاسبة</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>الرقمان والعامل</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>اختيار case</span></div>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا 5/2 قد يعطي 2 في الحاسبة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> إذا كان المعاملان int تنفذ قسمة صحيحة. استخدم double أو حوّل قبل العملية لإظهار 2.5.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>أين يجب فحص القسمة على صفر؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> داخل حالة / قبل تنفيذ العملية؛ لا حاجة لمنع الصفر في الجمع أو الضرب.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>كيف تجعل الحاسبة تستمر حتى الخروج؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ضع القراءة وswitch داخل حلقة، خصص أمر خروج واضحًا، وتعامل مع فشل Stream حتى لا تصبح الحلقة لا نهائية.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>متى تتوقف switch عن كونها تصميمًا مناسبًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عند كثرة العمليات أو حاجتها لبيانات وسلوك مستقل؛ استخدم دوال وجدول dispatch أو كائنات بحسب الحجم.</div></details>
</section>
</div>
