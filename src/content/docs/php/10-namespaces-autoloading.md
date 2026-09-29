---
title: 10. Namespaces وComposer وأدوات الجودة
description: تنظيم الأسماء والاستيراد والـaliases وحل الأسماء وربط Namespace بمجلد عبر Composer PSR-4.
sidebar:
  order: 10
---

## مشكلتان مختلفتان: اسم متكرر وملف مش متحمّل

مشروعك ومكتبة خارجية عندهم Class اسمها User. **Namespace** عنوان للاسم يمنع التصادم، مثل محافظتين فيهم نفس اسم الشارع. **Autoloading** حل لمشكلة أخرى: عند طلب Class، مين يحمّل ملفها؟ **Composer** مدير حزم: يجلب المكتبات المتوافقة ويولد محمّلًا للأسماء.

هنستخدم Class صغيرة كحاوية للدالة فقط. تفاصيل تصميم Classes في [OOP](/oop/). تحتاج PHP 8.3+ وComposer 2 للمشروع التالي. تحقق بـ`php -v` و`composer --version`، وشغّل كل الأوامر من مجلد المشروع، لا من مجلد الموقع.

## المشروع كاملًا

النسخة الجاهزة موجودة في `examples/php-course/composer-demo` داخل المستودع، وكمان في [تحميل أمثلة المنهج](/downloads/php-course.zip). أو أنشئ الملفات الأربعة التالية بنفس الحروف:

~~~text
composer-demo/
  composer.json
  bin/demo.php
  src/Billing/PriceCalculator.php
  tests/PriceCalculatorTest.php
~~~

### 1. composer.json: وصف المشروع

`require` احتياجات التشغيل، و`require-dev` أدوات التطوير. الإصدارات هنا نطاقات متوافقة مقصودة للمثال، وليست وعدًا بأنها أحدث إصدار:

~~~json
{
  "name": "learning/price-demo",
  "type": "project",
  "require": {
    "php": "^8.3"
  },
  "require-dev": {
    "phpunit/phpunit": "^11.5",
    "phpstan/phpstan": "^2.1",
    "friendsofphp/php-cs-fixer": "^3.0"
  },
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  },
  "scripts": {
    "demo": "@php bin/demo.php",
    "test": "@php vendor/bin/phpunit --bootstrap vendor/autoload.php tests",
    "analyse": "@php vendor/bin/phpstan analyse src --level=6 --no-progress",
    "style": "@php vendor/bin/php-cs-fixer fix src --dry-run --diff --rules=@PSR12",
    "check": [
      "@test",
      "@analyse",
      "@style"
    ]
  },
  "config": {
    "platform": {
      "php": "8.3.0"
    }
  },
  "description": "A small PSR-4 teaching project with boundary tests and development tools"
}
~~~

`App\\` في JSON تمثل النص `App\` لأن backslash تُهرب. **PSR-4** اتفاق يربط Prefix بمجلد. Composer يحذف `App\` من الاسم، ويحوّل الباقي لمسار: `App\Billing\PriceCalculator` ← `src/Billing/PriceCalculator.php`. اللغة نفسها لا تفرض علاقة الاسم بالمجلد؛ الاتفاق هو اللي يفرضها.

### 2. الصنف: src/Billing/PriceCalculator.php

~~~php
<?php

declare(strict_types=1);

namespace App\Billing;

final class PriceCalculator
{
    public function subtotal(int $price, int $quantity): int
    {
        if ($price < 0 || $quantity < 1 || $price > intdiv(PHP_INT_MAX, $quantity)) {
            throw new \InvalidArgumentException('Invalid order');
        }

        return $price * $quantity;
    }
}
~~~

`namespace` تأتي بعد declare وقبل التعريفات. الاسم الكامل للصنف أصبح App\Billing\PriceCalculator. `public function` دالة نستدعيها على الكائن. الشرط يرفض سعرًا سالبًا وكمية أقل من 1. `||` تتوقف مبكرًا، فلا نقسم على كمية صفر. مقارنة السعر بـ`intdiv(PHP_INT_MAX, $quantity)` ترفض الضرب الذي سيتجاوز الحد **قبل** تنفيذه. `\InvalidArgumentException` اسم كامل من النطاق العام.

### 3. نقطة التشغيل: bin/demo.php

~~~php
<?php
declare(strict_types=1);

use App\Billing\PriceCalculator;

require dirname(__DIR__) . '/vendor/autoload.php';

$calculator = new PriceCalculator();
echo $calculator->subtotal(1500, 3), PHP_EOL;
~~~

`use` اختصار للاسم في الملف الحالي؛ لا يقرأ ملفًا ولا ينشئ كائنًا. `require vendor/autoload.php` تسجل المحمّل، و`new` تطلب الصنف فيحمّله Composer. الأمر `composer demo` يشغّل `@php` بنفس PHP التي تستخدمها Composer. النتيجة `4500`.

### 4. اختبار السلوك: tests/PriceCalculatorTest.php

**Test** تجربة آلية لها مدخل ومتوقع. **Assertion** تحقق يفشل برسالة لو خالف الفعلي المتوقع. PHPUnit تكتشف دوال test؛ القيد 11.5 هنا يدعم خط PHP المستخدم في المثال:

~~~php
<?php
declare(strict_types=1);

use App\Billing\PriceCalculator;
use PHPUnit\Framework\TestCase;

final class PriceCalculatorTest extends TestCase
{
    public function testValidOrder(): void
    {
        self::assertSame(4500, (new PriceCalculator())->subtotal(1500, 3));
    }

    public function testZeroPriceIsAllowed(): void
    {
        self::assertSame(0, (new PriceCalculator())->subtotal(0, 1));
    }

    public function testZeroQuantityIsRejected(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new PriceCalculator())->subtotal(100, 0);
    }

    public function testNegativePriceIsRejected(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new PriceCalculator())->subtotal(-1, 1);
    }

    public function testOverflowIsRejected(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new PriceCalculator())->subtotal(PHP_INT_MAX, 2);
    }
}
~~~

`assertSame` تفحص النوع والقيمة؛ expectedException تُكتب قبل العملية المتوقع فشلها. الاختبارات تثبت قواعد السعر والحدود، مش أسماء المتغيرات. التشغيل الأول لإنشاء lock:

~~~bash
composer update
composer demo
composer check
composer audit
~~~

## composer.lock: نفس النسخ عند زميلك

`composer.json` يعلن النطاقات؛ `composer.lock` يسجل النسخ الدقيقة المحلولة. **install** مع lock يثبت تلك النسخ. **update** يعيد حل النطاقات وقد يغير lock. في تطبيق مثل ده التزم بالملفين في Git، ولا تعدل lock يدويًا. زميلك يستخدم `composer install`، لا update لمجرد بدء العمل. `vendor` مخرجات قابلة لإعادة الإنشاء؛ لا تلتزم بها.

**SemVer** شكل `major.minor.patch`: تغيير كاسر، إضافة متوافقة، إصلاح متوافق بحسب التزام الحزمة. `^2.1` تسمح `>=2.1.0 <3.0.0`. `~2.1.0` تسمح `>=2.1.0 <2.2.0`. `^0.3.2` تتوقف قبل `0.4.0` لأن ما قبل 1.0 أكثر تحفظًا. النطاق وعد توافق من الناشر، مش بديلًا للاختبار.

`composer require vendor/package` تضيف اعتمادًا وتحدث lock؛ `composer require --dev ...` لأداة تطوير. راجع diff والأصل قبل اعتماد الحزمة. `composer audit` يفحص تنبيهات منشورة وفق بيانات وقت التشغيل؛ نجاحه لا يثبت خلو البرنامج من كل ثغرة. حدّث اعتمادًا محددًا بـ`composer update vendor/package` واختبر بعده.

## scripts والتحليل والتنسيق

**Script** أمر مسمى في composer.json. `composer check` يشغل test ثم analyse ثم style؛ الفشل يوقف السلسلة بكود خروج غير صفر. scripts وplugins يمكنها تنفيذ كود؛ اقرأ ما يجلبه المشروع قبل تشغيله.

**Static analysis** فحص الأنواع ومسارات الكود بدون تشغيل كل المدخلات. PHPStan هنا تفحص src عند level 6. جرّب مؤقتًا إعادة نص بدل int في subtotal: التحليل يجب أن يفشل، ثم ارجع الإصلاح. التحليل لا يغني عن اختبار حساب صحيح بنوع صحيح.

PHP-CS-Fixer يراجع شكل الكود. `--dry-run --diff` يعرض التغييرات بدون تطبيق. لتطبيقها عن قصد استخدم `composer exec -- php-cs-fixer fix src --rules=@PSR12`. التنسيق لا يصلح المنطق. Pest وPsalm وPint بدائل، لكن لا نثبت أداتين لنفس الدور في هذا المعمل.

## تشخيص Class not found

اتبع الاسم خطوة بخطوة: use، ثم Namespace في الملف، ثم Prefix في Composer، ثم المسار وحالة الحروف، ثم وجود require للمحمّل. Linux غالبًا حساس للحروف؛ نجاح اسم `billing` بدل `Billing` على جهازك لا يثبت صحته. بعد تغيير خريطة autoload شغّل `composer dump-autoload`. إضافة Class صحيحة تحت PSR-4 عادة لا تحتاج تحديث المحمّل العادي؛ الـclassmap المحسن/authoritative يحتاج إعادة توليد حسب إعدادك.

الأسماء التي تبدأ بـ`\` كاملة. `namespace\Name` نسبية للمكان الحالي. الاسم القصير لصنف يتبع imports ثم Namespace الحالية؛ دوال وثوابت غير مؤهلة قد ترجع للنطاق العام عند غياب المحلي، فلا تعمم قواعد الأصناف عليها. يمكن `use X\User as ExternalUser` و`use function X\helper` و`use const X\LIMIT`. imports وقت التحليل وعلى مستوى الملف، ليست use الخاصة بالتقاط Closure.

Composer تدعم `classmap` لكود لا يتبع PSR-4، و`files` لدوال يجب تحميلها دائمًا، و`autoload-dev` لتعريفات الاختبارات. لا تجعل ملف Class ينفذ طلبات شبكة عند تحميله.

## إعداد التطوير والإنتاج

التطوير يثبت require-dev ويشغّل check. النشر من lock باستخدام `composer install --no-dev --optimize-autoloader` ثم `composer check-platform-reqs --no-dev` على بيئة الإنتاج الفعلية. `config.platform` تساعد حل الاعتمادات لمنصة مستهدفة، لكنها لا تثبت امتدادًا ولا تغير PHP الحقيقية. لا تشغّل update عشوائيًا أثناء النشر. إعدادات الأخطاء وXdebug في الدرسين 11 و17.

## توقع، شخّص، كمّل

<details><summary>توقع: حذف vendor ثم composer install مع lock</summary><p>تعاد نفس النسخ المقفلة ضمن المنصة المتوافقة؛ install ليست بحثًا عن أحدث نسخة. لو المنصة ناقصة امتدادًا يفشل بدل حلها بالتخمين.</p></details>

<details><summary>Debugging: use صحيح لكن الصنف غير موجود</summary><p>use لا يحمل الملف. تأكد من vendor/autoload.php والخريطة واسم الملف وNamespace والحروف؛ ثم dump-autoload عند تعديل الخريطة.</p></details>

<details><summary>كمّل PSR-4 للاسم App\Billing\PriceCalculator</summary><p>Prefix هو <code>App\</code> ومجلده src/، والباقي Billing/PriceCalculator.php. في JSON تكتب backslash مرتين لتمثيل واحدة.</p></details>

<details><summary>اختبار pass وتنسيق pass، هل ده يضمن صحة كل المدخلات؟</summary><p>لا. كل أداة تثبت جزءًا: اختبارات حالات محددة، وتحليل عقود، وتنسيق شكل. أضف حالات حدود نابعة من القاعدة، لا اختبارات تكرر التنفيذ.</p></details>

المراجع: [Composer](https://getcomposer.org/doc/01-basic-usage.md)، [القيود](https://getcomposer.org/doc/articles/versions.md)، [PHPUnit](https://docs.phpunit.de/en/11.5/writing-tests-for-phpunit.html)، [PHPStan](https://phpstan.org/user-guide/getting-started)، [PHP-CS-Fixer](https://cs.symfony.com/doc/usage.html).
