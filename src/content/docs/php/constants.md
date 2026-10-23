---
title: "Constants: قيم باسم ثابت"
prev: {"link":"/php/04-output-debugging-constants/","label":"Output وDebugging"}
next: {"link":"/php/06-expressions-operators/","label":"التعبيرات والمؤثرات"}
description: "Constants: قيم باسم ثابت"
sidebar:
  order: 4.5
---

الـconstant اسم لقيمة لا تعيد إسنادها بعد تعريفها. تحتاج variable وecho؛ الجزء الخاص بـclass مرجع بعد OOP، لأن class تعريف يجمع حالة وسلوكًا وclass constant قيمة مرتبطة بهذا التعريف.

المقاطع تحت مستقلة، مش ملف واحد. لو هتشغّل مقطع، ضيف `<?php` في بداية ملفه. ما تعرّفش `APP_NAME` مرتين في نفس التنفيذ؛ تكرار الاسم هنا للمقارنة بين الصيغ.

## يعني إيه Constant؟

variable ممكن يتغير:

```php
$attempts = 1;
$attempts++;
```

الثابت اسم لقيمة المفروض تفضل كما هي بعد تعريفها:

```php
const APP_NAME = 'Omar Notes';
echo APP_NAME;
```

الثابت لا يبدأ بـ`$`. استخدمه لما المعنى فعلًا ثابت في الكود، مش لمجرد منع التغيير. بيانات تختلف بين البيئات، زي Password قاعدة البيانات، مكانها Configuration/Environment مش ثابت مكتوب في Repository.

## `const` و`define()`

```php
const APP_NAME = 'Omar Notes';
define('APP_VERSION', '1.0.0');
```

- `const` تصريح لغوي، مناسب للثوابت المعروفة وقت تعريف الكود.
- `define()` استدعاء runtime، ولذلك ممكن يظهر داخل شرط.
- `define()` ينشئ ثابتًا عامًا، ولا يعرّف Class Constant.
- ما تقدرش تضع `const` المحلي داخل Function أوBlock شرطي.

```php
if (getenv('APP_ENV') === 'testing') {
    define('FAKE_EXTERNAL_SERVICES', true);
}
```

حتى لو ده مسموح، Configuration Object غالبًا أوضح في التطبيقات الكبيرة من ثوابت عامة بتظهر حسب مسار التنفيذ.

## Class Constants

```php
final class HttpStatus
{
    public const OK = 200;
    public const NOT_FOUND = 404;
}

echo HttpStatus::NOT_FOUND;
```

وجود الثابت داخل Class بيربط الاسم بالمفهوم بدل نشر أسماء عامة. ولو الحالات تمثل مجموعة مغلقة لها سلوك وقيمة، Enum قد تكون أنسب.

## Magic Constants

PHP توفر أسماء تتغير قيمتها حسب مكانها في الملف:

```php
echo __LINE__, PHP_EOL;
echo __FILE__, PHP_EOL;
echo __DIR__, PHP_EOL;
echo __FUNCTION__, PHP_EOL;
echo __CLASS__, PHP_EOL;
echo __METHOD__, PHP_EOL;
echo __NAMESPACE__, PHP_EOL;
```

اسمها “Magic” لأن المحرك يحسب قيمتها من السياق. أهم مثال عملي هو `__DIR__`:

```php
$config = require __DIR__ . '/../config/app.php';
```

المسار هنا يبدأ من مجلد الملف نفسه، مش من Current Working Directory اللي شغلت منه الأمر. ده يخلي `require` أكثر ثباتًا.

## Predefined Constants

PHP والـExtensions تعرف ثوابت جاهزة:

```php
echo PHP_VERSION, PHP_EOL;
echo PHP_OS_FAMILY, PHP_EOL;
echo PHP_INT_MAX, PHP_EOL;
echo PHP_EOL;
```

بعض constants موجودة فقط لو Extension معينة متثبتة. استخدم `defined('CONSTANT_NAME')` لو الوجود اختياري:

```php
if (defined('JSON_THROW_ON_ERROR')) {
    echo 'JSON exception flag is available';
}
```


## جرّب بنفسك

عرّف constant باسم MAX_ATTEMPTS وقيمته 3. اعرضها من function، وقارن ده بقراءة variable خارجية. توقع نتيجة كل محاولة.

<details><summary>راجع بعد المحاولة</summary>

الـconstant متاحة من غير global. مرر الـvariable الخارجية كـparameter؛ مش Local تلقائيًا.

</details>


## راجع فهمك

<div class="quiz-list" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>إمتى تستخدم <code>__DIR__</code> في مسار ملف؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لما المسار لازم يكون محسوبًا بالنسبة لمكان الملف الحالي، بغض النظر عن المجلد اللي بدأ منه تشغيل البرنامج.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>هل كلمة مرور قاعدة البيانات مناسبة كـ<code>const</code> داخل الكود؟ ليه؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لا. هي Secret وتختلف بين البيئات وتحتاج Rotation؛ تُحقن من Environment أوSecret Manager ولا تُحفظ في Repository.</div></details></section>
</div>

[ارجع لدليل PHP](/php/).

