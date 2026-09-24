---
title: "المتغيرات والمعادلات والمنطق البولياني"
description: "المتغير اسم لقيمة قد تتغير، والمعادلة تصف علاقة بين قيم. المنطق البولياني يحول شروط المسألة إلى قرارات يمكن للبرنامج تقييمها."
tableOfContents: true
---

## الفكرة العامة

المتغير اسم لقيمة قد تتغير، والمعادلة تصف علاقة بين قيم. المنطق البولياني يحول شروط المسألة إلى قرارات يمكن للبرنامج تقييمها.

## المفاهيم الأساسية

- التعبير ينتج قيمة، بينما المعادلة أو المقارنة تسأل عن علاقة.
- الإسناد يحدّث حالة المتغير؛ لذلك ترتيب التعليمات قد يغيّر النتيجة.
- AND يتطلب تحقق الشروط كلها، وOR يكفيه شرط واحد، وNOT يعكس القيمة.
- XOR يساوي true عندما يختلف الشرطان، لكنه أقل استخدامًا في شروط الأعمال اليومية.
- اكتب كل شرط بسيط منفصلًا ثم اجمعه لتقليل أخطاء المنطق.

## مثال تطبيقي

أهلية قرض قد تكون: عمر مناسب AND دخل كافٍ AND لا توجد مديونية خطرة. حوّل كل عبارة إلى Boolean باسم واضح ثم اجمعها في قرار نهائي.

## تصحيح مفاهيم وأخطاء شائعة

- لا تخلط بين “يساوي” و“ضع قيمة في المتغير”.
- انتبه للأقواس عند دمج AND وOR حتى يكون المعنى صريحًا.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: المتغيرات والمعادلات والمنطق البولياني">
<p class="lesson-diagram-title">خريطة مفاهيم: المتغيرات والمعادلات والمنطق البولياني</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>الفكرة العامة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>المفاهيم الأساسية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>مثال تطبيقي</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>تصحيح مفاهيم وأخطاء شائعة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>المتغير اسم لقيمة قد تتغير، والمعادلة تصف علاقة بين</span></div>
</div>
</div>

## المجموعات والعلاقات والدوال

المجموعة عناصر فريدة بلا اعتماد ضروري على الترتيب. الـSubset مجموعة تقع عناصرها كلها داخل أخرى. يجمع Union العناصر الموجودة في أي من المجموعتين، ويحتفظ Intersection بالعناصر المشتركة، ويزيل Difference عناصر مجموعة من أخرى.

العلاقة مجموعة أزواج تربط عناصر. يمكن أن تكون انعكاسية أو متناظرة أو متعدية. أما الدالة فتربط كل عنصر من Domain بنتيجة واحدة في Codomain، وتسمى القيم الناتجة فعليًا Range. يظهر هذا الفرق في تصميم APIs والتحقق من أن لكل مدخل صالح نتيجة محددة.

## Truth Tables وImplication

يسجل Truth Table نتيجة التعبير لكل تركيب من القيم المنطقية. يكون `A && B` صحيحًا فقط عندما يصح الاثنان، و`A || B` صحيحًا عندما يصح أحدهما على الأقل، وXOR صحيحًا عندما يختلفان.

العبارة `A -> B` تكون خاطئة فقط عندما يصح A وتفشل B. لا تخلطها بعلاقة سببية؛ إنها صياغة منطقية. وتقول قوانين De Morgan إن نفي `A && B` يساوي `!A || !B`، ونفي `A || B` يساوي `!A && !B`.

## Predicates وQuantifiers

الـPredicate عبارة تعتمد على قيمة مثل `isEven(x)`. يعني «لكل» أن الشرط ينجح لكل عنصر، ويعني «يوجد» أن عنصرًا واحدًا على الأقل يحققه. تقابلها في البرمجة عمليات مثل `all_of` و`any_of` وفحوص القوائم.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين x = x + 1 في البرمجة والمعادلات الرياضية؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> برمجيًا هي إسناد: احسب القيمة القديمة ثم خزّن الأكبر بواحد. رياضيًا المعادلة x=x+1 مستحيلة على الأعداد العادية.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>حوّل “مقبول إذا كان موظفًا أو دخله كافيًا، وبشرط ألا يكون محظورًا” إلى منطق واضح.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> eligible = (isEmployee OR hasEnoughIncome) AND NOT isBlocked. الأقواس ضرورية لأن الحظر يجب أن يرفض الحالتين.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>متى تختلف عدة شروط if مستقلة عن سلسلة else-if؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> الشروط المستقلة قد تنفذ أكثر من فرع، بينما else-if تختار أول شرط صحيح فقط؛ الاختيار يعتمد على كون النتائج متزامنة أم حصرية.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>كيف تختبر قاعدة منطقية مركبة دون تجربة كل القيم عشوائيًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> أنشئ جدول حقيقة أو جدول قرار يغطي كل شرط منفردًا، التركيبات المهمة، وحدود المقارنات، ثم حدد النتيجة المتوقعة مسبقًا.</div></details>
</section>
</div>

## خلاصة

افهم العلاقة بين الفكرة ومدخلاتها ونتيجتها، ثم اختبرها بحالات عادية وحدّية وغير صالحة. القدرة على التفسير والتطبيق أهم من حفظ الصياغة.
