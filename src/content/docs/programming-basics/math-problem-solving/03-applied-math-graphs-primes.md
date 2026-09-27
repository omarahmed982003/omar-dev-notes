---
title: "القياس والوحدات والأعداد الأولية"
description: "القياس والوحدات والأعداد الأولية"
tableOfContents: true
prev: {"link":"/programming-basics/math-problem-solving/10-greedy-dynamic-programming/","label":"اختَر بين الحل الجشع وحفظ النتائج"}
next: {"link":"/programming-basics/math-problem-solving/11-counting-probability/","label":"المتتابعات والعد والاحتمال"}
sidebar:
  order: 12
---

استخدم القسم بعد [القيم والقرارات والحلقات](/programming-basics/computer-fundamentals/10-decisions-and-repetition/). ارجع للحساب حسب الحاجة؛ الرسوم والتعقيد والبرمجة الديناميكية توسعات لاحقة وليست شروطًا لأول برنامج.



## الفكرة العامة

الرياضيات التطبيقية تربط الأرقام بوحدات وتمثيلات. التحويل والتقريب والإحداثيات والأعداد الأولية أدوات لحل مسائل عملية لا مجرد قوانين منفصلة.

## المفاهيم الأساسية

- ثبت وحدة كل قيمة قبل الحساب وحوّل القيم إلى وحدة مشتركة.
- floor يتجه لأسفل وceil لأعلى، حتى مع الأعداد السالبة؛ أما round فيختار الأقرب.
- الإحداثي (x,y) يحدد نقطة، والرسم يوضح كيف تتغير قيمة مع أخرى.
- في الدالة y=2n+3، الميل 2 يعني زيادة y بمقدار 2 لكل زيادة واحدة في n.
- لاختبار أولية n يكفي تجربة القواسم حتى √n لأن العوامل تأتي في أزواج.

## مثال تطبيقي

لاختبار 29، جرّب القسمة على الأعداد الأولية حتى √29≈5.38: أي 2 و3 و5. لا يقسمه أي منها، إذن 29 أولي.

## تصحيح مفاهيم وأخطاء شائعة

- ceil(-2.3) يساوي -2 وليس -3.
- العدد 1 ليس أوليًا، وكل عدد زوجي أكبر من 2 غير أولي.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: الرياضيات التطبيقية والقياس والرسوم والأعداد الأولية">
<p class="lesson-diagram-title">خريطة مفاهيم: الرياضيات التطبيقية والقياس والرسوم والأعداد الأولية</p>
<div class="diagram-flow diagram-grid">
<div class="diagram-node input"><span>كمية + وحدة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>حوّل للوحدة المطلوبة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثّلها: نقطة أو رسم</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>اضبط التقريب والخطأ</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>استنتج معنى النتيجة</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا ceil(-2.3) = -2 بينما floor(-2.3) = -3؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ceil يختار أصغر عدد صحيح لا يقل عن القيمة، وهو -2. floor يختار أكبر عدد صحيح لا يزيد عنها، وهو -3.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>أثبت لماذا يكفي اختبار القواسم حتى √n عند فحص الأولية.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> إذا كان n=a×b وكان العاملان أكبر من √n فسيكون حاصل ضربهما أكبر من n؛ إذن أي تحليل مركب يملك عاملًا واحدًا على الأقل لا يتجاوز الجذر.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>ماذا يعني الميل 2 في y=2n+3 عمليًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> كل زيادة واحدة في n ترفع y بمقدار 2، بينما 3 هي القيمة الابتدائية عندما n=0.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>ما خطأ اختبار العدد 1 كعدد أولي لأنه لا يقبل القسمة على 2؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تعريف الأولي يتطلب عاملين موجبين بالضبط: 1 والعدد نفسه. العدد 1 له عامل واحد فقط، لذلك ليس أوليًا.</div></details>
</section>
</div>

## الخطوة التالية


كمّل في [المتتابعات والعد والاحتمال](/programming-basics/math-problem-solving/11-counting-probability/) بعد تنفيذ التجربة هنا.



كمّل في [ارسم العلاقات وابحث عن طريق](/programming-basics/math-problem-solving/12-graphs-and-search/) بعد تنفيذ التجربة هنا.
