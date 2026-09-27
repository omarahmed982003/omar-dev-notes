---
title: 10. Namespaces وAutoloading
description: تنظيم الأسماء والاستيراد والـaliases وحل الأسماء وربط Namespace بمجلد عبر Composer PSR-4.
sidebar:
  order: 10
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **Function:** دالة: جزء كود له اسم ومهمة محددة ويمكن استدعاؤه أكثر من مرة.


## المشكلة بتظهر لما المشروع يكبر

في ملف صغير ممكن تسمي Class باسم `User` وخلاص. لكن لما تضيف مكتبة أوModule تاني عنده Class بنفس الاسم، PHP محتاجة تعرف أي `User` تقصد. الـNamespace بتدي الاسم عنوانًا كاملًا:

```text
App\Domain\User
Vendor\Package\User
```

فكر فيها زي اسم شارع مكرر في محافظتين: اسم الشارع وحده مش كفاية، لكن العنوان الكامل يمنع الخلط. `use` لا يحمّل الملف ولا ينسخ Class؛ هو بيعمل Alias للاسم داخل الملف الحالي.

```php
namespace App\Domain;

final class User {}
```

وفي ملف آخر:

```php
use App\Domain\User;

$user = new User();
```

الـAutoloader يحل مشكلة مختلفة: لما PHP تحتاج Class، يعرف يحول اسمها الكامل إلى ملف ويعمل له `require`. Composer وPSR-4 بيربطوا Prefix بمجلد، فبدل قائمة `require` طويلة يبقى لكل Class مكان متوقع.

```text
App\Domain\User
      ↓ PSR-4 mapping: App\ => src/
src/Domain/User.php
```

نجاح Autoloading يعتمد على تطابق الاسم والمسار وحالة الحروف، وده مهم خصوصًا لما تنتقل من Windows إلى Linux.

## لماذا Namespace؟

تمنع تعارض أسماء classes/functions/constants بين مكتبات مختلفة، وتعطي الكود اسمًا منطقيًا مستقلًا عن اسم الملف.

```php
<?php
declare(strict_types=1);

namespace App\Billing;

final class InvoiceService {}
```

يجب أن يأتي إعلان `namespace` مبكرًا بعد `declare` إن وُجد. الـnamespace لا تحمّل الملف تلقائيًا؛ autoloader يفعل ذلك.

## الاستيراد والـaliases

```php
namespace App\Http;

use App\Billing\InvoiceService;
use App\Contracts\Logger as LoggerContract;
use function App\Support\normalize_email;
use const App\Config\MAX_RETRIES;

$service = new InvoiceService();
```

- الاسم الذي يبدأ بـ`\` كامل من global namespace.
- الاسم المستورد يُحل عبر `use`.
- الاسم غير المستورد داخل namespace يبدأ من namespace الحالية.
- لا تضع `use` ديناميكيًا داخل function؛ imports compile-time وعلى مستوى الملف.

## Composer وPSR-4

```json
{
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  }
}
```

`App\Billing\InvoiceService` يصبح عادة في `src/Billing/InvoiceService.php`:

```bash
composer dump-autoload
```

في الإنتاج استخدم autoloader المحسن حسب حجم التطبيق وطريقة النشر، ولا تكتب سلسلة `require` يدوية لكل class.

## قواعد تنظيم

- class رئيسية واحدة في الملف غالبًا.
- طابق case الاسم والمسار لأن Linux حساس للحروف.
- لا تربط domain namespaces باسم framework بلا ضرورة.
- استخدم `App\Tests` أو autoload-dev للاختبارات.
- لا تعتمد على تنفيذ side effects عند تحميل ملف class.

:::caution
Namespace ليست filesystem path إجباريًا في اللغة؛ PSR-4 هو الاتفاق الذي يربطهما عبر Composer.
:::

## مرجع

- [PHP Namespaces](https://www.php.net/manual/en/language.namespaces.php)
- [Composer PSR-4](https://getcomposer.org/doc/04-schema.md#psr-4)

## تدريب عملي متدرج

<details><summary>1. عندك Classان اسمهم User. اعمل Alias</summary><p>اكتب <code>use App\Domain\User as DomainUser;</code> و<code>use Vendor\Sdk\User as SdkUser;</code>، وبعدها أنشئ كل نوع باسمه المحلي الواضح.</p></details>

<details><summary>2. ليه Class تعمل على Windows وتفشل على Linux؟</summary><p>راجع تطابق حالة الحروف بين Namespace واسم Class ومسار الملف. Filesystem في Linux غالبًا Case-sensitive.</p></details>

<details><summary>3. بعد تعديل PSR-4، إيه الخطوة المهمة؟</summary><p>شغّل <code>composer dump-autoload</code>، ثم اختبر إنشاء Class من نقطة تشغيل حقيقية بدل افتراض نجاح الخريطة.</p></details>

## مسائل مرتبطة بالدرس

<details><summary>ماذا تربط قاعدة PSR-4؟</summary><p>تربط namespace prefix بمجلد base، ثم يحول Composer بقية اسم الكلاس إلى مسار ملف.</p></details>

<details><summary>لماذا لا نضع كل الكلاسات في global namespace؟</summary><p>ستتصادم الأسماء ويصعب فهم الملكية والتنظيم مع نمو المشروع والحزم الخارجية.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
composer dump-autoload -o
~~~

**معيار النجاح:** ينتهي الأمر بكود 0 ثم يجد PHP الصنف باسمه المؤهل بلا require يدوي أو تعارض اسم.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

Namespace resolution يختلف بين الاسم الكامل والنسبي وغير المؤهل؛ افحص الاسم النهائي عند الخطأ. Composer يدعم PSR-4 وclassmap وfiles وautoload-dev لأغراض مختلفة. استخدم <code>composer dump-autoload -o</code> للإنتاج بعد صحة mapping، ولا تجعل تحسين classmap يخفي اسم ملف أو namespace خاطئًا.

### جرّب بنفسك

اكسر PSR-4 عمدًا وشخّص namespace والمسار والحروف.
