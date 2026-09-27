---
title: "استقبل بيانات من المستخدم وتأكد منها"
description: "احسب تكلفة من خانات يملأها المستخدم، وافصل بين النص والعدد والقيمة المسموح بها."
sidebar:
  order: 20
prev: {"link":"/programming-basics/computer-fundamentals/11-functions-and-lists/","label":"الدوال ثم القوائم: نظّم الحساب والبيانات"}
next: {"link":"/programming-basics/computer-fundamentals/13-text-processing/","label":"نظّف النص وابحث فيه وقسّمه"}
---

في مثال الكراسات كنا بنغيّر السعر والكمية داخل الكود. المستخدم محتاج يكتبهم في الصفحة نفسها. هنضيف خانتين وزر، وبعدها نتأكد من البيانات قبل الحساب. المطلوب تكون جرّبت [الدوال والقوائم](/programming-basics/computer-fundamentals/11-functions-and-lists/): الدالة خطوات بنشغّلها باسمها.

## جرّب خانة واحدة الأول

`input` خانة كتابة، و`value` النص الموجود فيها. `trim()` ترجع النص بعد حذف مسافات الطرفين. الزر `button` يشغّل الدالة عند حدث الضغط `click`؛ الربط اسمه `addEventListener`. نعرض الرد في فقرة `p` باستخدام `textContent`.

`===` تعني تطابق القيمة والنوع، و`""` نص فاضي. `Number` تحوّل النص لعدد، و`Number.isFinite` تفحص أنه عدد محدود؛ `!` تعكس الإجابة. `return` تنهي الضغطة الحالية عند الخطأ. في المثال الأكبر `||` معناها «أو»؛ يكفي أن يكون شرط واحد صحيحًا.

احفظ باسم `one-input.html`. جرّب بالترتيب: `12.5`، مسافات، `abc`. المتوقع رقم، ثم طلب كتابة، ثم رسالة رفض. هنا لم نضع حدود السعر بعد؛ دي الخطوة التالية.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>One input</title>
<label>Price <input id="price"></label>
<button id="read">Read</button>
<p id="output"></p>
<script>
function readPrice() {
  const text = document.querySelector("#price").value.trim();
  const output = document.querySelector("#output");
  if (text === "") {
    output.textContent = "Enter a price.";
    return;
  }
  const price = Number(text);
  if (!Number.isFinite(price)) {
    output.textContent = "Enter a number.";
    return;
  }
  output.textContent = price;
}
document.querySelector("#read").addEventListener("click", readPrice);
</script>
</html>
```

## من ضغطة الزر للحساب

**Input — خانة إدخال** عنصر يكتب فيه المستخدم. خاصية `value` بتعطينا المكتوب **كنص**، حتى لو شكله رقم. **Event — حدث** حاجة حصلت في الصفحة، زي ضغطة زر. **Event listener — مستمع حدث** ربط حدث بدالة تتنفذ لما يحصل.

هنربط ضغطة `click` بالدالة `calculate`. بنمرّر اسم الدالة من غير `()` لأننا عايزين المتصفح يناديها عند الضغط؛ كتابة `calculate()` هنا تشغّلها فورًا أثناء تجهيز الصفحة.

مسار البيانات هو: **كتابة نص ← فحص الفراغ ← تحويل لعدد ← فحص النوع والحدود ← حساب وعرض**. كل فحص بيجاوب سؤالًا مختلفًا؛ نجاح التحويل وحده مش معناه إن الكمية مناسبة.

## جرّب مثالًا كاملًا

احفظ الآتي في `input.html` داخل مجلد التدريب وافتحه بالمتصفح، أو [شغّل المثال](/examples/first-program/input.html). `Price` السعر، و`Quantity` الكمية، و`Calculate` احسب.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Read and validate input</title>
<h1>Notebook cost</h1>
<p><label for="price">Price (0 to 1000000)</label><br><input id="price" inputmode="decimal"></p>
<p><label for="quantity">Quantity (1 to 1000)</label><br><input id="quantity" inputmode="numeric"></p>
<button id="calculate">Calculate</button>
<p id="output" role="status"></p>
<script>
const output = document.querySelector("#output");

function calculate() {
  const priceText = document.querySelector("#price").value.trim();
  const quantityText = document.querySelector("#quantity").value.trim();
  if (priceText === "" || quantityText === "") {
    output.textContent = "Enter both values.";
    return;
  }
  const price = Number(priceText);
  const quantity = Number(quantityText);
  if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
    output.textContent = "Enter numbers, such as 12.5 and 3.";
    return;
  }
  if (price < 0 || price > 1000000 || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
    output.textContent = "Price: 0 to 1000000. Whole quantity: 1 to 1000.";
    return;
  }
  output.textContent = "Total: " + price * quantity;
}

document.querySelector("#calculate").addEventListener("click", calculate);
</script>
</html>
```

اكتب السعر `12.5` والكمية `3` واضغط الزر؛ تظهر `Total: 37.5`. تغيير الخانات وحده لا يعيد الحساب؛ الضغطة الجديدة تقرأ القيم الجديدة.

## افهم الخانات والربط

- `label` اسم ظاهر للخانة، و`for="price"` يربطه بالخانة التي تحمل `id="price"`. المعرّف `id` اسم نستخدمه للوصول لعنصر محدد.
- `inputmode` يقترح لوحة مفاتيح مناسبة على الهاتف؛ ما يمنعش كتابة قيم غير صالحة، وما يغنيش عن الفحص.
- `document.querySelector("#price")` يجد العنصر بمعرّفه، و`.value` تقرأ النص. `trim()` ترجع نسخة من النص من غير المسافات في أوله وآخره. هنجرّبها أكثر في الدرس التالي.
- `button` زر. `addEventListener("click", calculate)` يربط الضغط بالدالة. عنصر `p` فقرة نعرض فيها الرسالة باستخدام `textContent`، أي عرضها كنص.
- `role="status"` يساعد أدوات قراءة الشاشة في إعلان تغيّر الرسالة. سطر `viewport` يجعل عرض الصفحة مناسبًا لشاشة الهاتف.

## ليه الفحص بالترتيب ده؟

`===` تسأل عن تطابق القيمة والنوع؛ `priceText === ""` يعني النص فاضي. `||` معناها «أو»: يكفي فشل أي خانة. `return` هنا ينهي الدالة من غير نتيجة حساب، فمفيش تعليمات تحت الشرط تتنفذ في الضغطة دي.

`Number("12.5")` يحوّل النص لعدد. `Number("abc")` يرجع `NaN`، اختصار **Not a Number**: قيمة خاصة بتقول إن التحويل ما طلعش عددًا. لكن `Number("")` يرجع صفر! علشان كده لازم نفحص الفراغ **قبل** التحويل؛ السعر المجاني صفر مختلف عن سعر لم يكتبه المستخدم.

`Number.isFinite` يتأكد إن القيمة عدد محدود، وليست `NaN` أو `Infinity`، أي اللانهاية. `!` يقلب نتيجة الفحص: «ليس عددًا محدودًا». `Number.isInteger` يتأكد إن الكمية من غير جزء كسري. المقارنات `<` و`>` تفحص الحدود.

سياسة المثال: السعر من صفر إلى مليون، والكمية عدد صحيح من 1 إلى 1000. دي حدود اختارناها للتدريب، مش قواعد تفرضها اللغة. لو مشروعك يسمح بكمية صفر، تغيّر القاعدة والرسالة والاختبارات معًا.

## اختبر القيم اللي ممكن تلخبط البرنامج

| السعر | الكمية | المتوقع ولماذا |
|---|---|---|
| `12.5` | `3` | `37.5` |
| `0` | `2` | `0`؛ منتج مجاني مسموح |
| مسافات فقط | `2` | طلب ملء الخانتين، بدل اعتبار الفراغ صفرًا |
| `abc` أو `12abc` | `2` | رسالة كتابة أعداد؛ لا نقبل جزءًا رقميًا من نص خاطئ |
| `10` | `2.5` أو `-1` أو `0` | رسالة حدود الكمية |
| `Infinity` | `1` | رفض القيمة غير المحدودة |

المثال يقبل الصيغ التي تفهمها `Number` مثل `1e2`، أي 100. هنستخدم الأرقام `0–9` والنقطة للكسور في التدريب؛ مثل `12.5`. الفاصلة في `12,5` أو الأرقام `١٢` تحتاج معالجة إضافية قبل التحويل هنا. قبول شكل كتابة معين قرار مستقل عن كون الناتج عددًا.

**تمرين وحله:** خلي الحد الأعلى للكمية 10. غيّر شرط `quantity > 1000` إلى `quantity > 10`، وعدّل وصف الخانة والرسالة. جرّب 10 فتنجح، و11 فتُرفض. تغيير الرسالة وحدها ما يغيرش السلوك.

العمليات الكسرية قد تقرّب بعض النتائج؛ المثال لتعلّم الإدخال والتحقق، وليس سياسة محاسبة للعملات. وفي تطبيق ويب بخادم، تعيد الفحص في الخادم أيضًا؛ المستخدم يقدر يغيّر كود الصفحة.

## راجع فهمك

- ليه `"0"` مقبول كسعر لكن `""` مرفوض؟ الأول قيمة اختارها المستخدم، والثاني غياب قيمة.
- لو ظهرت نتيجة قديمة بعد إدخال خاطئ؟ كل فرع رفض لازم يكتب رسالة بدل ترك الناتج القديم ظاهرًا على أنه ناتج المدخل الجديد.
- هل المتصفح يقرأ الكمية وقت فتح الصفحة؟ الدالة تقرأها وقت الضغط، لأن القراءة مكتوبة داخلها.

للتفاصيل: [تحويل القيم إلى Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).
