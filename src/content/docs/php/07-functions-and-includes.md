---
title: 7. الدوال والـ Callbacks وتضمين الملفات
description: تعريف الدوال والوسائط والمراجع والـ closures والـ arrow functions وinclude وrequire.
sidebar:
  order: 7
---

## المشكلة: نفس الحساب مكتوب في خمس أماكن

لو قاعدة السعر اتغيرت، تعديل خمس نسخ ممكن ينسينا واحدة. **Function** دالة تجمع مهمة تحت اسم، تستقبل بيانات، وترجع نتيجة. مش لازم تحفظ مصطلحاتها مرة واحدة: **parameter** اسم المدخل في التعريف، **argument** القيمة عند الاستدعاء، و**return value** النتيجة الراجعة.

ابدأ بحساب يرجع قيمة بدل طباعتها؛ كده نقدر نعرضه في CLI أو HTML ونختبره. احفظ `functions.php`، PHP 8.0+، وشغّل `php functions.php`:

~~~php
<?php
declare(strict_types=1);

function subtotal(int $price, int $quantity = 1): int
{
    if ($price < 0 || $quantity < 1) {
        throw new InvalidArgumentException('Invalid order');
    }
    return $price * $quantity;
}
function receipt(int $price, int $quantity): string
{
    $amount = subtotal($price, $quantity);
    return "Total: {$amount}";
}
echo receipt(1500, 3), PHP_EOL;
echo subtotal(quantity: 2, price: 500), PHP_EOL;
~~~

~~~text
Total: 4500
1000
~~~

`declare` يجعل هذا الملف يستدعي دوال الأنواع scalar بصرامة. `function subtotal` تعريف؛ الجسم لا يعمل لمجرد قراءته. `int` قبل الاسم نوع المدخل وبعد القوس نوع الناتج. `= 1` قيمة افتراضية لو لم نمرر quantity. شرط البداية يرفض القيم خارج العقد؛ `throw` توقف المسار بفشل واضح، وهنفصلها في الدرس 11. `return` تنهي الاستدعاء وترسل حاصل الضرب. الدالة الثانية تركب رسالة من النتيجة. السطر الأخير **named arguments**: القيم مرتبطة بالأسماء، لذلك إعادة تسمية parameter قد تكسر المستدعي.

PHP لا تسمح بتعريف دالتين بنفس الاسم في Namespace واحدة حسب اختلاف عدد الوسائط. استخدم defaults أو Union Types أو variadic حسب المعنى. الأعداد هنا صغيرة؛ مراجعة حدود الضرب جزء من توسيع التطبيق.

## Call Stack: فين بيروح التنفيذ ويرجع إزاي؟

**Call Stack** رصّة الاستدعاءات النشطة. كل استدعاء يضيف **frame** فيه متغيراته ومكان الرجوع. آخر دالة دخلت هي أول واحدة ترجع. تتبع السطر `receipt(1500, 3)`:

~~~text
main
main → receipt(price=1500, quantity=3)
main → receipt → subtotal(price=1500, quantity=3)
main → receipt(amount=4500)
main → echo("Total: 4500")
~~~

متغير `$amount` محلي لـreceipt؛ المتغيرات المتشابهة في Frames مختلفة مش نفس المتغير. `return` ترجع للمستدعي، مش لبداية البرنامج. **Recursion** دالة تستدعي نفسها: كل مرة Frame جديد، فلازم حالة توقف وحد للمدخل. في `countdown.php`:

~~~php
<?php
function countdown(int $n): void
{
    if ($n < 0 || $n > 10) {
        throw new InvalidArgumentException('Use 0..10');
    }
    if ($n === 0) {
        echo "go", PHP_EOL;
        return;
    }
    echo $n, PHP_EOL;
    countdown($n - 1);
}
countdown(3);
~~~

~~~text
3
2
1
go
~~~

`void` تعني لا نتيجة مفيدة راجعة. فحص 0 هو **base case**، وطرح 1 يقربنا له؛ حذف أي منهما قد يستهلك الذاكرة. الدوال الصغيرة الواضحة أو Loop أنسب للتكرار البسيط، والـStack يساعد في فهم Trace عند الخطأ.

## القيمة والمرجع وvariadic

التمرير العادي لا يسمح للدالة بإعادة إسناد متغير المستدعي. `&` يجعلها تعدله مباشرة؛ استخدمه بسبب واضح. `...` في تعريف الدالة يجمع عددًا متغيرًا من arguments في Array. جرّب `arguments.php`:

~~~php
<?php
function increment(int $n): int { return $n + 1; }
function incrementInPlace(int &$n): void { $n++; }
function sum(int ...$numbers): int { return array_sum($numbers); }

$n = 4;
echo increment($n), ':', $n, PHP_EOL;
incrementInPlace($n);
echo $n, PHP_EOL;
echo sum(...[2, 3, 4]), PHP_EOL;
~~~

~~~text
5:4
5
9
~~~

الأول يرجع 5 ويترك n=4؛ الثاني يغير n إلى 5. `...` وقت الاستدعاء يفرد القائمة إلى arguments. إسناد object مختلف عن إعادة إسناد المتغير: ممكن دالة تعدل حالة نفس الكائن حتى بدون `&`؛ التفاصيل في OOP.

## Callback: ابعت طريقة الشغل، مش ناتجها

**Callable** قيمة قابلة للاستدعاء. **Callback** دالة تمررها لكود آخر ليقرر وقت استدعائها. لا تعني تلقائيًا شغلًا مؤجلًا أو متوازيًا. `array_map` مثلًا تستدعيها فورًا لكل عنصر. في `callbacks.php` نكتب المستدعي بأنفسنا عشان الفكرة تبقى واضحة:

~~~php
<?php
declare(strict_types=1);

function transform(array $values, callable $operation): array
{
    $result = [];
    foreach ($values as $value) {
        $result[] = $operation($value);
    }
    return $result;
}
$factor = 2;
$double = function (int $n) use ($factor): int {
    return $n * $factor;
};
$factor = 10;
$values = transform([1, 2, 3], $double);
echo implode(',', $values), PHP_EOL;
$plusOne = fn (int $n): int => $n + 1;
echo implode(',', transform($values, $plusOne)), PHP_EOL;
~~~

~~~text
2,4,6
3,5,7
~~~

`transform` تستقبل Array ودالة؛ لا تعرف هل العملية ضرب أم جمع. كل دورة تستدعي `$operation($value)` وترتب النتيجة. `function (...) use ($factor)` دالة مجهولة اسمها **Closure**، وتلتقط factor بالقيمة عند إنشائها: 2 حتى بعد تغييره إلى 10. `use (&$factor)` تراقب نفس المتغير؛ استخدمها فقط لو ده مقصود. `fn` هي Arrow Function، تعبير واحد بعودة ضمنية والتقاط خارجي بالقيمة.

**غلط:** تمرير `$double(3)` إلى transform يمرر العدد 6، مش دالة. الصحيح `$double` بدون استدعاء. دالة مسماة ممكن تشير لها بنص `'trim'` (variable function)، أو `trim(...)` من PHP 8.1 كـFirst-class Callable؛ بعدها تستدعي القيمة. استخدم `is_callable` لو المصدر غير مضمون، ولا تجعل المستخدم يختار اسم دالة عشوائيًا. Closure محلية أنسب من إعلان function مسماة داخل function؛ الإعلان الداخلي يحدث بعد استدعاء الخارجية ويشارك نطاق أسماء الدوال وقد يتكرر.

## مشروع ملفين: require ينفذ الملف

اعمل مجلدًا فيه `config.php` و`main.php`. ده مشروع كامل بدون Composer. الملف الأول يرجع بيانات؛ الثاني يحتاجها:

~~~php
<?php
// config.php
return ['name' => 'Notebook', 'limit' => 3];
~~~

~~~php
<?php
// main.php
$config = require __DIR__ . '/config.php';
echo $config['name'], ': ', $config['limit'], PHP_EOL;
~~~

~~~text
Notebook: 3
~~~

شغّل `php main.php`. `__DIR__` مجلد الملف الحالي؛ يحميك من اختلاف مجلد التشغيل. `require` يقرأ وينفذ الملف ثم يأخذ return. بدون return صريحة نتيجة التضمين الناجح عادة 1. الملف يرث نطاق مكان التضمين؛ لذلك تجنب اعتمادًا خفيًا على متغيرات خارجية.

`include` تصدر Warning عند الفشل وغالبًا تكمل. `require` ترمي Error في PHP الحديثة، فلا يكمل المسار بدون معالجة. نسختا `_once` تمنعان إعادة تحميل التعريفات. لا تستخدم require_once لقراءة Config ثم تتوقع نفس Array في كل استدعاء؛ التحميل الثاني قد يرجع true. لا تبن مسار التضمين من Input. الدرس 10 ينقل تحميل Classes إلى Composer.

`goto` تقفز إلى label داخل الملف والنطاق نفسه، ولا تدخل بها Loop أو switch من الخارج. مثال `goto done; echo 'skip'; done: echo 'done';` يطبع done، لكن دالة صغيرة أو break غالبًا أسهل في التتبع.

## توقع، شخّص، كمّل

<details><summary>توقع: غير factor من 2 إلى 10 بعد إنشاء Closure</summary><p>مع use ($factor) تظل النتائج 2,4,6 لأن الالتقاط حدث بالقيمة. مع use (&amp;$factor) تصبح 10,20,30. Arrow تلتقط بالقيمة أيضًا.</p></details>

<details><summary>Debugging: الدالة تعمل echo ثم أحاول جمع ناتجها</summary><p>الطباعة لا ترجع القيمة للحساب. استخدم return للقيمة، وخلي echo عند عرض النتيجة؛ كده يمكن اختبار الدالة بدون التقاط الإخراج.</p></details>

<details><summary>كمّل Callback تعيد مربع العدد</summary><p><code>fn (int $n): int =&gt; $n * $n</code>؛ تمريرها إلى transform مع [1,2,3] يعطي [1,4,9]. لا تستدعها قبل تمريرها.</p></details>

<details><summary>شخّص recursion تستدعي countdown($n) بلا تغيير</summary><p>كل استدعاء يضيف Frame بنفس n فلا يصل للصفر. مرر n-1، واحتفظ بحالة توقف وحد للمدخل؛ مجرد كتابة base case لا يكفي بدون تقدم نحوها.</p></details>

في مشروع الدفتر سنفصل التحقق والحفظ والعرض إلى دوال، ثم نمرر Handler كـCallback للـRouter. جرّب أيضًا `php functions-lab.php` من [المختبر](/php/00-lab-setup/).
