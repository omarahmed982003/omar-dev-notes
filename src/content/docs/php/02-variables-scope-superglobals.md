---
title: "2. Variables وReferences"
prev: {"link":"/php/01-introduction-and-syntax/","label":"مقدمة وصياغة PHP"}
next: {"link":"/php/03-types/","label":"أنواع البيانات ونظام الأنواع"}
description: "Variable كاسم مرتبط بقيمة، وAssignment وValue copy وReferences، من غير اشتراط HTTP."
sidebar:
  order: 2
---

## قبل ما تبدأ

محتاج تكون شغّلت أول ملف PHP وعرفت `echo`، وهي تعليمة عرض نتيجة. هنبدأ باسم مرتبط بقيمة، وبعده **Assignment**: ربط الاسم بقيمة جديدة. **Reference** بتخلي اسمين يوصلوا لنفس القيمة القابلة للتعديل؛ هنوصل لها بعد ما نجرب النسخ العادي. مش محتاج HTTP أوSession في الدرس ده.


## ليه بنحتاج Variables؟

البرنامج بيتعامل مع قيم بتتغير: اسم المستخدم، سعر المنتج، عدد القطع، أونتيجة حساب. بدل ما نكرر القيمة في كل مكان، بنربطها باسم واضح اسمه **Variable**.

فكّر في variable كاسم بنستخدمه علشان نوصل لقيمة أثناء تشغيل البرنامج. التشبيه بالصندوق مفيد في البداية، لكن خلي بالك إن طريقة التخزين الحقيقية تعتمد على نوع القيمة وإدارة الذاكرة داخل PHP.

```php
<?php

$productName = 'Keyboard';
$priceCents = 150000;
$inStock = true;

echo $productName, PHP_EOL;
echo $priceCents, PHP_EOL;
```

الجزء `$` بيقول لـPHP إن ده اسم متغير. علامة `=` هنا مش معناها «يساوي» في الرياضيات؛ معناها **خد القيمة اللي على اليمين واسندها للاسم اللي على الشمال**.

## قواعد تسمية variable

بعد `$` لازم الاسم يبدأ بحرف أو underscore، وبعد كده ممكن يحتوي أرقامًا:

```php
$name = 'Omar';       // صحيح
$_count = 3;          // صحيح
$price2 = 19.5;       // صحيح
// $2price = 19.5;    // خطأ: بدأ برقم
```

الأسماء Case-sensitive:

```php
$userName = 'Omar';
$username = 'Ali';

echo $userName; // Omar
echo $username; // Ali
```

اختار اسمًا يشرح المعنى. `$priceCents` أوضح من `$p`، و`$isEmailVerified` أوضح من `$flag`. الاسم الطويل المعقول أرخص من وقت تضيعُه وأنت بتحاول تفهم الكود بعد شهر.

## variable بيأخذ نوعه من القيمة

PHP لغة Dynamically Typed، يعني مش لازم تكتب نوع variable وقت إنشائه:

```php
$value = 10;       // int
$value = 'ten';    // string بعد الإسناد الجديد
```

ده مش معناه إن PHP «من غير أنواع». كل قيمة لها نوع، وPHP بتطبّق قواعد تحويل ومقارنة حسب النوع. هنشرح الأنواع بالتفصيل في الدرس التالي، وبعدها هنستخدم Type Declarations علشان نخلي حدود functions أوضح.

تقدر تشوف النوع والقيمة أثناء التعلم أو التصحيح:

```php
$price = 19.5;

var_dump($price);             // float(19.5)
echo get_debug_type($price);  // float
```

## طباعة variable داخل النص

الـDouble Quotes تسمح باستبدال variable، أما Single Quotes فتعرض النص كما هو في أغلب الحالات:

```php
$name = 'Omar';
$price = 20;

echo "Hello {$name}, the price is {$price} pounds.", PHP_EOL;
echo 'Hello $name', PHP_EOL;
```

الناتج:

```text
Hello Omar, the price is 20 pounds.
Hello $name
```

استخدام `{$name}` بيحدد بداية الاسم ونهايته بوضوح. الصيغة القديمة `${name}` داخل النصوص Deprecated، فما تعتمدش عليها.

## الإسناد بالقيمة

شوف المثال ده وتوقع الناتج قبل ما تشغله:

```php
$a = 10;
$b = $a;
$b++;

echo $a, PHP_EOL;
echo $b, PHP_EOL;
```

الناتج:

```text
10
11
```

وقت `$b = $a` أخذت `$b` قيمة مستقلة منطقيًا. تعديل `$b` بعد كده لم يغير `$a`.

بالنسبة للمصفوفات والنصوص، PHP تستخدم داخليًا تحسينًا اسمه **Copy-on-write**: مش لازم تنسخ كل البايتات فورًا، لكنها تتصرف قدامك كأن القيم مستقلة، وتعمل النسخة الفعلية عند التعديل. المهم كمبرمج مبتدئ هو السلوك، مش تفاصيل التحسين.

## الإسناد بالمرجع

علامة `&` تخلي اسمين مرتبطين بنفس الحاوية المنطقية:

```php
$score = 10;
$alias =& $score;

$alias++;

echo $score; // 11
```

لما عدّلنا `$alias` اتغيرت `$score` لأنها مرتبطة بها بالمرجع.

```php
unset($alias);
echo $score; // ما زالت 11
```

`unset($alias)` فك الاسم `$alias`، لكنه ما حذفش القيمة من `$score`.

المرجع في PHP مش Pointer يدوي زي C، ومش محتاج تستخدمه في أغلب الكود. استخدامه من غير داعي يخلي السؤال «مين غيّر القيمة؟» أصعب جدًا. ابدأ بالإسناد العادي، واستخدم المرجع فقط لما تكون فاهم السبب والسلوك.

## الكائنات لها سلوك مختلف

عند إسناد Object لمتغير آخر، الاتنين variables يشيران عادة إلى نفس الكائن:

```php
$first = new stdClass();
$first->name = 'Omar';

$second = $first;
$second->name = 'Ali';

echo $first->name; // Ali
```

لو محتاج كائنًا منفصلًا تستخدم `clone`، وتفاصيل النسخ العميق والسطحي هتيجي في مسار OOP.

## Variable variables

PHP تقدر تستخدم قيمة متغير كاسم لمتغير آخر:

```php
$field = 'email';
$$field = 'omar@example.com';

echo $email;
```

ده معناه إن `$$field` تحولت إلى `$email`. الميزة موجودة، لكن غالبًا array أو الكائن أوضح:

```php
$user = [
    'email' => 'omar@example.com',
];

echo $user['email'];
```

ماتستخدمش مدخل المستخدم مباشرة كاسم متغير؛ ده يصعب التحقق والتتبع وقد يغير بيانات ماكنتش ناوي تسمح بتغييرها.

## تابع الموضوع في مكانه

[Scope: مين يقدر يشوف الـvariable؟](/php/scope/) يشرح الفكرة بتفاصيلها؛ اتبع متطلباته قبل التطبيق.

## بعد أساس اللغة

[Request input وSuperglobals](/php/request-input/) يشرحوا مدخلات HTTP والتحقق والعرض. مكانهم بعد functions وarray، مش ضمن أول تعلم variable.

## خريطة حركة القيمة

```text
Request value
     ↓
Read from $_GET
     ↓
Check type and rules
     ↓
Store in a clear local variable
     ↓
Encode for HTML output
```

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>توقع الناتج: <code>$a = 5; $b = $a; $b++; echo "$a,$b";</code></p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> <code>5,6</code> لأن الإسناد العادي أعطى <code>$b</code> قيمة مستقلة منطقيًا.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>أضف <code>&</code> في المثال السابق عند الإسناد. إيه اللي هيتغير؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لو كتبنا <code>$b =& $a</code> فالناتج <code>6,6</code> لأن الاسمين مرتبطان بنفس القيمة المنطقية.</div></details></section>
</div>

## ملخص الدرس

variable اسم لقيمة أثناء تشغيل البرنامج. الإسناد العادي والمرجع مش نفس الشيء، والكائنات لها سلوك مشاركة مختلف. الـScope يحدد مين يقدر يشوف variable، وتمرير القيم للدوال أوضح من `global`. الـSuperglobals بتدخل بيانات الطلب للبرنامج، لكن وجود البيانات لا يجعلها صحيحة أو آمنة: اقرأها، تحقق منها، حوّلها، واعمل Encoding وقت الإخراج.

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker وserver الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php scope-lab.php
~~~

**معيار النجاح:** تثبت المخرجات الفرق بين local وglobal وstatic، ولا يقرأ من superglobal قبل التحقق من وجود المفتاح وشكله.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

Superglobals حدود ثقة وليست بيانات جاهزة: افحص الوجود والشكل والحجم ثم حول إلى type داخل request object. Variable variables و<code>eval</code> ليستا أدوات تصميم معتادة؛ غالبًا map أو callable registry أو parser صريح أوضح وأأمن. لا تجعل global state اعتمادًا مخفيًا.

### جرّب بنفسك

حوّل endpoint يقرأ $_GET في كل مكان إلى قيمة محققة تمرر للدوال.
