---
title: "نظّف النص وابحث فيه وقسّمه"
description: "تعامل مع اسم المستخدم وقائمة كلمات، واعرف الفرق بين تعديل النص ومقارنته وتحويله لقائمة."
sidebar:
  order: 21
prev: {"link":"/programming-basics/computer-fundamentals/12-input-validation/","label":"استقبل بيانات من المستخدم وتأكد منها"}
next: {"link":"/programming-basics/computer-fundamentals/14-runtime-errors/","label":"اقرأ بيانات وتعامل مع فشل العملية"}
---

شخص كتب اسمه بالشكل `"  Omar  "`، وكتب اهتماماته `"code, web, , art"`. عايزين نعرض الاسم من غير مسافات الأطراف، ونقارن الاسم، ونطلع قائمة كلمات من غير عنصر فاضي. هنستخدم [خانة الإدخال والزر](/programming-basics/computer-fundamentals/12-input-validation/) اللي جرّبناهم؛ الجديد هنا عمليات النص.

## اسم واحد قبل قائمة الكلمات

`trim` عملية نص ترجع نسخة من غير مسافات الأطراف. احفظ باسم `one-name.html` وشغّل: الاسم يظهر `Omar`، والخانة تفضل كما كتبتها؛ إحنا غيّرنا العرض فقط. جرّب `Omar Ali`: المسافة الوسطى تفضل موجودة. بعد فهم ده نضيف المقارنة، وبعدها تقسيم الكلمات.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clean one name</title>
<label>Name <input id="name" value="  Omar  "></label>
<button id="clean">Clean</button>
<p id="output"></p>
<script>
function cleanName() {
  const original = document.querySelector("#name").value;
  const cleaned = original.trim();
  document.querySelector("#output").textContent = cleaned;
}
document.querySelector("#clean").addEventListener("click", cleanName);
</script>
</html>
```

## كل عملية لها وظيفة واحدة

**String — نص** سلسلة من وحدات تمثل الحروف والرموز. **Method — دالة مرتبطة بقيمة** زي `name.trim()`؛ النقطة بتطلب عملية تخص النص `name`. النص الأصلي لا يتغير بهذه العمليات؛ الدالة ترجع نصًا جديدًا تستخدمه أو تحفظه.

| العملية | معناها | نتيجة المثال |
|---|---|---|
| `"  Omar  ".trim()` | حذف مسافات البداية والنهاية | `"Omar"` |
| `"Omar".toLowerCase()` | تحويل الحروف اللي لها صورة صغيرة | `"omar"` |
| `"omar".includes("mar")` | هل النص يحتوي الجزء المطلوب؟ | `true`، أي نعم |
| `"code,web".split(",")` | تقسيم النص عند الفاصلة | `["code", "web"]` |
| `["code", "web"].join(" / ")` | تجميع عناصر القائمة وبينها فاصل | `"code / web"` |

`false` معناها لا؛ `true` و`false` قيمتان منطقيتان، وتسمى **Boolean**. `===` تقارن النص كله؛ البحث بـ`includes` يختبر وجود جزء. الاسم `"omar2"` يحتوي `"omar"` لكنه لا يساويه.

## مثال كامل

احفظ الكود في `texts.html`، أو [شغّل المثال](/examples/first-program/texts.html). خانة `Name` للاسم، و`Tags` لكلمات تفصل بينها فاصلة إنجليزية `,`.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Work with text</title>
<h1>Names and tags</h1>
<p><label for="name">Name</label><br><input id="name" value="  Omar  "></p>
<p><label for="tags">Tags separated by commas</label><br><input id="tags" value="code, web, , art"></p>
<button id="process">Process text</button>
<p id="output" role="status"></p>
<script>
function processText() {
  const name = document.querySelector("#name").value.trim();
  const output = document.querySelector("#output");
  if (name === "") {
    output.textContent = "Enter a name.";
    return;
  }
  const normalized = name.toLowerCase();
  const parts = document.querySelector("#tags").value.split(",");
  const tags = [];
  for (const part of parts) {
    const cleaned = part.trim();
    if (cleaned !== "") {
      tags.push(cleaned);
    }
  }
  output.textContent = "Name: " + name
    + " | Same as omar: " + (normalized === "omar")
    + " | Contains mar: " + normalized.includes("mar")
    + " | Tags: " + tags.join(" / ");
}
document.querySelector("#process").addEventListener("click", processText);
</script>
</html>
```

اضغط `Process text` بالقيم الموجودة؛ النتيجة:

```text
Name: Omar | Same as omar: true | Contains mar: true | Tags: code / web / art
```

## تتبّع الكلمات واحدة واحدة

`split` ترجع قائمة، فبنمر عليها باستخدام `for...of`، أي دورة لكل قيمة. `trim` تنظف كل جزء، و`!==` معناها «غير مطابق». لو الجزء مش فاضي، نستخدم `push` لإضافته إلى نهاية القائمة.

| الجزء بعد التقسيم | بعد التنظيف | نضيفه؟ |
|---|---|---|
| `"code"` | `"code"` | نعم |
| `" web"` | `"web"` | نعم |
| `" "` | `""` | لا |
| `" art"` | `"art"` | نعم |

وجود `const tags = []` يمنع ربط الاسم بقائمة مختلفة؛ لا يمنع إضافة عناصر لنفس القائمة. `join` في الآخر يحوّل القائمة إلى نص للعرض. علامة `+` تضم النصوص، والأقواس حول المقارنة تجعلنا نحسب نتيجتها قبل ضمها للرسالة.

## المقارنة لها سياسة

في المثال نعرض `Omar` بشكل كتابته بعد حذف مسافات الأطراف، ونستخدم نسخة `omar` للمقارنة. ده اسمه **Normalization — تجهيز النص بشكل موحّد لغرض محدد**. هنا المقصود حذف مسافات الأطراف وتصغير الحروف الإنجليزية فقط؛ مش حلًا عامًا لكل لغات العالم.

`trim` لا يحذف المسافة بين `Omar Ali`. والعربية مفيهاش فرق حروف كبيرة وصغيرة؛ `toLowerCase` ما يوحّدش مثلًا `أ` و`ا`. إزالة التشكيل أو تغيير حروف الاسم محتاج قاعدة واضحة، لأنك ممكن تغيّر المعنى أو تخلط اسمين.

لو استخدمت `text.length`، فده عدد وحدات النص في JavaScript، مش بالضرورة عدد الحروف المرئية. بعض الرموز زي الإيموجي تاخد أكثر من وحدة. لما نضع حدًا للطول في التدريب القادم، هيكون الحد على القيمة اللي تقيسها `length`، مش وعدًا بعدّ الحروف البشرية.

## جرّب الحدود وحل تمرينًا

- اكتب اسمًا كله مسافات: تظهر رسالة طلب الاسم.
- اكتب `OMAR`: المقارنة مع `omar` تنجح، والعرض يفضل `OMAR`.
- خلي الكلمات `code,,web,`: الأجزاء الفاضية لا تُضاف.
- خلي الكلمات فاضية: القائمة تكون فاضية والجزء بعد `Tags:` يكون فاضيًا.
- اكتب `<b>Omar</b>`: يُعرض كنص، وليس تعليمات تنسيق؛ استخدمنا `textContent`.

**تمرين وحله:** خلي الكلمات تفصل بينها `;` بدل `,`. غيّر `split(",")` إلى `split(";")`، وحدّث وصف الخانة والقيمة التجريبية إلى `code; web; art`. جرّب فاصلين متتاليين علشان تتأكد إن إزالة الأجزاء الفاضية لسه شغالة.

لو محتاج فواصل داخل الكلمة نفسها، التقسيم ده مش كفاية لتنسيق ملفات عام. إحنا اتفقنا هنا إن الفاصلة حد بين كلمتين؛ وصف شكل البيانات جزء من تصميم الحل.
