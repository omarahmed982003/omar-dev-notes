---
title: "كيف يعرض المتصفح الصفحة؟"
description: Navigation وDOM وCSSOM وRender Tree وتنفيذ JavaScript واستخدام DevTools لفهم الأداء.
sidebar:
  order: 18
prev: {"link":"/programming-basics/23-tls-handshake-details/","label":"كيف يتفق الطرفان على اتصال مشفّر؟"}
next: {"link":"/programming-basics/29-browser-scheduling/","label":"تحميل البرامج وترتيب مهام المتصفح"}
---


## غيّر حجم نص وقِس عرضه

احفظ المثال باسم `render.html`، أو [شغّله](/examples/first-program/render.html). **CSS** قواعد شكل الصفحة؛ `font-size` حجم الخط، و`px` وحدة بكسل CSS وليست وعدًا بنقطة مادية واحدة في كل شاشة. `span` جزء نص، و`style` يحدد شكله. الدالة `getBoundingClientRect()` تقرأ صندوق العنصر بعد التخطيط، و`width` عرضه.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Measure a visible change</title>
<p><span id="sample" style="font-size:16px;display:inline-block">Hello</span></p>
<button id="grow">Grow text</button>
<p id="output"></p>
<script>
function measure() {
  const width = document.querySelector("#sample").getBoundingClientRect().width;
  document.querySelector("#output").textContent = "Width: " + width + " CSS pixels";
}
function grow() {
  document.querySelector("#sample").style.fontSize = "32px";
  measure();
}
document.querySelector("#grow").addEventListener("click", grow);
measure();
</script>
</html>
```

سجّل العرض الأول ثم اضغط الزر: النص يكبر من16 إلى32، والعرض المقاس يزيد. القيمة الدقيقة تعتمد على الخط والمتصفح، فلا نحفظ رقمًا ثابتًا. **DOM** تمثيل عناصر الصفحة، و**Layout — تخطيط** حساب مواضعها وأحجامها، و**Paint — رسم** تجهيز شكلها. تغيير الحجم يحتاج حسابًا جديدًا؛ مجرد تغيير لون لا يطلب نفس تغيّر الحجم.

## قبل التفاصيل

وصول ملف الصفحة مش نهاية الرحلة. **HTML، Hypertext Markup Language** يصف العناصر، زي عنوان وفقرة. **CSS، Cascading Style Sheets** يصف شكلها، زي اللون والحجم. **JavaScript (لغة برمجة تستخدم مثلًا لتنفيذ تفاعل الصفحة داخل المتصفح)** لغة تضيف حسابًا وتفاعلًا. هنشوف المتصفح يحوّل المحتوى والشكل لصورة على الشاشة، ونحدد سبب التأخير بدل تخمينه.

**DOM، Document Object Model** تمثيل العناصر كشجرة: صفحة تحتوي عنوانًا وفقرات. **CSSOM، CSS Object Model** تمثيل قواعد التنسيق بعد قراءتها. **Pixel — بكسل** نقطة لون صغيرة على الشاشة، و**Render tree — شجرة العرض** المعلومات التي يحتاجها المتصفح لترتيب العناصر التي سيعرضها.

في الرسم، decode يعني قراءة البايتات بحسب ترميز النص، وtokens أجزاء ذات معنى مثل بداية وسم، وparse تحليل هذه الأجزاء لبناء تمثيل منظم. الأسهم ترتيب تعليمي للمسؤوليات؛ المتصفح ممكن يعيد بعض الخطوات عندما تتغير الصفحة.

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

## DevTools

1. افتح **Network** وفعّل Disable cache (نسخة محفوظة لتقليل تكرار القراءة أو الحساب) أثناء التجربة.
2. راقب DNS (Domain Name System؛ نظام يجيب عن أسئلة أسماء النطاقات، ومنها عناوينها) وConnection وTLS (Transport Layer Security؛ قواعد حماية الاتصال بالتشفير والتحقق) وWaiting/TTFB (Time To First Byte؛ مدة الانتظار حتى وصول أول بايت من الرد بحسب أداة القياس) وDownload.
3. افحص headers (حقل أو مقدمة معلومات تضاف للبيانات بحسب الطبقة) والحجم المنقول ونوع البروتوكول.
4. استخدم **Performance** لتحديد long tasks وlayout وpaint.
5. استخدم **Elements** لرؤية DOM والـcomputed styles.

:::tip
TTFB مرتفع قد يكون شبكة أو CDN (Content Delivery Network؛ شبكة خوادم تقدم المحتوى من نقاط موزعة قرب المستخدمين) أو PHP (اسم لغة برمجة تستخدم كثيرًا لمعالجة طلبات الويب على الخادم) أو Database (قاعدة بيانات: تخزين منظم يمكن البحث فيه وتعديله بقواعد). اربط Network trace مع server logs (سجلات أحداث وتشخيص يكتبها البرنامج) وprofiling قبل تحديد السبب.
:::

## مسائل عملية

<details><summary>لماذا قد تظهر الصفحة بلا تنسيق لحظة؟</summary><p>قد يصل HTML قبل CSS أو يتأخر stylesheet؛ يستطيع المتصفح بناء DOM لكنه يحتاج CSSOM لتنسيق الرسم.</p></details>

<details><summary>أين تبحث عن ملف JavaScript أعاد 404؟</summary><p>ابدأ من Network لمعرفة URL (Uniform Resource Locator؛ عنوان يحدد موردًا وطريقة الوصول إليه) والحالة والمبادر، ثم Console لرؤية أثر فشل التحميل.</p></details>

<details><summary>هل <code>DOMContentLoaded</code> يعني أن كل الصور اكتملت؟</summary><p>لا. يعني أن HTML حُلّل وأن DOM جاهز؛ قد تظل الصور وموارد أخرى قيد التحميل.</p></details>

## قِس ما يشعر به المستخدم

**LCP، Largest Contentful Paint** وقت ظهور أكبر عنصر محتوى مناسب للقياس في الجزء المرئي. **INP، Interaction to Next Paint** يقيس تأخر الاستجابة المرئية لتفاعلات المستخدم خلال الزيارة. **CLS، Cumulative Layout Shift** يقيس مقدار تحرك العناصر بشكل غير متوقع. دي مقاييس مختلفة؛ تحميل سريع لا يمنع زرًا بطيئًا أو نصًا يقفز مكانه.

**Main thread — خيط العمل الرئيسي** ينفذ كثيرًا من عمل الصفحة. **Event loop — دورة الأحداث** تنظم تنفيذ المهام. **Microtasks — مهام صغيرة مؤجلة** تُنفذ عند نقاط محددة بعد انتهاء التنفيذ الحالي وقبل فرصة العرض التالية؛ سلسلة لا تنتهي منها قد تؤخر الواجهة. مش لازم يحدث رسم بعد كل مهمة.

**Layout thrashing** تكرار قراءة مواقع العناصر وتغييرها بشكل يجبر المتصفح على إعادة الحساب كثيرًا. اجمع القراءات ثم التغييرات عندما يناسب. **Accessibility — إتاحة الاستخدام** تشمل إمكانية قراءة المحتوى واستخدامه بلوحة المفاتيح وأدوات المساعدة.

**تدريب وحل:** أكبر صورة تتأخر بينما HTML وصل بسرعة. افحص وقت بدء طلبها، حجمها، وأي كود يؤخر إظهارها. غيّر عاملًا واحدًا وقارن عدة تحميلات بنفس ظروف الشبكة. تحسن زمن الخادم وحده لا يثبت تحسن ظهور الصورة.

## الخطوة التالية

كمّل في [تحميل البرامج وترتيب مهام المتصفح](/programming-basics/29-browser-scheduling/) بعد تنفيذ التجربة هنا.
