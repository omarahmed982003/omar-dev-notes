---
title: 5. الشروط والحلقات
description: if وswitch وmatch وfor وwhile وdo-while وforeach مع أهم الفروق والأخطاء.
sidebar:
  order: 5
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **Loop:** حلقة تكرار تعيد تنفيذ مجموعة تعليمات وفق شرط.


## البرنامج بياخد قرار إزاي؟

لحد دلوقتي كتبنا تعليمات بتتنفذ بالترتيب. لكن أي برنامج حقيقي محتاج يختار: لو المستخدم مسجل دخول اعرض حسابه، ولو مش مسجل دخوله ودّيه لصفحة الدخول. ومحتاج يكرر: اطبع كل المنتجات، أو حاول قراءة الإدخال لحد ما يبقى صحيحًا.

ده اسمه **Control Flow**، يعني الطريق اللي التنفيذ بيمشي فيه. الشروط تختار فرعًا، والحلقات تكرر مجموعة تعليمات. قبل ما تكتب شرطًا، حوّل قاعدة العمل لسؤال نتيجته `true` أو`false`:

```text
هل الدرجة بين 0 و100؟
هل المستخدم نشط وعنده الصلاحية؟
هل لسه فيه عناصر ما اتعالجتش؟
```

مثلًا ترتيب شروط التقدير مهم. لو بدأت بـ`$score >= 50`، فالطالب صاحب 95 هيدخل أول فرع ومش هيوصل لامتياز. رتب الشروط من الأكثر تحديدًا أو الأعلى إلى الأقل، واختبر القيم عند الحدود نفسها: 49 و50 و74 و75.

```php
$score = 75;

if ($score < 0 || $score > 100) {
    $grade = 'invalid';
} elseif ($score >= 90) {
    $grade = 'A';
} elseif ($score >= 75) {
    $grade = 'B';
} elseif ($score >= 50) {
    $grade = 'C';
} else {
    $grade = 'F';
}
```

أثناء قراءة أي Loop، دور على ثلاث حاجات: قيمة البداية، شرط الاستمرار، والخطوة اللي تقربنا من النهاية. لو واحدة منهم ناقصة، ممكن تعمل Infinite Loop.

## if وelseif وelse

```php
$score = 82;

if ($score >= 90) {
    $grade = 'A';
} elseif ($score >= 75) {
    $grade = 'B';
} else {
    $grade = 'C';
}
```

في القوالب يمكن استخدام الصياغة البديلة:

```php
<?php if ($grade === 'A'): ?>
  <strong>ممتاز</strong>
<?php else: ?>
  <span>استمر</span>
<?php endif; ?>
```

### Ternary وNull coalescing وNullsafe

```php
$label = $active ? 'نشط' : 'متوقف';
$username = $_GET['username'] ?? 'guest';
$postId = $user?->latestPost()?->id; // null إذا انقطعت السلسلة عند null
```

`??` يفحص الوجود وعدم `null` بطريقة تشبه `isset`. والـ nullsafe operator هو `?->`، لا `?.`.

## switch

```php
switch ($role) {
    case 'admin':
        $permissions = ['all'];
        break;
    case 'editor':
        $permissions = ['read', 'write'];
        break;
    default:
        $permissions = ['read'];
}
```

نسيان `break` يسبب fall-through وقد يكون مقصودًا أو خطأ. تاريخيًا يستخدم `switch` مقارنة غير صارمة، لذلك تجنب خلط الأنواع.

## match

```php
$message = match ($status) {
    200, 201 => 'نجاح',
    404 => 'غير موجود',
    default => 'خطأ غير متوقع',
};

$category = match (true) {
    $age < 13 => 'طفل',
    $age < 18 => 'مراهق',
    default => 'بالغ',
};
```

`match` expression تعيد قيمة، تستخدم `===`، لا يحدث فيها fall-through، ولا تحتاج `break`. وإذا لم يوجد arm مطابق ولا `default` ترمي `UnhandledMatchError`.

## for

```php
for ($i = 0; $i < 5; $i++) {
    echo $i;
}

$names = ['Ali', 'Mona', 'Omar'];
for ($i = 0, $count = count($names); $i < $count; $i++) {
    echo $names[$i];
}
```

الأجزاء الثلاثة اختيارية؛ `for (;;)` حلقة لا نهائية وتحتاج `break` أو نهاية للعملية. توجد صياغة `for (...): ... endfor;` للقوالب.

## while وdo-while

```php
$attempts = 0;
while ($attempts < 3) {
    $attempts++;
}

do {
    $input = readline();
} while ($input === '');
```

`while` تفحص قبل التنفيذ وقد لا تعمل مرة واحدة. `do-while` تنفذ الجسم مرة على الأقل.

## foreach

```php
$users = [
    ['id' => 1, 'name' => 'Ali'],
    ['id' => 2, 'name' => 'Mona'],
];

foreach ($users as $index => ['id' => $id, 'name' => $name]) {
    echo "{$index}: {$id} - {$name}";
}
```

التعديل بالمرجع:

```php
$prices = [10, 20, 30];

foreach ($prices as &$price) {
    $price *= 1.14;
}
unset($price); // مهم: إزالة المرجع الباقي من آخر عنصر
```

استخدم `continue` لتخطي الدورة الحالية و`break` لإنهاء الحلقة. ويمكن `break 2` للخروج من حلقتين متداخلتين، وهو أوضح غالبًا من `goto`.

## تدريب عملي متدرج

<details><summary>1. توقع التقدير عند الدرجات 49 و50 و75 و90</summary><p>تتبّع الشروط من فوق لتحت. الحدود المفروض تنتج F وC وB وA. لو نتيجة مختلفة، راجع ترتيب الفروع واستخدام <code>&gt;=</code>.</p></details>

<details><summary>2. اكتشف الـInfinite Loop</summary><p>في <code>$i = 0; while ($i &lt; 3) { echo $i; }</code> لا تتغير <code>$i</code>. أضف <code>$i++</code> داخل الحلقة، وتوقع الناتج قبل التشغيل.</p></details>

<details><summary>3. اختار بين switch وmatch</summary><p>لو محتاج قيمة ناتجة، ومقارنة صارمة، ومنع Fall-through، استخدم <code>match</code>. استخدم <code>switch</code> بحذر عند التعامل مع كود قديم أوتدفق يحتاج أكثر من Statement.</p></details>

## مسائل مرتبطة بالدرس

<details><summary>متى تستخدم <code>match</code> بدل <code>switch</code>؟</summary><p>عندما تريد مقارنة صارمة تعيد قيمة ولا تسمح بالسقوط التلقائي بين الفروع.</p></details>

<details><summary>لماذا قد تصبح حلقة <code>while</code> لا نهائية؟</summary><p>إذا لم تتغير القيمة التي يعتمد عليها الشرط أو لم يوجد مسار خروج؛ اختبر التقدم في كل دورة.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php control-flow-lab.php
~~~

**معيار النجاح:** تغطي الحالات الحد الأدنى وما دونه والحد الأعلى وما فوقه، ويصل كل إدخال إلى فرع واحد مقصود فقط.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

<code>break</code> ينهي الحلقة الحالية و<code>continue</code> ينتقل للتكرار التالي، ويمكن تحديد مستوى في الحلقات المتداخلة لكن ذلك يحتاج وضوحًا. Alternative syntax مفيدة في templates. ضع حدًا أو تقدمًا قابلًا للإثبات لكل while، واختبر صفر دورة وآخر حد.

### جرّب بنفسك

اكتب حلقة ثم اختبر zero/one/many وحدًا يمنع infinite loop.
