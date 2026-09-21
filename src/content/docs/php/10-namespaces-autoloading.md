---
title: 10. Namespaces وAutoloading
description: تنظيم الأسماء والاستيراد والـaliases وحل الأسماء وربط Namespace بمجلد عبر Composer PSR-4.
sidebar:
  order: 10
---

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
      "App\\\\": "src/"
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

