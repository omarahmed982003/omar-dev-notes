---
title: "الشروط وتمارين Codeforces"
description: "مسائل الشروط تدربك على تحويل نص قصصي إلى معادلات وحالات حصرية. الصعوبة غالبًا في فهم الحدود، لا في كتابة if نفسها."
tableOfContents: true
---

## الفكرة العامة

مسائل الشروط تدربك على تحويل نص قصصي إلى معادلات وحالات حصرية. الصعوبة غالبًا في فهم الحدود، لا في كتابة if نفسها.

## المفاهيم التي تحتاجها

- عرّف الرموز والمعادلات على الورق قبل الكود.
- ابحث عن حل رياضي يغني عن المحاكاة الطويلة.
- اجعل الحالات متبادلة الاستبعاد أو حدد أولوية واضحة.
- استخدم نوعًا أوسع عند ضرب قيود كبيرة.
- في Even Odds افصل النصف الفردي عن النصف الزوجي باستخدام موضع 1-based.

## مثال

```cpp
long long oddCount = (n + 1) / 2;
long long answer = (k <= oddCount)
    ? 2 * k - 1
    : 2 * (k - oddCount);
```

## أخطاء شائعة وتصحيحات

- انتبه هل k فهرس يبدأ من 1 أم 0.
- لا تستخدم double لحساب يحتاج دقة صحيحة كاملة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الشروط وتمارين Codeforces">
<p class="lesson-diagram-title">خريطة مفاهيم: الشروط وتمارين Codeforces</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>الفكرة العامة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>المفاهيم التي تحتاجها</span></div>
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
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشتق صيغة الجزء الفردي في Even Odds.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عدد الفرديات حتى n هو (n+1)/2. إذا k داخله فالقيمة ذات الموضع k هي 2k-1.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا نستخدم long long في مسائل تبدو مدخلاتها int؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> قد يكون كل مدخل داخل int لكن ضربها أو جمعها يتجاوز المجال؛ نوع التعبير الوسيط هو المهم.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>كيف تعرف أن الحل الرياضي أفضل من المحاكاة؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> إذا أمكن حساب الموضع أو المجموع بصيغة ثابتة، تصبح O(1) بدل تكرار قد يتجاوز الزمن.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>ما اختبار حدّي يكشف خطأ 0-based/1-based؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اختبر k=1، وآخر موضع في الجزء الأول، وأول موضع في الجزء الثاني، وk=n.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
