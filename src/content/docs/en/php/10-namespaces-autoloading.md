---
title: 10. Namespaces and autoloading
description: Names, imports, aliases, resolution rules, and mapping a namespace to directories with Composer PSR-4.
sidebar:
  order: 10
---

## Why namespaces?

Namespaces prevent name collisions and give code a logical identity independent of a filename.

```php
<?php
declare(strict_types=1);

namespace App\Billing;

final class InvoiceService {}
```

Place `namespace` near the top after `declare`. A namespace does not load its file; an autoloader does.

## Imports and aliases

```php
namespace App\Http;

use App\Billing\InvoiceService;
use App\Contracts\Logger as LoggerContract;
use function App\Support\normalize_email;
use const App\Config\MAX_RETRIES;

$service = new InvoiceService();
```

A leading `\` is fully qualified. Imported names resolve through `use`; other qualified names resolve relative to the current namespace. Imports are file-level compile-time declarations, not dynamic function-local operations.

## Composer and PSR-4

```json
{
  "autoload": {
    "psr-4": {
      "App\\\\": "src/"
    }
  }
}
```

`App\Billing\InvoiceService` normally maps to `src/Billing/InvoiceService.php`. Run `composer dump-autoload` after changing mappings.

## Organization rules

- Prefer one main class per file.
- Match filename case because Linux filesystems are usually case-sensitive.
- Keep domain namespaces independent of a framework where practical.
- Put test namespaces in `autoload-dev`.
- Avoid side effects when a class file is loaded.

:::caution
PHP itself does not require a namespace to match a directory. PSR-4 and Composer define that mapping.
:::

## References

- [PHP Namespaces](https://www.php.net/manual/en/language.namespaces.php)
- [Composer PSR-4](https://getcomposer.org/doc/04-schema.md#psr-4)

