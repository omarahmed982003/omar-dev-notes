---
title: "مسار الترجمة والربط والتشخيص"
description: "المترجم ليس خطوة واحدة؛ فهم المراحل يساعدك على تفسير رسالة الخطأ ومكانها بدل تجربة تعديلات عشوائية."
tableOfContents: true
---

## الفكرة العامة

المترجم ليس خطوة واحدة؛ فهم المراحل يساعدك على تفسير رسالة الخطأ ومكانها بدل تجربة تعديلات عشوائية.

## المفاهيم التي تحتاجها

- Preprocessor يوسع include والماكرو وينتج translation unit.
- التحليل المعجمي يصنع Tokens، والنحوي يبني AST، والدلالي يفحص الأنواع والأسماء.
- قد ينتج المترجم IR للتحسين ثم كود آلة أو Assembly.
- Assembler ينتج object files، وLinker يحل الرموز بين الوحدات والمكتبات.
- Separate compilation يسمح بإعادة بناء الملفات التي تغيرت فقط.
- التحذير لا يمنع البناء لكنه قد يكشف عيبًا حقيقيًا.

## مثال

```text
source → preprocessing → parsing/type checks → optimization/codegen
       → object files → linking → executable
```

## أخطاء شائعة وتصحيحات

- Undefined reference عادة مشكلة Linker لا Compiler.
- لا تصلح الرسائل من الأسفل عشوائيًا؛ أصلح أول سبب حقيقي ثم أعد البناء.

<div class="lesson-diagram" role="img" aria-label="داخل خط الترجمة والربط">
<p class="lesson-diagram-title">داخل خط الترجمة والربط</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Source + Headers</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Tokens / AST</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>IR + Optimization</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Object files</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Resolve symbols</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Executable</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين AST وIR؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> AST يحتفظ ببنية ومعنى المصدر، بينما IR تمثيل وسيط أنسب للتحليل والتحسين وتوليد كود لمنصات مختلفة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>ماذا يعني Undefined reference غالبًا؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> التصريح معروف أثناء الترجمة لكن Linker لم يجد التعريف المطابق أو لم تُربط المكتبة/الوحدة الصحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا تفيد Separate compilation؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> تسمح بترجمة الوحدات المتغيرة فقط ثم ربطها، فتقلل زمن البناء وتعزل الملفات.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>هل التحذير آمن لأنه لا يوقف البناء؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا؛ قد يكشف تضييقًا أو قيمة غير مهيأة أو شرطًا مشبوهًا. تعامل معه كعيب محتمل وفعّل تحذيرات قوية.</div></details>
</section>
</div>

## الخلاصة

اكتب الحل على مراحل، فعّل التحذيرات، واختبر الحالة العادية والحدود والمدخل غير الصالح. عندما تستطيع تفسير سبب كل سطر تكون قد فهمت الفكرة بدل حفظها.
