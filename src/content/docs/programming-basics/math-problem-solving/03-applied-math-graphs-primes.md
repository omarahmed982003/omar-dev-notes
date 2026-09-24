---
title: "الرياضيات التطبيقية والقياس والرسوم والأعداد الأولية"
description: "الرياضيات التطبيقية تربط الأرقام بوحدات وتمثيلات. التحويل والتقريب والإحداثيات والأعداد الأولية أدوات لحل مسائل عملية لا مجرد قوانين منفصلة."
tableOfContents: true
---

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
<div class="diagram-flow">
<div class="diagram-node input"><span>الفكرة العامة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>المفاهيم الأساسية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال تطبيقي</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>تصحيح مفاهيم وأخطاء شائعة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الرياضيات التطبيقية تربط الأرقام بوحدات وتمثيلات. التحويل والتقريب والإحداثيات</span></div>
</div>
</div>

## المتتابعات والعلاقات التكرارية

يزيد الحد في المتتابعة الحسابية بمقدار ثابت، بينما يضرب في نسبة ثابتة في المتتابعة الهندسية. يمكن حساب الحد مباشرة بدل توليد كل الحدود عندما تتوفر الصيغة. أما Recurrence فتعرف الحد من حدود سابقة مثل Fibonacci، ويجب تحديد Base Cases حتى لا يستمر التعريف بلا نهاية.

## مبدأ العد والتباديل والتوافيق

إذا كان اختيار أول له `a` احتمالات ثم اختيار مستقل له `b` احتمالات فعدد التركيبات `a*b`. التبديل يهتم بالترتيب، بينما التوافق يختار عناصر من غير اعتبار ترتيبها. لا تحسب Factorial مباشرة للقيم الكبيرة من غير فهم حدود النوع وإمكانية تبسيط الصيغة.

## أساسيات الاحتمالات

فضاء العينة هو مجموعة النتائج الممكنة. احتمال الحدث عدد بين صفر وواحد. الحدثان مستقلان إذا لم يغير وقوع أحدهما احتمال الآخر. الاحتمال الشرطي يقيس وقوع A مع معرفة وقوع B. الأرقام العشوائية في البرامج غالبًا Pseudorandom وتحتاج Seed ومولدًا مناسبًا، ولا تستخدم مولدًا عاديًا لأسرار أمنية.

## Graphs وTrees

يتكون Graph من Vertices وEdges. قد تكون الحافة موجهة أو غير موجهة، وموزونة أو بلا وزن. الـPath سلسلة حواف، والـCycle يعود إلى نقطة سابقة. والـTree رسم متصل بلا دورات وله مسار وحيد بين أي عقدتين. تستخدم Graphs في الطرق والشبكات والتبعيات والعلاقات الاجتماعية.

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

## خلاصة

افهم العلاقة بين الفكرة ومدخلاتها ونتيجتها، ثم اختبرها بحالات عادية وحدّية وغير صالحة. القدرة على التفسير والتطبيق أهم من حفظ الصياغة.
