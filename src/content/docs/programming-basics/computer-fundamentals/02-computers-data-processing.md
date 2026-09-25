---
title: "2. الكمبيوتر والبيانات ودورة المعالجة"
description: "صورة مترابطة للكمبيوتر كنظام يستقبل بيانات ويعالجها ويخرج نتيجة ويحفظها، مع تتبع رحلة عملية واقعية بين الهاردوير والبرمجيات."
tableOfContents: true
sidebar:
  order: 2
---

## الكمبيوتر نظام لا قطعة واحدة

الكمبيوتر مجموعة طبقات تعمل معًا. **الهاردوير** هو الأجزاء المادية، و**البرمجيات** هي التعليمات والبيانات، و**نظام التشغيل** يدير الموارد ويمنح البرامج واجهة آمنة لاستخدامها. لا ينفذ الجهاز «نية المستخدم»؛ ينفذ تعليمات دقيقة على بيانات ممثلة في صورة بتات.

من المفيد التمييز بين:

- **Data:** قيم خام، مثل بايتات صورة أو درجات طلاب.
- **Information:** بيانات نُظمت أو فُسرت، مثل متوسط الدرجات.
- **Program:** تعليمات محفوظة على وسيط تخزين.
- **Process:** نسخة عاملة من البرنامج لها ذاكرة وحالة وموارد.
- **Input/Output device:** مكوّن يدخل البيانات أو يعرض/يرسل النتيجة.

## دورة Input–Process–Output–Storage

يمكن تحليل معظم الأنظمة بهذا النموذج:

1. **Input:** قراءة من لوحة مفاتيح أو ملف أو شبكة أو حساس.
2. **Process:** التحقق والتحويل والحساب واتخاذ القرار.
3. **Output:** شاشة أو ملف أو استجابة شبكة أو إشارة تحكم.
4. **Storage:** حفظ النتيجة مؤقتًا في الذاكرة أو دائمًا على SSD/HDD.

لا تعني الدورة أن كل مرحلة تحدث مرة واحدة. قد يستقبل تطبيق فيديو أجزاء صغيرة، يفك كل جزء، يخزنه في Buffer، ثم يعرضه بينما تصل الأجزاء التالية.

<div class="lesson-diagram" role="img" aria-label="دورة معالجة البيانات داخل الكمبيوتر">
<p class="lesson-diagram-title">رحلة البيانات</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Input</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Validation + Processing</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Output</span></div>
<span class="diagram-arrow" aria-hidden="true">↔</span>
<div class="diagram-node start"><span>Memory / Storage</span></div>
</div>
</div>

## مثال: فتح صورة وتعديلها

عند فتح صورة، يطلب التطبيق الملف من نظام التشغيل. يقرأ متحكم التخزين أجزاءه إلى RAM، ويفك البرنامج صيغة الصورة باستخدام CPU وقد يستعين بـGPU للرسم. تحتفظ الذاكرة بالنسخة النشطة، وترسل النتيجة إلى الشاشة. عند الحفظ لا يكفي تعديل RAM؛ يجب كتابة الملف إلى التخزين والتأكد من نجاح العملية.

هذا المثال يوضح أن كلمة «فتح ملف» تخفي تعاونًا بين البرنامج ونظام التشغيل والتعريفات والتخزين والذاكرة والمعالج وبطاقة العرض.

## أين تذهب البيانات؟

- **Registers وCPU caches:** قيم وتعليمات يحتاجها المعالج فورًا.
- **RAM:** مساحة العمل النشطة والسريعة، وتفقد محتواها المعتاد عند انقطاع الطاقة.
- **SSD/HDD:** حفظ طويل المدى بسعة أكبر وزمن وصول أعلى.
- **Network:** نقل البيانات إلى جهاز آخر عبر بروتوكولات متفق عليها.

هذه خريطة عامة. ستدرس المعالج والذاكرة والتخزين ونظام التشغيل كلًا في درس مستقل، ولذلك لا نخلط هنا بين التفاصيل الدقيقة لكل طبقة.

## تشخيص العطل من مسار البيانات

إذا كانت النتيجة خاطئة، لا تبدأ بتخمين عشوائي. اسأل:

1. هل وصلت المدخلات فعلًا وبالصيغة المتوقعة؟
2. هل فشل التحقق أو التحويل أو الحساب؟
3. هل الناتج الداخلي صحيح لكن طريقة عرضه خاطئة؟
4. هل حُفظت النتيجة؟ وهل نقرأ النسخة الأحدث أم Cache قديمًا؟
5. هل حدث فشل جزئي في القرص أو الشبكة أو الذاكرة؟

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا لا يُعد الملف الموجود على SSD برنامجًا يعمل؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الملف تعليمات مخزنة. ينشئ نظام التشغيل Process ويحمل الصفحات المطلوبة إلى الذاكرة ويهيئ الموارد ثم يبدأ التنفيذ.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>تتبّع إرسال رسالة صوتية باستخدام نموذج IPO مع التخزين.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الميكروفون Input، ثم الترميز والضغط Processing، والإرسال والحفظ Output/Storage. عند المستلم تُستقبل البايتات وتُفك ثم يخرج الصوت من السماعة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>يعرض التطبيق نتيجة قديمة رغم نجاح الحساب. ما المسارات التي تفحصها؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> افحص مكان حفظ النتيجة، ونجاح الكتابة، والمصدر الذي تقرأ منه واجهة العرض، وأي Cache أو Buffer قد يحمل نسخة سابقة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ما الفرق بين Program وProcess؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> Program وصف وتعليمات محفوظة، أما Process فهو تنفيذ حي له مساحة عناوين وحالة وملفات وموارد. يمكن تشغيل عدة Processes من البرنامج نفسه.</div></details></section>
</div>
