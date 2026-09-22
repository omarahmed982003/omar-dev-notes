---
title: 1. Composer وإدارة الاعتماديات
description: composer.json وcomposer.lock وinstall وupdate وrequire-dev وPSR-4 وتجهيز الإنتاج.
sidebar:
  order: 1
---

# Composer: مدير اعتماديات PHP

Composer أداة تدير مكتبات المشروع وإصداراتها وتولّد Autoloader. هو لا يثبت “PHP نفسها”، بل يحل القيود الموجودة في `composer.json` ويضع الحزم غالبًا داخل `vendor/`.

## الملفان الأساسيان

- `composer.json`: ما يحتاجه المشروع والقيود المسموحة والإعدادات والـscripts.
- `composer.lock`: الإصدارات الدقيقة التي حُلّت بالفعل، مع hashes وmetadata تجعل التثبيت قابلًا للتكرار.

```json
{
  "require": {
    "php": "^8.3",
    "guzzlehttp/guzzle": "^7.9"
  },
  "require-dev": {
    "phpunit/phpunit": "^11.0"
  },
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  }
}
```

:::caution[تصحيح مهم]
`composer.lock` لا “يتابع ما حدث” فقط؛ في التطبيقات يجب رفعه إلى Git لأنه يثبت الإصدارات الدقيقة. أما المكتبة المنشورة للآخرين فالمستهلك يحل اعتمادياتها ضمن مشروعه، لذلك lock الخاص بالمكتبة لا يتحكم في تثبيته.
:::

## install أم update؟

| الأمر | مع وجود lock | النتيجة |
|---|---|---|
| `composer install` | يقرأ الإصدارات الدقيقة | تثبيت متكرر ومتوقع، وهو المناسب للـCI والإنتاج |
| `composer update` | يعيد حل القيود | يغيّر `composer.lock` إلى أحدث إصدارات مسموحة |
| `composer update vendor/package` | تحديث محدود | يقلل نطاق التغيير لكنه قد يحدّث اعتماديات مرتبطة |

```bash
composer install
composer require monolog/monolog
composer require --dev phpunit/phpunit
composer update guzzlehttp/guzzle --with-all-dependencies
```

`composer require` يعدّل `composer.json` ويحدّث الـlock ويثبّت الحزمة عادة. الخيار `--dev` يضعها في `require-dev`.

## Autoloading وPSR-4

بعد تحديد Namespace إلى directory يشغّل Composer:

```bash
composer dump-autoload
```

ثم يكفي تحميل ملف واحد عند نقطة الدخول:

```php
<?php
declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';

$service = new App\Billing\InvoiceService();
```

في PSR-4 يجب أن يتوافق الاسم `App\Billing\InvoiceService` عادة مع:

```text
src/Billing/InvoiceService.php
```

Linux حساس لحالة الأحرف؛ خطأ مثل `invoiceService.php` قد يعمل محليًا على Windows ثم يفشل في الإنتاج.

## تثبيت إنتاجي آمن

```bash
composer validate --strict
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
composer audit
```

- `--no-dev` يستبعد أدوات التطوير، لكنه لا يعني أن `require-dev` غير مهم أثناء الاختبار.
- `--optimize-autoloader` يحوّل قواعد PSR إلى class map محسّنة؛ استخدمه في الإنتاج لا أثناء التطوير المتغير بسرعة.
- يمكن استعمال `--classmap-authoritative` بعد الاختبار، لكنه يكسر الأصناف التي تُولّد وقت التشغيل إذا لم تدخل الخريطة.
- لا تستخدم `--ignore-platform-reqs` كحل دائم؛ قد تثبّت كودًا لا يدعمه إصدار PHP أو Extension على الخادم.
- راجع Composer scripts/plugins لأنها كود قابل للتنفيذ أثناء التثبيت. لا تثبّت مشروعًا غير موثوق بصلاحيات عالية.

## سير عمل موصى به

1. أضف أو حدّث الحزم في فرع تطوير.
2. راجع فرق `composer.json` و`composer.lock`.
3. شغّل الاختبارات و`composer audit`.
4. ارفع الملفين إلى Git، ولا ترفع `vendor/` غالبًا.
5. في النشر شغّل `composer install` لا `update`.

بهذا تكون عملية اختيار الإصدارات منفصلة عن عملية نشرها، فلا يفاجئك إصدار جديد أثناء الإنتاج.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Composer وإدارة الاعتماديات">
<p class="lesson-diagram-title">خريطة مفاهيم: Composer وإدارة الاعتماديات</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>الملفان الأساسيان</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>install أم update؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Autoloading وPSR-4</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>تثبيت إنتاجي آمن</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>سير عمل موصى به</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «الملفان الأساسيان» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> composer.json: ما يحتاجه المشروع والقيود المسموحة والإعدادات والـscripts. composer.lock: الإصدارات الدقيقة التي حُلّت بالفعل، مع hashes وmetadata تجعل التثبيت قابلًا للتكرار. :::caution[تصحيح مهم] composer.lock لا “يتابع ما حدث” فقط؛ في التطبيقات يجب رفعه إلى Git لأنه يثبت الإصدارات الدقيقة. أما المكتبة المنشورة للآخرين فالمستهلك يحل اعتمادياتها ضمن مشروعه، لذلك lock الخاص بالمكتبة لا يتحكم في تثبيته. ::: عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «الملفان الأساسيان» و«install أم update؟». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Composer وإدارة الاعتماديات»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «الملفان الأساسيان»: composer.json: ما يحتاجه المشروع والقيود المسموحة والإعدادات والـscripts. composer.lock: الإصدارات الدقيقة التي حُلّت بالفعل، مع hashes وmetadata تجعل التثبيت قابلًا للتكرار. :::caution[تصحيح مهم] composer.lock لا “يتابع ما حدث” فقط؛ في التطبيقات يجب رفعه إلى Git لأنه يثبت الإصدارات الدقيقة. أما المكتبة المنشورة للآخرين فالمستهلك يحل اعتمادياتها ضمن مشروعه، لذلك lock الخاص بالمكتبة لا يتحكم في تثبيته. ::: أما «install أم update؟»: | الأمر | مع وجود lock | النتيجة | |---|---|---| | composer install | يقرأ الإصدارات الدقيقة | تثبيت متكرر ومتوقع، وهو المناسب للـCI والإنتاج | | composer update | يعيد حل القيود | يغيّر composer.lock إلى أحدث إصدارات مسموحة | | composer update vendor/package | تحديث محدود | يقلل نطاق التغيير لكنه قد يحدّث اعتماديات مرتبطة | composer require يعدّل composer.json ويحدّث الـlock ويثبّت الحزمة عادة. الخيار --dev يضعها… العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Autoloading وPSR-4». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> بعد تحديد Namespace إلى directory يشغّل Composer: ثم يكفي تحميل ملف واحد عند نقطة الدخول: في PSR-4 يجب أن يتوافق الاسم App\Billing\InvoiceService عادة مع: Linux حساس لحالة الأحرف؛ خطأ مثل invoiceService.php قد يعمل محليًا على Windows ثم يفشل في الإنتاج. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «تثبيت إنتاجي آمن» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> --no-dev يستبعد أدوات التطوير، لكنه لا يعني أن require-dev غير مهم أثناء الاختبار. --optimize-autoloader يحوّل قواعد PSR إلى class map محسّنة؛ استخدمه في الإنتاج لا أثناء التطوير المتغير بسرعة. يمكن استعمال --classmap-authoritative بعد الاختبار، لكنه يكسر الأصناف التي تُولّد وقت التشغيل إذا لم تدخل الخريطة. لا تستخدم --ignore-platform-reqs كحل دائم؛ قد تثبّت كودًا لا يدعمه إصدار PHP أو Extension على الخادم. راجع… وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
