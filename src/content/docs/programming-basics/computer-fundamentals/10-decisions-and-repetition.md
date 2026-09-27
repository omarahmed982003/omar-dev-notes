---
title: "قرار بسيط وتكرار خطوات"
description: "هتجعل البرنامج يختار نتيجة حسب قيمة، ثم تجرب تكرار عملية. المطلوب فهم المتغيرات وتشغيل values.html."
sidebar:
  order: 18
prev: {"link":"/programming-basics/computer-fundamentals/09-values-and-calculations/","label":"القيم والمتغيرات والحساب"}
next: {"link":"/programming-basics/computer-fundamentals/11-functions-and-lists/","label":"الدوال ثم القوائم: نظّم الحساب والبيانات"}
---

هتجعل البرنامج يختار نتيجة حسب قيمة، ثم تجرب تكرار عملية. المطلوب فهم المتغيرات وتشغيل values.html (Hypertext Markup Language؛ لغة وصف بنية الصفحة وعناصرها).

## قرار واحد من غير تكرار

قبل الحلقات، استخدم غلاف أول برنامج وضع الجزء التالي داخل `<script>` بدل تعليماته القديمة. `if` تنفذ فرعًا لو الشرط صحيح، و`else` تنفذ البديل:

```js
const age = 17;
if (age >= 18) {
  document.body.textContent = "Adult";
} else {
  document.body.textContent = "Under 18";
}
```

`>=` تعني أكبر من أو يساوي. توقع النتائج مع 17 و18 و19 قبل التشغيل: Under 18، ثم Adult مرتين. المثال يفترض عمرًا صالحًا؛ درس إدخال المستخدم هيضيف التحقق. اشرح لماذا تدخل حالة 18 في الفرع الأول، وبعدها انتقل للتكرار.

## اختر الفرع المناسب

الشرط Condition سؤال نتيجته صحيحة أو خاطئة. `quantity < 0` يسأل هل الكمية أقل من صفر. `if` تنفذ الجزء الأول عندما الشرط صحيح، و`else` تنفذ الجزء الآخر. الأقواس المعقوفة `{ }` تجمع التعليمات التابعة لكل جزء.

احفظ المثال باسم `conditions.html`. نفترض هنا أن quantity عدد صحيح مكتوب في الكود، وليس نصًا واردًا من مستخدم:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Quantity check</title>
</head>
<body>
<script>
let price = 10;
let quantity = 3;
if (quantity < 0) {
  document.body.textContent = "Invalid quantity";
} else {
  document.body.textContent = price * quantity;
}
</script>
</body>
</html>
```

quantity=3 تعرض 30، و0 تعرض 0، و-1 تعرض Invalid quantity. المتصفح لا ينفذ الفرعين معًا في هذا الاختيار. سياسة المثال تسمح بصفر كتكلفة عدم شراء شيء؛ لو شرط المسألة واحدة على الأقل غيّر الفحص إلى `quantity < 1`. [جرّب المثال](/examples/first-program/conditions.html).

## كرر عملية بدل نسخها

الحلقة Loop تكرر تعليمات وفق قاعدة. نجمع 1 و2 و3 من غير كتابة ثلاث تعليمات جمع منفصلة. احفظ المثال التالي باسم `loops.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Sum three numbers</title>
</head>
<body>
<script>
let total = 0;
for (let number = 1; number <= 3; number = number + 1) {
  total = total + number;
}
document.body.textContent = total;
</script>
</body>
</html>
```

`for` فيها بداية `number = 1`، وفحص `number <= 3` قبل كل دورة، ثم زيادة `number = number + 1` بعدها. `<=` معناها أصغر من أو يساوي. داخل الجسم نضيف number إلى total ثم نحفظ المجموع الجديد.

| الدورة | number | total قبل الجمع | total بعده |
|---|---:|---:|---:|
| الأولى | 1 | 0 | 1 |
| الثانية | 2 | 1 | 3 |
| الثالثة | 3 | 3 | 6 |

بعد الزيادة يصبح number=4 فيفشل الشرط وتنتهي الحلقة؛ تعرض الصفحة 6. [المثال العامل](/examples/first-program/loops.html) للمقارنة. لا تحذف الزيادة كتجربة: قد تجعل الحلقة لا تنتهي وتعلق الصفحة. لو علقت صفحة تدريب، أغلق تبويبها وافحص الكود قبل فتحه مجددًا.

**تدريب محلول:** اجمع 1 إلى4. غيّر حد الفحص من3 إلى4، وتوقع 10. لو ظهر 6 فأنت غالبًا لم تحفظ التغيير أو فتحت الملف الآخر. لو غيّرت `<=` إلى `<` مع الحد4 ستجمع1 و2 و3 فقط؛ هذا اختلاف منطقي في شرط التوقف.
