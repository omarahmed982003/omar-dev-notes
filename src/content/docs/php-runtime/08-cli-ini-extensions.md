---
title: 8. PHP CLI وphp.ini والامتدادات
description: اختلاف SAPIs واكتشاف الإعدادات وإدارة extensions وضبط التطوير والإنتاج.
sidebar:
  order: 8
---

## SAPI تحدد بيئة التشغيل

PHP قد تعمل عبر CLI أو FPM/FastCGI أو Apache module. نفس الكود قد يقرأ `php.ini` مختلفة ويملك extensions وإعدادات مختلفة.

```bash
php -v
php --ini
php -m
php -i
php -r "echo PHP_SAPI, PHP_EOL;"
```

عند ظهور “يعمل في terminal ولا يعمل في الموقع”، قارن executable وSAPI وملف الإعداد والمستخدم والبيئة.

## ترتيب الإعداد

`php --ini` يعرض الملف الأساسي ومجلد `conf.d`. الملفات الإضافية قد تعدّل قيمة سابقة. داخل التطبيق:

```php
printf(
    "sapi=%s ini=%s memory=%s\n",
    PHP_SAPI,
    php_ini_loaded_file() ?: 'none',
    ini_get('memory_limit'),
);
```

بعض الإعدادات `PHP_INI_SYSTEM` ولا يمكن تغييرها بـ`ini_set()` أثناء الطلب. لا تجعل bootstrap يخفي configuration drift.

## Extensions

```bash
php --ri opcache
php --ri pdo_mysql
composer check-platform-reqs
```

`extension_loaded()` يفيد في فحص واضح، لكن declare requirements في Composer أفضل لمنع نشر بيئة ناقصة.

## Development مقابل Production

في التطوير: أخطاء ظاهرة، Xdebug عند الحاجة، وOPcache بسياسة مناسبة للتغييرات. في الإنتاج: لا تعرض الأخطاء، فعّل logs وOPcache، اضبط limits وtimeouts، وأزل extensions غير اللازمة.

لا تنسخ `php.ini-development` أو `php.ini-production` بلا مراجعة؛ هما baseline وليسا إعداد تطبيقك النهائي.

## CLI scripts

```php
#!/usr/bin/env php
<?php
declare(strict_types=1);

set_time_limit(0);
$options = getopt('', ['dry-run', 'limit:']);
```

أضف exit codes صحيحة، signal handling للـworkers، logging، lock لمنع نسختين، وtimeouts لأي I/O. `set_time_limit(0)` لا يعني أن النظام أو orchestrator لن يقتل العملية.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: PHP CLI وphp.ini والامتدادات">
<p class="lesson-diagram-title">خريطة مفاهيم: PHP CLI وphp.ini والامتدادات</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>SAPI تحدد بيئة التشغيل</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>ترتيب الإعداد</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Extensions</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Development مقابل Production</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>CLI scripts</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «SAPI تحدد بيئة التشغيل» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> PHP قد تعمل عبر CLI أو FPM/FastCGI أو Apache module. نفس الكود قد يقرأ php.ini مختلفة ويملك extensions وإعدادات مختلفة. عند ظهور “يعمل في terminal ولا يعمل في الموقع”، قارن executable وSAPI وملف الإعداد والمستخدم والبيئة. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «SAPI تحدد بيئة التشغيل» و«ترتيب الإعداد». لماذا لا يغني أحدهما عن الآخر داخل موضوع «PHP CLI وphp.ini والامتدادات»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «SAPI تحدد بيئة التشغيل»: PHP قد تعمل عبر CLI أو FPM/FastCGI أو Apache module. نفس الكود قد يقرأ php.ini مختلفة ويملك extensions وإعدادات مختلفة. عند ظهور “يعمل في terminal ولا يعمل في الموقع”، قارن executable وSAPI وملف الإعداد والمستخدم والبيئة. أما «ترتيب الإعداد»: php --ini يعرض الملف الأساسي ومجلد conf.d. الملفات الإضافية قد تعدّل قيمة سابقة. داخل التطبيق: بعض الإعدادات PHP_INI_SYSTEM ولا يمكن تغييرها بـini_set() أثناء الطلب. لا تجعل bootstrap يخفي configuration drift. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Extensions». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> extension_loaded() يفيد في فحص واضح، لكن declare requirements في Composer أفضل لمنع نشر بيئة ناقصة. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Development مقابل Production» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في التطوير: أخطاء ظاهرة، Xdebug عند الحاجة، وOPcache بسياسة مناسبة للتغييرات. في الإنتاج: لا تعرض الأخطاء، فعّل logs وOPcache، اضبط limits وtimeouts، وأزل extensions غير اللازمة. لا تنسخ php.ini-development أو php.ini-production بلا مراجعة؛ هما baseline وليسا إعداد تطبيقك النهائي. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
