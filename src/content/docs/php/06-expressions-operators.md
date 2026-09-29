---
title: 6. التعبيرات والمؤثرات
description: قيم التعبيرات، الأولوية، الحساب والإسناد والمقارنة والمنطق والمصفوفات والتنفيذ والـ Pipe.
sidebar:
  order: 6
---

## المشكلة: الحساب صحيح شكليًا والنتيجة غلط

السعر 1500 قرش والكمية 3؛ عايزين إجماليًا، وخصمًا، وقرار شحن مجاني. **Expression** تعبير ينتج قيمة، و**Operator** رمز عملية، و**Operand** قيمة تعمل عليها العملية. في `$price * $quantity` الرمز `*` معامل، والمتغيران طرفاه. قبل كتابة تعبير اسأل عن نوع مدخلاته ونوع نتيجته.

الأمثلة الأساسية PHP 8.0+. احفظ `checkout.php` وشغّله بـ`php checkout.php`:

~~~php
<?php
declare(strict_types=1);

$price = 1500;
$quantity = 3;
$subtotal = $price * $quantity;
$discount = intdiv($subtotal * 10, 100);
$afterDiscount = $subtotal - $discount;
$shipping = $afterDiscount >= 4000 ? 0 : 500;
$total = $afterDiscount + $shipping;
echo "subtotal={$subtotal}", PHP_EOL;
echo "discount={$discount}", PHP_EOL;
echo "shipping={$shipping}", PHP_EOL;
echo "total={$total}", PHP_EOL;
~~~

~~~text
subtotal=4500
discount=450
shipping=0
total=4050
~~~

المتغيران الأولان أعداد صحيحة بالقرش. الضرب ينتج 4500. `intdiv` قسمة صحيحة؛ المثال يختار تقريب الخصم لأسفل للقيم الموجبة، ودي قاعدة معلنة مش مصادفة. نطرح 450، ونقارن 4050 بالحد 4000؛ الشرط true فيختار Ternary شحنًا صفرًا. نجمع ونطبع. المثال بمبالغ صغيرة؛ للأرقام الكبيرة افحص overflow قبل الضرب، وللسياسات المالية الأخرى استخدم تقريبًا معلنًا أو Decimal.

**غلط:** `$subtotal - 10` يطرح 10 قروش، مش 10%. و`$shipping = $subtotal >= 4000` يختبر قبل الخصم؛ صحح المتغير المستخدم حسب قاعدة المتجر. غيّر الكمية إلى 2: الإجمالي بعد الخصم 2700 والشحن 500 والناتج 3200.

## الأولوية مش ترتيب تنفيذ مضمون

**Precedence** تحدد تجميع التعبير: `2 + 3 * 4` تعني `2 + (3 * 4)` فتنتج 14. `(2 + 3) * 4` تنتج 20. لا تعتمد على ترتيب تقييم تعبيرات تغير المتغير نفسه، مثل جمع زيادتين لنفس العداد؛ افصل كل تعديل في سطر.

احفظ `precedence.php`:

~~~php
<?php
$a = true && false;
$b = true and false;
var_dump($a, $b);
$x = 5;
echo $x++, PHP_EOL;
echo ++$x, PHP_EOL;
~~~

~~~text
bool(false)
bool(true)
5
7
~~~

`&&` أعلى أولوية من الإسناد، فـ`$a` تأخذ false. `and` أقل منه، فكأن السطر `($b = true) and false`؛ النتيجة الأخيرة لا تُخزن في b. استخدم `&&` و`||` وأقواسًا واضحة. `$x++` تعيد القديمة ثم تزود؛ `++$x` تزود ثم تعيد الجديدة. الإسناد نفسه يعيد قيمة، ولذلك `$b = $a = 5` يضع 5 في الاثنين، لكن سطرين أوضح غالبًا.

## خريطة العمليات

| المجموعة | الرموز والمعنى |
|---|---|
| حساب | `+ - * /`، باقي القسمة `%`، القوة `**` |
| إسناد مختصر | `+= -= *= /= %= **= .= ??=` |
| مقارنة | `== != <>` مرنة، `=== !==` صارمة، `< > <= >=` ترتيب |
| ترتيب ثلاثي | `<=>` تعيد -1 أو 0 أو 1 للأعداد البسيطة |
| منطق | `&&` و، `||` أو، `!` نفي، و`xor` أحد الطرفين فقط |
| نصوص | `.` دمج، و`.=` دمج ثم إسناد |

`/` قد تنتج float؛ `10 / 4` تساوي 2.5، و`intdiv(10, 4)` تساوي 2، و`10 % 4` تساوي 2. المقسوم عليه صفر يرمي `DivisionByZeroError`. كسور float تقريبية؛ لا تختبر ناتج حساب عشري متكرر بمساواة تامة بدون سياسة دقة.

## النوع جزء من المقارنة

شغّل `compare.php`. **Short circuit** معناها عدم تقييم الطرف الثاني لما الأول حسم النتيجة:

~~~php
<?php
var_dump('0' == 0);
var_dump('0' === 0);
var_dump('0' != 0);
var_dump('0' !== 0);
$value = '0';
echo $value ?? 'missing', PHP_EOL;
echo $value ?: 'empty', PHP_EOL;
$divisor = 0;
var_dump($divisor !== 0 && 10 / $divisor > 2);
~~~

~~~text
bool(true)
bool(false)
bool(false)
bool(true)
0
empty
bool(false)
~~~

الأربع مقارنات توضح قيمة ونوع النص والعدد. `??` لا تعتبر النص `'0'` مفقودًا؛ `?:` تعتبره falsy. في آخر سطر الطرف الأول false، فلا تحدث القسمة. ما تحطش عملية ضرورية للحفظ أو العد داخل طرف قد لا يُنفذ. و`$input ??= 'guest'` إسناد البديل فقط عند الغياب أو null.

## نفس الرمز مع Array أو Object

`+` بين المصفوفات اتحاد حسب المفتاح، والقيمة اليسرى تفوز عند التعارض. `array_merge` تستبدل المفاتيح النصية بقيمة اليمين، وتعيد ترقيم العددية. جرّب:

~~~php
<?php
$left = ['timeout' => 3, 0 => 'A'];
$right = ['timeout' => 5, 0 => 'B'];
echo json_encode($left + $right, JSON_THROW_ON_ERROR), PHP_EOL;
echo json_encode(array_merge($left, $right), JSON_THROW_ON_ERROR), PHP_EOL;
~~~

~~~text
{"timeout":3,"0":"A"}
{"timeout":5,"0":"A","1":"B"}
~~~

مساواة Arrays بـ`===` تشمل الأنواع وترتيب أزواج المفاتيح؛ `==` لا تطلب نفس الترتيب. `instanceof` يفحص هل كائن يحقق صنفًا/واجهة. إسناد كائن لمتغير ثانٍ لا ينسخه؛ `clone` نسخة سطحية، والكائنات الداخلية قد تظل مشتركة. التفاصيل في [OOP](/oop/).

## رموز ما تستخدمهاش لإخفاء مشكلة

`@` قد يكتم تشخيص التعبير، لكنه لا يصلح الفشل. افحص return value أو تعامل مع Exception. العلامات الخلفية Backticks في PHP تنفذ أمر shell مثل `shell_exec`؛ لا تستخدمها لعرض نص، ولا تدخل بيانات مستخدم في `exec` أو `system` أو `proc_open`. اختار API مباشرة للمهمة، أو قائمة أوامر ثابتة وarguments منفصلة لو التنفيذ ضروري.

## Pipe من PHP 8.5 فقط

**Callable** قيمة تشير لدالة قابلة للاستدعاء، وهنفهمها في الدرس 7. `|>` يمرر نتيجة اليسار كوسيط واحد لدالة اليمين. شغّل `pipe.php` باستخدام PHP 8.5؛ الملف لا يُحلل على 8.4:

~~~php
<?php
$slug = ' Hello PHP '
    |> trim(...)
    |> strtolower(...)
    |> (fn (string $s): string => str_replace(' ', '-', $s));
echo $slug, PHP_EOL;
~~~

~~~text
hello-php
~~~

كل مرحلة ترجع قيمة جديدة. بديل 8.0 هو `str_replace(' ', '-', strtolower(trim(' Hello PHP ')))`؛ البديل لا يحتاج First-class Callable. [مرجع Pipe الرسمي](https://www.php.net/manual/en/language.operators.pipe.php).

## توقع، شخّص، كمّل

<details><summary>توقع: 2 + 3 * 4، ثم (2 + 3) * 4</summary><p>14 ثم 20. الأقواس تغير تجميع العمليات؛ لا تغير قيمة الأعداد.</p></details>

<details><summary>Debugging: if ($quantity = 0) بدل المقارنة</summary><p>الإسناد يضع صفرًا ثم الشرط false. استخدم <code>$quantity === 0</code> بعد التحقق من أن المدخل عدد صحيح. لا تصلحها بـ== لمجرد إخفاء اختلاف النوع.</p></details>

<details><summary>كمّل شرط قسمة آمنة مع divisor=0</summary><p><code>$divisor !== 0 &amp;&amp; $amount / $divisor > 2</code>. فحص الصفر أولًا يمنع تقييم القسمة؛ تبديل الطرفين يفقد الحماية.</p></details>

<details><summary>لماذا ['timeout' =&gt; 3] + ['timeout' =&gt; 5] ليست تحديثًا إلى 5؟</summary><p>الاتحاد يحافظ على قيمة اليسار. لو القصد override استخدم array_merge أو unpacking وفق قواعد المفاتيح.</p></details>

جرّب `php operators-lab.php` من [المختبر](/php/00-lab-setup/). في مشروع الدفتر هنستخدم `===` للـMethod و`??` للمفتاح المفقود؛ لا نستبدل التحقق من النوع بـtruthiness.
