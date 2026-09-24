---
title: 8. كيف يعرض المتصفح الصفحة؟
description: Navigation وDOM وCSSOM وRender Tree وتنفيذ JavaScript واستخدام DevTools لفهم الأداء.
sidebar:
  order: 9
---

## من الاستجابة إلى Pixels

```text
HTML bytes -> decode -> tokens -> DOM
CSS bytes  -> parse  -> CSSOM
DOM + CSSOM -> Render Tree -> Layout -> Paint -> Composite
```

- **DOM:** شجرة العناصر والمحتوى.
- **CSSOM:** القواعد المحللة التي تحدد الشكل.
- **Layout:** حساب الأحجام والمواقع.
- **Paint:** رسم النصوص والألوان والحدود.
- **Composite:** تركيب الطبقات لإظهار الإطار النهائي.

CSS اللازمة للعرض قد تؤخر الرسم، وJavaScript التقليدية قد توقف تحليل HTML حتى تُحمّل وتنفّذ.

## JavaScript والتحميل

```html
<script src="/app.js" defer></script>
<script type="module" src="/main.js"></script>
```

`defer` يسمح باستمرار parsing وينفذ بعد اكتمال DOM وبالترتيب. الـmodules مؤجلة افتراضيًا ولها dependency graph. أما `async` فينفذ عند اكتمال التحميل دون ضمان ترتيب.

تغيير layout بصورة متكررة داخل loop قد يسبب layout thrashing. اجمع القراءات ثم الكتابات، وحرّك العناصر غالبًا عبر `transform` عندما يناسب.

## دورة حدث مبسطة

JavaScript يعمل عادة على main thread مع event loop. المهام الطويلة تؤخر input والرسم. قس Largest Contentful Paint وInteraction to Next Paint وCumulative Layout Shift.

## DevTools

1. افتح **Network** وفعّل Disable cache أثناء التجربة.
2. راقب DNS وConnection وTLS وWaiting/TTFB وDownload.
3. افحص headers والحجم المنقول ونوع البروتوكول.
4. استخدم **Performance** لتحديد long tasks وlayout وpaint.
5. استخدم **Elements** لرؤية DOM والـcomputed styles.

:::tip
TTFB مرتفع قد يكون شبكة أو CDN أو PHP أو Database. اربط Network trace مع server logs وprofiling قبل تحديد السبب.
:::

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: كيف يعرض المتصفح الصفحة؟">
<p class="lesson-diagram-title">خريطة مفاهيم: كيف يعرض المتصفح الصفحة؟</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>من الاستجابة إلى Pixels</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>JavaScript والتحميل</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>دورة حدث مبسطة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>DevTools</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «من الاستجابة إلى Pixels» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> DOM: شجرة العناصر والمحتوى. CSSOM: القواعد المحللة التي تحدد الشكل. Layout: حساب الأحجام والمواقع. Paint: رسم النصوص والألوان والحدود. Composite: تركيب الطبقات لإظهار الإطار النهائي. CSS اللازمة للعرض قد تؤخر الرسم، وJavaScript التقليدية قد توقف تحليل HTML حتى تُحمّل وتنفّذ. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «من الاستجابة إلى Pixels» و«JavaScript والتحميل». لماذا لا يغني أحدهما عن الآخر داخل موضوع «كيف يعرض المتصفح الصفحة؟»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «من الاستجابة إلى Pixels»: DOM: شجرة العناصر والمحتوى. CSSOM: القواعد المحللة التي تحدد الشكل. Layout: حساب الأحجام والمواقع. Paint: رسم النصوص والألوان والحدود. Composite: تركيب الطبقات لإظهار الإطار النهائي. CSS اللازمة للعرض قد تؤخر الرسم، وJavaScript التقليدية قد توقف تحليل HTML حتى تُحمّل وتنفّذ. أما «JavaScript والتحميل»: defer يسمح باستمرار parsing وينفذ بعد اكتمال DOM وبالترتيب. الـmodules مؤجلة افتراضيًا ولها dependency graph. أما async فينفذ عند اكتمال التحميل دون ضمان ترتيب. تغيير layout بصورة متكررة داخل loop قد يسبب layout thrashing. اجمع القراءات ثم الكتابات، وحرّك العناصر غالبًا عبر transform عندما يناسب. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «دورة حدث مبسطة». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> JavaScript يعمل عادة على main thread مع event loop. المهام الطويلة تؤخر input والرسم. قس Largest Contentful Paint وInteraction to Next Paint وCumulative Layout Shift. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «DevTools» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> افتح Network وفعّل Disable cache أثناء التجربة. راقب DNS وConnection وTLS وWaiting/TTFB وDownload. افحص headers والحجم المنقول ونوع البروتوكول. استخدم Performance لتحديد long tasks وlayout وpaint. استخدم Elements لرؤية DOM والـcomputed styles. :::tip TTFB مرتفع قد يكون شبكة أو CDN أو PHP أو Database. اربط Network trace مع server logs وprofiling قبل تحديد السبب. ::: وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
