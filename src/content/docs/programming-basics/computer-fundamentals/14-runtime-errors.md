---
title: "اقرأ بيانات وتعامل مع فشل العملية"
description: "افصل بين نص مكتوب بطريقة خاطئة وبيانات لا تناسب البرنامج، واعرض رسالة تسمح للمستخدم بالمحاولة من جديد."
sidebar:
  order: 22
prev: {"link":"/programming-basics/computer-fundamentals/13-text-processing/","label":"نظّف النص وابحث فيه وقسّمه"}
next: {"link":"/programming-basics/computer-fundamentals/17-local-server/","label":"شغّل ملفاتك بعنوان محلي ثابت"}
---

عرفنا نفصل كلمات عند الفاصلة. لكن لو حفظنا قائمة فيها كلمات وفواصل وعلامات تنصيص، محتاجين طريقة متفق عليها تفرق بين قيمة وحدود القائمة. هنتعلم شكلًا جاهزًا لده، ونعالج فشل قراءته من غير فقد النتيجة السليمة السابقة.

## شوف فشل واحد قبل قواعد القائمة

JSON شكل نصي متفق عليه للبيانات؛ القائمة تحتاج قوس بداية ونهاية، مثل `[]`. `JSON.parse` تحاول قراءة النص بهذا الشكل. `try` تحيط بالمحاولة، و`catch` تستقبل إشارة الفشل، و`error` اسم التفاصيل المستقبلة. احفظ باسم `one-error.html`.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Catch one failed read</title>
<button id="read">Read invalid JSON</button>
<p id="output"></p>
<script>
function readData() {
  try {
    const data = JSON.parse("[");
    document.querySelector("#output").textContent = "Read successfully";
  } catch (error) {
    document.querySelector("#output").textContent = "Incomplete data. Try again.";
  }
}
document.querySelector("#read").addEventListener("click", readData);
</script>
</html>
```

اضغط الزر: تظهر رسالة أن البيانات ناقصة، ولا تظهر رسالة النجاح. غيّر `"["` إلى `"[]"` في الملف، واحفظ وأعد التحميل: تنجح القراءة. ده يختبر الصياغة فقط؛ هل القيمة قائمة أسماء مناسبة؟ هنفحص ده بعده.

## وصف القائمة كنص

**JSON، اختصار JavaScript Object Notation**، تنسيق نصي لتبادل وحفظ بيانات. الاسم جاء من JavaScript لكنه مستخدم مع لغات كثيرة. في البداية هنستخدم جزءًا واحدًا منه: قائمة نصوص.

```json
["milk", "bread"]
```

الأقواس المربعة تحيط بالقائمة، والفاصلة تفصل العناصر، وكل نص بين علامتي تنصيص مزدوجتين. القائمة الفاضية `[]`. النص `["milk",]` غير صالح: فيه فاصلة من غير عنصر بعدها. `JSON.parse` تقرأ النص وتحاول تحويله لقيمة في البرنامج؛ كلمة **Parse — تحليل الصياغة** تعني فهم النص حسب قواعد الشكل المتفق عليه، وليس تشغيله ككود.

## إمتى العملية تفشل؟

لو النص ناقص قوسًا، `JSON.parse` لا ترجع قائمة. إنها ترمي **Exception — استثناء**: إشارة فشل توقف المسار العادي للتعليمات. لو لم نعالجها، قد ينتهي تنفيذ ضغطة الزر برسالة خطأ في أدوات المتصفح بدل نتيجة مفهومة للمستخدم.

`try` تحدد التعليمات التي قد تفشل. `catch` تستقبل الخطأ لو حصل داخل هذا المسار. مثال صغير للتوضيح فقط، وليس ملفًا كاملًا:

```js
try {
  const items = JSON.parse("[");
  console.log(items);
} catch (error) {
  console.warn(error.message);
}
```

السطر بعد `JSON.parse` لا يُنفذ هنا؛ ننتقل إلى `catch`. `error` قيمة تحمل تفاصيل الخطأ، و`message` نص الرسالة. `console.warn` يكتب تنبيهًا للمطوّر في **Console — لوحة رسائل المتصفح** التي تفتحها من أدوات المطور، غالبًا بـF12. رسالة المستخدم هنكتبها في الصفحة نفسها.

## نجاح القراءة لا يكفي

`42` و`null` و`[5]` أمثلة نصوص JSON صحيحة، لكنها مش قائمة أسماء مقبولة عندنا. **Validation — التحقق من البيانات** يسأل بعد القراءة: هل شكل القيمة ومحتواها مناسبين؟

هنقبل قائمة لا تزيد على 20 عنصرًا. كل عنصر نص غير فاضي، طوله لا يتجاوز 80 بوحدة `length` التي شرحناها في [درس النصوص](/programming-basics/computer-fundamentals/13-text-processing/). `Array.isArray` تتأكد أنها قائمة، و`typeof item` تسأل عن نوع العنصر؛ النص يعطي `"string"`.

`throw new Error("...")` تنشئ إشارة فشل برسالة نختارها ثم ترميها. نستخدمها هنا لو شكل البيانات لا يناسب قواعدنا، حتى نجمع مسار الرفض في مكان واحد. خطأ الصياغة وفشل القاعدة مختلفان، لكن المستخدم في الحالتين يحتاج يصلح المدخل ويحاول تاني.

## مثال كامل

احفظه باسم `errors.html` أو [افتح المثال](/examples/first-program/errors.html). `textarea` خانة نص متعددة السطور، و`rows` و`cols` يحددان حجمها الظاهر؛ مش حدًا أقصى لحجم البيانات.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Handle invalid saved data</title>
<h1>Read a list</h1>
<p><label for="data">JSON list of text items</label><br><textarea id="data" rows="4" cols="25">["milk","bread"]</textarea></p>
<button id="read">Read</button>
<p id="status" role="status"></p>
<p id="output">No valid list yet.</p>
<script>
function readList() {
  const status = document.querySelector("#status");
  try {
    const items = JSON.parse(document.querySelector("#data").value);
    if (!Array.isArray(items) || items.length > 20) {
      throw new Error("Expected a list with at most 20 items.");
    }
    for (const item of items) {
      if (typeof item !== "string" || item.trim() === "" || item.length > 80) {
        throw new Error("Each item must be nonempty text of at most 80 units.");
      }
    }
    document.querySelector("#output").textContent = "Items: " + items.join(" / ");
    status.textContent = "Read " + items.length + " items.";
  } catch (error) {
    status.textContent = "Cannot read this list. Check its format and items, then try again.";
    console.warn(error.message);
  }
}
document.querySelector("#read").addEventListener("click", readList);
</script>
</html>
```

بالقيمة الأولى تظهر `Read 2 items.` ثم `Items: milk / bread`. غيّرها إلى `[` واضغط Read: تظهر رسالة رفض، وتفضل القائمة السليمة السابقة ظاهرة. الرسالة تقول إن القراءة الجديدة فشلت، علشان ما نفتكرش إن القائمة القديمة نتيجة النص الجديد.

## تجربة فشل ثم إصلاح

| النص | النتيجة |
|---|---|
| `["milk","bread"]` | قائمة من عنصرين |
| `[` أو `["milk",]` | صياغة غير صالحة |
| `42` أو `null` | صياغة صالحة لكن ليست قائمة |
| `["milk",5]` أو `[" "]` | قائمة لكن عنصر فيها مرفوض |
| `[]` | قائمة فاضية مقبولة |

**تمرين وحله:** ابدأ بقائمة صحيحة، ثم جرّب `["milk",5]`. استبدل 5 بالنص `"5"` لتنجح القراءة وفق قواعد المثال. ده لا يحوّل الاسم إلى كمية؛ الفرق إننا نطلب عناصر نصية فقط. لو عايزين أسماء منتجات فعلية، نضيف سياسة مختلفة بدل تخمينها من النوع.

## الفشل مش كله استثناءات

ملف غير موجود أثناء محاولة فتحه برمجيًا قد ينتج خطأ من أداة القراءة. غياب قيمة محفوظة في واجهة أخرى قد يرجع علامة مثل `null` بدل رمي استثناء؛ هنشوف ده في الدرس التالي. اقرأ سلوك الأداة ولا تفترض إن `catch` هيعرف كل حالات الفشل وحده.

ما تكتبش `catch` فارغة، ولا تعرض «تم» بعد فشل العملية، ولا تمسح نتيجة المستخدم الجيدة قبل التأكد من البديل. و`try/catch` هنا لا يصلح خطأ كتابة يمنع تفسير ملف JavaScript نفسه، مثل قوس ناقص في مصدر البرنامج. أصلح المصدر أولًا باستخدام رسالة أدوات المطور.

للتفاصيل: [قراءة JSON وأخطاء الصياغة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).
