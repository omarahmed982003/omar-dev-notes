---
title: "ابنِ قائمة مشتريات واختبرها"
description: "اجمع الإدخال والنصوص والقوائم والدوال والتحقق والحفظ ومعالجة الفشل في برنامج صغير."
sidebar:
  order: 25
prev: {"link":"/programming-basics/computer-fundamentals/15-saving-data/","label":"احفظ قائمة وافتحها من جديد"}
next: {"link":"/programming-basics/computer-fundamentals/04-tech-fields-ai-engineering-mindset/","label":"راجع مشروعك واختار الخطوة التالية"}
---

دلوقتي هنستخدم الأفكار مع بعض. المطلوب قائمة تضيف لها اسم صنف وكمية، وتشوفها على الشاشة، وتحذف آخر صنف، وتحفظ وتسترجع نسخة. ابدأ بعد [درس الحفظ](/programming-basics/computer-fundamentals/15-saving-data/)؛ كل الأدوات الحسابية ومعالجة البيانات اتجرّبت قبله.

## ابنِه في أربع خطوات قابلة للتشغيل

كل رابط ملف كامل. احفظه في مجلد التدريب بنفس اسمه، وافتحه عبر الخادم المحلي. اقرأ وظيفة الخطوة، وجرّب المتوقع، ثم انتقل للتي بعدها.

| المرحلة | ما الذي تجربه؟ | علامة النجاح |
|---|---|---|
| [إضافة فقط](/examples/first-program/shopping-stage-1.html) | اكتب `milk` و`3`؛ القيم هنا مفترض أنها صالحة للتدريب | يظهر `3 x milk`؛ جرّب مدخلًا فاسدًا ولاحظ لماذا نحتاج الفحص |
| [إضافة مع تحقق](/examples/first-program/shopping-stage-2.html) | جرّب مسافات و`2.5` و`abc` قبل إضافة سليمة | رسالة رفض من غير تغيير القائمة |
| [إضافة وحذف](/examples/first-program/shopping-stage-3.html) | أضف عنصرين، احذف، ثم احذف حتى الفراغ | `pop()` تحذف آخر قيمة، وإعادة العرض تطابق البيانات |
| [حفظ واسترجاع](/examples/first-program/shopping.html) | احفظ ثم أغلق وافتح واضغط Load | ترجع النسخة المحفوظة؛ الحفظ منفصل عن الإضافة |

ابدأ بالمرحلة الأولى؛ الجزء المشترك هو قراءة الخانات، والإضافة بـ`push`، ثم العرض. المرحلة الثانية تضيف `if` قبل تغيير القائمة. الثالثة تضيف زرًا ودالة حذف. الرابعة تضيف `try/catch` حول قراءة المخزن والكتابة فيه، كما جرّبت في درس الحفظ. الكود الكامل تحت مرجع للمرحلة الرابعة، وليس نقطة البداية.

## شغّل نسختك على جهازك

اتبع [تجهيز الخادم المحلي](/programming-basics/computer-fundamentals/17-local-server/)، ثم افتح `http://127.0.0.1:8000/shopping.html`. احتفظ بنفس العنوان عند إغلاق الصفحة وفتحها.

## اتفق على السلوك قبل كتابة الكود

- الاسم بعد حذف مسافات الأطراف غير فاضي ولا يزيد على 60 وحدة `length`؛ افتكر إن بعض الرموز المرئية أكثر من وحدة.
- الكمية عدد صحيح من 1 إلى 100، والقائمة لا تزيد على 20 عنصرًا.
- إضافة نفس الصنف مرتين مسموحة؛ المثال لا يجمع المتشابه تلقائيًا.
- الإضافة والحذف يغيّروا القائمة على الشاشة فقط. Save تحفظ نسخة؛ Load تستبدل الحالية بالنسخة المحفوظة. احفظ تعديلك أولًا لو عايز تحتفظ به.
- لو الحفظ أو القراءة فشل، نعرض رسالة ونحافظ على القائمة الحالية.

هنمثل كل سطر كنص، مثل `"3 x milk"`، داخل قائمة نصوص. ده اختيار صغير يناسب الدروس السابقة. لو احتجنا تعديل الكمية وحدها أو جمعها لكل صنف، هنحتاج بيانات تفصل الاسم عن العدد؛ لا نستخرجها بتخمين أجزاء النص المعروض.

## قسّم المسؤوليات

| الدالة | مدخلها العملي | شغلها |
|---|---|---|
| `addItem` | الاسم والكمية في الخانتين | تتحقق ثم تضيف نصًا للقائمة |
| `renderList` | القائمة الموجودة أثناء التشغيل | تعيد عرض عناصرها |
| `removeLastItem` | القائمة | تحذف آخر عنصر لو فيه عنصر |
| `saveList` | القائمة | تكتب نسخة في مخزن المتصفح |
| `loadList` | النسخة المحفوظة | تقرأ وتتحقق قبل استبدال الحالية |

الرسم المختصر لمسار الإضافة: **خانتان ← تحقق ← قائمة في الذاكرة ← عرض**. الحفظ مسار مستقل من القائمة إلى المخزن؛ وضوح الفصل ده يمنع رسالة نجاح حفظ لم يحصل.

## الجزء الجديد: عرض عناصر منفصلة

`ol` عنصر HTML لقائمة مرقّمة، و`li` عنصر واحد داخلها. `document.createElement("li")` ينشئ عنصرًا جديدًا، و`list.append(row)` يضيفه للقائمة في الصفحة. نسند النص إلى `textContent` علشان يفضل بيانات حتى لو فيه علامات تشبه HTML.

دالة العرض تمسح العرض القديم بـ`list.textContent = ""` ثم تمر على بيانات `items`. هي لا تمسح `items` نفسها. `pop()` تحذف آخر عنصر من قائمة البيانات. نفحص الطول أولًا علشان نعرض رسالة مناسبة لما القائمة تكون فاضية.

سطر `style` يحدد شكل العرض: `overflow-wrap: anywhere` يسمح بكسر اسم طويل على أكثر من سطر داخل عناصر القائمة، علشان ما يخرجش من شاشة الهاتف. السطر ده لا يغيّر البيانات.

## شغّل المشروع

افتح [مشروع قائمة المشتريات](/examples/first-program/shopping.html). زي درس الحفظ، استخدم نفس عنوان الموقع ونفس ملف المتصفح الشخصي لاسترجاع النسخة. الكود الكامل التالي يمكن حفظه باسم `shopping.html` وتشغيله عبر خادم محلي؛ فتح `file://` ليس اختبارًا مضمونًا للحفظ.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shopping list project</title>
<style>li { overflow-wrap: anywhere; }</style>
<h1>Shopping list</h1>
<p><label for="name">Item name</label><br><input id="name"></p>
<p><label for="quantity">Whole quantity (1 to 100)</label><br><input id="quantity" inputmode="numeric" value="1"></p>
<button id="add">Add item</button>
<button id="remove">Remove last item</button>
<button id="save">Save</button>
<button id="load">Load saved list</button>
<ol id="list"></ol>
<p id="status" role="status"></p>
<script>
const key = "foundations-shopping-v1";
const status = document.querySelector("#status");
let items = [];

function renderList() {
  const list = document.querySelector("#list");
  list.textContent = "";
  for (const item of items) {
    const row = document.createElement("li");
    row.textContent = item;
    list.append(row);
  }
}

function addItem() {
  const name = document.querySelector("#name").value.trim();
  const quantityText = document.querySelector("#quantity").value.trim();
  const quantity = Number(quantityText);
  if (name === "" || name.length > 60 || quantityText === "" || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    status.textContent = "Enter a short name and a whole quantity from 1 to 100.";
    return;
  }
  if (items.length >= 20) {
    status.textContent = "The list is full: at most 20 items.";
    return;
  }
  items.push(quantity + " x " + name);
  renderList();
  status.textContent = "Added. Save to keep this change.";
}

function removeLastItem() {
  if (items.length === 0) {
    status.textContent = "The list is already empty.";
    return;
  }
  items.pop();
  renderList();
  status.textContent = "Removed. Save to keep this change.";
}

function saveList() {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    status.textContent = "Saved " + items.length + " items on this browser.";
  } catch (error) {
    status.textContent = "Not saved. Your list is still on screen; keep a separate copy before closing.";
    console.warn(error.message);
  }
}

function loadList() {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      status.textContent = "No saved list yet. Current list unchanged.";
      return;
    }
    const restored = JSON.parse(saved);
    if (!Array.isArray(restored) || restored.length > 20) {
      throw new Error("Invalid saved list.");
    }
    for (const item of restored) {
      if (typeof item !== "string" || item.trim() === "" || item.length > 80) {
        throw new Error("Invalid saved item.");
      }
    }
    items = restored;
    renderList();
    status.textContent = "Loaded " + items.length + " items.";
  } catch (error) {
    status.textContent = "Cannot load the saved list. Current list unchanged.";
    console.warn(error.message);
  }
}

document.querySelector("#add").addEventListener("click", addItem);
document.querySelector("#remove").addEventListener("click", removeLastItem);
document.querySelector("#save").addEventListener("click", saveList);
document.querySelector("#load").addEventListener("click", loadList);
renderList();
</script>
</html>
```

ابدأ باسم `milk` والكمية `3`: تظهر `3 x milk`. أضف `bread` والكمية `2`: يبقى عندك سطران. اضغط Save، واقفل التبويب، وافتح نفس الرابط ثم Load؛ يرجع السطران. عند الفتح نبدأ بقائمة فاضية في الذاكرة؛ الاسترجاع هنا باختيار المستخدم.

## ابنه على مراحل

1. جهّز الخانات والعرض، وجرّب إضافة عنصر واحد. تأكد إن القائمة المعروضة جاية من `items`.
2. أضف فحص المدخلات قبل `push`. جرّب اسمًا فاضيًا وكمية `2.5`؛ لازم القائمة ما تتغيرش.
3. جرّب حذف آخر عنصر، ثم الحذف من قائمة فاضية. متى نحتاج إعادة العرض؟ بعد أي تغيير فعلي في البيانات.
4. صِل الحفظ والقراءة اللذين جرّبتهما في الدرس السابق. رسالة Saved لا تظهر إلا بعد نجاح الكتابة.

الكود الكامل مرجع تقارن به كل مرحلة؛ حاول كتابة المرحلة وفهم نتيجتها قبل نسخ الجزء التالي.

## اختبارات قبول للمشروع

**اختبار قبول** تجربة تثبت إن مطلبًا من المتطلبات الأولى تحقق. اكتب المتوقع ثم نفّذ:

| التجربة | المتوقع |
|---|---|
| `milk` مع `3` ثم `bread` مع `2` | سطران بالترتيب |
| اسم كله مسافات، أو كمية `abc` أو `2.5` أو صفر | رسالة رفض والقائمة كما هي |
| إضافة بعد وصول القائمة إلى 20 عنصرًا | رفض الزيادة؛ لا عنصر 21 |
| Remove last item بعد وجود سطرين | يبقى السطر الأول |
| الحذف من قائمة فاضية | رسالة واضحة من غير خطأ |
| Save ثم إعادة فتح الصفحة ثم Load | استرجاع النسخة التي حُفظت |
| تعديل من غير Save ثم Load | العودة لآخر نسخة محفوظة، كما وعد الزر |
| حفظ قائمة فاضية ثم Load | قائمة فاضية مقبولة |
| اسم `<b>milk</b>` | النص نفسه؛ لا يتحول إلى تنسيق |

لو مخزن المتصفح ممنوع، Save تعرض Not saved وتفضل القائمة على الشاشة. لا تعتبر ظهورها دليلًا على بقائها بعد الإغلاق. لو النص المحفوظ تالف أو شكله غير مناسب، Load ترفضه قبل تغيير `items`. جرّب البيانات التالفة في [مثال قراءة JSON](/examples/first-program/errors.html)، واختبر منع الحفظ في ملف متصفح للتدريب بدل تغيير إعدادات حسابك الرئيسي.

## تعديل صغير بحل مشروح

**المطلوب:** اسمح بحد أقصى خمسة أصناف بدل عشرين. غيّر شرط الإضافة إلى `items.length >= 5` وفحص القائمة المسترجعة إلى `restored.length > 5`، وحدّث رسالة الامتلاء. جرّب أربعة وخمسة وستة، وجرب قراءة نسخة قديمة فيها ستة. تغيير الإضافة وحدها يسمح للقراءة بتجاوز السياسة الجديدة.

المشروع مكتمل بالنسبة للمتطلبات المذكورة، لكنه لا يزامن الأجهزة ولا يدير حسابات ولا يحل تضارب التعديل بين تبويبين. الخطوة التالية إنك تقدر تشرحه وتعيد تطبيق فكرته بلغة تختارها، مش تضيف كل المزايا دفعة واحدة.

## لو احتجت تعدّل الكمية وحدها

**Object — كائن بيانات** يجمع قيمًا بأسماء. `name` اسم خاصية وقيمتها نص، و`quantity` خاصية وقيمتها عدد. النقطتان `:` تفصلان اسم الخاصية عن قيمتها، و`.` تقرأ الخاصية أو تعدّلها. جرّب المثال المستقل باسم `records.html`:

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Keep name and quantity separate</title>
<pre id="output"></pre>
<script>
const product = { name: "milk", quantity: 3 };
product.quantity = product.quantity + 1;
document.querySelector("#output").textContent = product.name + ": " + product.quantity;
</script>
</html>
```

الناتج `milk: 4`. العرض نص نكوّنه من البيانات؛ مش هو مكان حفظ الكمية. **تمرين:** أضف خاصية `price: 10`، واعرض حاصل `product.price * product.quantity`؛ المتوقع 40. الكائن يمكن وضعه في قائمة ثم تحويله بـ`JSON.stringify`. تغيير مشروع المشتريات لكائنات يحتاج تحديث التحقق عند التحميل أيضًا؛ نسخة النصوص القديمة لا تطابق الشكل الجديد تلقائيًا.
