---
title: "احفظ قائمة وافتحها من جديد"
description: "ميّز بين بيانات البرنامج أثناء التشغيل ونسخة محفوظة في المتصفح، وتعامل مع غياب البيانات أو تلفها أو منع الحفظ."
sidebar:
  order: 24
prev: {"link":"/programming-basics/computer-fundamentals/17-local-server/","label":"شغّل ملفاتك بعنوان محلي ثابت"}
next: {"link":"/programming-basics/computer-fundamentals/16-shopping-project/","label":"ابنِ قائمة مشتريات واختبرها"}
---

اكتب قائمة مشتريات، وبعدها أعد تحميل الصفحة: المتغيرات التي أنشأها البرنامج تبدأ من جديد. حفظ ملف HTML يحفظ **تعليمات البرنامج**، مش بالضرورة البيانات اللي المستخدم كتبها أثناء تشغيله. هنحفظ نسخة من القائمة ونسترجعها في تشغيل جديد.

## شغّل نسختك على جهازك

اتبع [تجهيز الخادم المحلي](/programming-basics/computer-fundamentals/17-local-server/)، ثم افتح `http://127.0.0.1:8000/storage.html`. احتفظ بنفس العنوان عند إغلاق الصفحة وفتحها.

## مكانان مختلفان للبيانات

| المكان | ماذا يحدث عند إعادة فتح الصفحة؟ |
|---|---|
| متغير مثل `items` أثناء التشغيل | يُنشأ من تعليمات البرنامج من جديد |
| `localStorage`، مساحة تخزين محلية يوفرها المتصفح | قد نجد النسخة التي حفظناها ونقرأها، ما دامت موجودة ومسموحًا الوصول لها |

`localStorage` تحفظ **نصوصًا تحت مفاتيح**. المفتاح اسم نختاره، زي `foundations-list-v1`. فكر فيه كعنوان درج داخل مخزن الصفحة. `setItem` تكتب نصًا تحت الاسم، و`getItem` تقرأه. الكتابة تحت نفس المفتاح تستبدل قيمته السابقة؛ عشان كده نتأكد من البيانات قبلها.

`JSON.stringify` تحول قائمة النصوص إلى نص JSON. دي عكس `JSON.parse` التي [استخدمناها في الدرس السابق](/programming-basics/computer-fundamentals/14-runtime-errors/). كلًا منهما تحويل، وليس تشفيرًا ولا حماية بكلمة سر.

## شغّل في مكان ثابت

ابدأ من [المثال العامل](/examples/first-program/storage.html) عبر عنوان الموقع. التخزين مرتبط **بالأصل — Origin**: نوع الاتصال واسم المضيف ورقم المنفذ. مثلًا، `http://localhost:4321` يختلف عن `http://localhost:8000`. وملفات المستخدمين وملفات المتصفح الشخصية المختلفة لا يلزم أن تشترك في نفس المخزن.

لو نسخت الكود إلى `storage.html`، شغّله عبر خادم محلي وعنوان `http://`، أو استعمل المثال المنشور للتجربة. سلوك التخزين عند فتح `file://` مباشرة غير مضمون بين المتصفحات؛ نجاحه على جهاز واحد مش قاعدة. تقدر تكتب الخانات وتشغّل كل التجارب من رابط المثال من غير تجهيز أدوات جديدة.

الوضع الخاص، ومسح بيانات الموقع، وحدود مساحة التخزين، وسياسة المتصفح قد تمنع الحفظ أو تزيله. دي مساحة تدريب محلية؛ لا تضع فيها كلمات مرور، ولا تعتبرها نسخة احتياطية أو مزامنة بين الأجهزة.

## البرنامج الكامل

اكتب عنصرًا في كل سطر. `Save` تحفظ، و`Load saved list` تقرأ آخر نسخة محفوظة وتستبدل **محتوى الخانة الحالي** بها. لا يوجد حفظ تلقائي هنا.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Save and restore a list</title>
<h1>My saved list</h1>
<p><label for="items">One item per line (up to 20)</label><br><textarea id="items" rows="6" cols="25">milk
bread</textarea></p>
<button id="save">Save</button>
<button id="load">Load saved list</button>
<p id="status" role="status"></p>
<script>
const key = "foundations-list-v1";
const editor = document.querySelector("#items");
const status = document.querySelector("#status");

function validateItems(items) {
  if (!Array.isArray(items) || items.length > 20) {
    throw new Error("Expected a list with at most 20 items.");
  }
  for (const item of items) {
    if (typeof item !== "string" || item.trim() === "" || item.length > 80) {
      throw new Error("Invalid list item.");
    }
  }
}

function saveList() {
  try {
    const items = [];
    for (const line of editor.value.split("\n")) {
      const item = line.trim();
      if (item !== "") items.push(item);
    }
    validateItems(items);
    localStorage.setItem(key, JSON.stringify(items));
    status.textContent = "Saved " + items.length + " items on this browser.";
  } catch (error) {
    status.textContent = "Not saved. Keep your text; check item lengths, count, and browser storage permissions.";
    console.warn(error.message);
  }
}

function loadList() {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) {
      status.textContent = "No saved list yet. Your current text is unchanged.";
      return;
    }
    const items = JSON.parse(saved);
    validateItems(items);
    editor.value = items.join("\n");
    status.textContent = "Loaded " + items.length + " items.";
  } catch (error) {
    status.textContent = "Cannot load the saved list. Your current text is unchanged.";
    console.warn(error.message);
  }
}

document.querySelector("#save").addEventListener("click", saveList);
document.querySelector("#load").addEventListener("click", loadList);
</script>
</html>
```

## فك المسار خطوة بخطوة

عند Save: نقرأ النص، ونقسمه عند `"\n"`، وهو رمز سطر جديد داخل نص JavaScript. ننظف كل سطر، ونترك الفاضي، ونضيف الباقي لقائمة. `validateItems` دالة تحقق تشبه درس الأخطاء: قائمة بحد أقصى 20 عنصرًا، وكل عنصر نص غير فاضي لا يتجاوز 80 وحدة طول.

بعد نجاح الفحص نحول القائمة لنص ونكتبها. رسالة Saved تأتي **بعد** نجاح `setItem`. لو الكتابة فشلت، `catch` تعرض Not saved وتترك خانة المستخدم كما هي، بدل ادّعاء إن البيانات محفوظة.

عند Load: لو `getItem` أعادت `null`، فالمفتاح غير موجود؛ نعرض رسالة وننهي الدالة. `null` قيمة تعني الغياب هنا، وليست النص `"null"`، وليست القائمة الفاضية `[]`. لو وجدنا نصًا، نقرأه بـ`JSON.parse` ونفحصه، ثم فقط نضعه في الخانة باستخدام `join("\n")`.

## تجربة تثبت إن الحفظ حصل

1. احفظ `milk` و`bread` في سطرين. تظهر `Saved 2 items on this browser.`
2. غيّر الخانة إلى `tea` من غير حفظ، واضغط Load: يرجع العنصران. النسخة المحفوظة أقدم من التعديل الحالي.
3. اقفل التبويب وافتح نفس الرابط من نفس ملف المتصفح الشخصي، ثم اضغط Load. المفروض يرجع العنصران لو المخزن لم يُمسح ولم يُمنع.
4. امسح محتوى الخانة واضغط Save، ثم Load. النتيجة قائمة فاضية محفوظة، وليست رسالة غياب مفتاح.

**تمرين وحله:** اكتب 21 سطرًا غير فاضي. الحفظ يُرفض، والخانة تفضل موجودة. احذف سطرًا لتصبح 20 واحفظ مرة أخرى. لا تغيّر الحد في جهة الحفظ وحدها؛ نفس دالة التحقق مستخدمة عند القراءة أيضًا.

## لما حاجة تفشل

لو القراءة أعطت رسالة فشل، ما تمسحش المخزن كله كأول محاولة. انسخ النص المهم لمفكرة، وراجع رسالة Console لمعرفة هل المشكلة في القراءة أم شكل البيانات. البيانات غير الصالحة لا تستبدل الخانة الحالية. الدرس السابق يتيح تجربة الصياغة التالفة في خانة منفصلة، بدل إفساد بيانات مهمة.

في تجربة بين تبويبين، آخر حفظ لنفس المفتاح يستبدل السابق. مثالنا لا يحل تعديل أكثر من مستخدم أو مزامنة الأجهزة. احتفظ بنسخة منفصلة من القائمة لو تحتاجها؛ الحفظ المحلي أداة محدودة لها مكان واضح.

للتفاصيل: [التخزين المحلي وحدوده](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## جرّب ملف بيانات مستقل

التخزين في المتصفح مش نفس ملف JSON على القرص. بعد تجهيز Node.js في الدرس السابق، أنشئ **مجلد تدريب جديدًا** واحفظ فيه [data-file.mjs](/examples/first-program/data-file.mjs). الامتداد mjs يحدد ملف JavaScript يشغّله Node.js كوحدة كود؛ هنا هنستخدم أداة قراءة وكتابة ملفات يوفرها Node نفسه.

```js
import { readFileSync, writeFileSync } from 'node:fs';

const mode = process.argv[2];
const filename = 'practice-list.json';
try {
  if (mode === 'save') {
    const items = ['milk', 'bread'];
    writeFileSync(filename, JSON.stringify(items), { encoding: 'utf8', flag: 'wx' });
    console.log('Saved a new practice-list.json');
  } else if (mode === 'read') {
    const items = JSON.parse(readFileSync(filename, 'utf8'));
    if (!Array.isArray(items)) throw new Error('Expected a list');
    for (const item of items) {
      if (typeof item !== 'string') throw new Error('Expected text items');
    }
    console.log(items.join(' / '));
  } else {
    console.log('Use: node data-file.mjs save OR node data-file.mjs read');
  }
} catch (error) {
  if (error.code === 'ENOENT') console.log('No saved file. Run the save command first.');
  else if (error.code === 'EEXIST') console.log('File already exists. Read it or use a new practice folder.');
  else console.log('Cannot complete the operation. Check the file format and access.');
  process.exitCode = 1;
}
```

`import` يختار دوال من مكتبة جاهزة، و`node:fs` مكتبة الملفات المدمجة. `writeFileSync` تكتب ملفًا وتنتظر انتهاء المحاولة، و`readFileSync` تقرأه؛ Sync تعني أن البرنامج ينتظر بدل متابعة تعليمات أخرى في نفس المسار. `process.argv[2]` هو أول اختيار كتبته بعد اسم الملف. `encoding: 'utf8'` يحدد ترميز النص. `flag: 'wx'` ينشئ ملفًا جديدًا ويرفض استبدال ملف موجود.

في PowerShell داخل مجلد التدريب نفّذ `node data-file.mjs read` أولًا: تظهر No saved file ورمز انتهاء غير صفري لأن الملف غير موجود. بعده `node data-file.mjs save`: يظهر ملف `practice-list.json`. اقفل الطرفية، وافتحها في نفس المجلد، ونفّذ read من جديد: يظهر `milk / bread`. البيانات بقيت بعد انتهاء البرنامج؛ ليست نفس المتغير القديم في الذاكرة.

`error.code` رمز يحدد نوع الخطأ؛ ENOENT يعني أن المسار المطلوب غير موجود، وEEXIST يعني أن الملف موجود فعلًا. `process.exitCode = 1` يعلن فشل المحاولة للأداة التي شغّلت البرنامج. لا نعرض نجاحًا بعد الفشل.

**تدريب:** افتح ملف JSON بالمفكرة وغيّره إلى `[`، واحفظ ثم جرّب read. تظهر رسالة فشل من غير حذف الملف. أصلحه إلى `["tea"]` ثم read؛ الناتج tea. أعد save على نفس المجلد: يُرفض الاستبدال المقصود في هذا المثال. واجهات الملفات والأخطاء هتتوسع مع لغة المسار الذي تختاره.
