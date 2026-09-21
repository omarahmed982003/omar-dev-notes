---
title: 9. كيف يعرض المتصفح الصفحة؟
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

