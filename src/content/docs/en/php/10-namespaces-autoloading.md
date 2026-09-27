---
title: 10. Namespaces and autoloading
description: Names, imports, aliases, resolution rules, and mapping a namespace to directories with Composer PSR-4.
sidebar:
  order: 10
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **Function:** A named, reusable block of code with one defined job.


## The problem appears when a project grows

One small file can call a class `User`. A library or another module may define the same short name. A namespace gives each symbol a full address:

```text
App\Domain\User
Vendor\Package\User
```

Think of two streets with the same name in different cities: the complete address removes ambiguity. A `use` statement creates a local alias; it does not load or copy the class.

Autoloading solves another problem. When PHP first needs a class, an autoloader maps its fully qualified name to a file and includes it. Composer's PSR-4 mapping connects a namespace prefix to a directory:

```text
App\Domain\User → App\ maps to src/ → src/Domain/User.php
```

Names, paths, and letter case must agree, especially when code developed on Windows is deployed to a case-sensitive Linux filesystem.

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
      "App\\": "src/"
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

## Progressive practice

<details><summary>1. Alias two classes named User</summary><p>Import them as <code>DomainUser</code> and <code>SdkUser</code>, then instantiate each using an unambiguous local name.</p></details>

<details><summary>2. Why might a class load on Windows but fail on Linux?</summary><p>Check letter-case agreement among namespace, class name, directory, and filename. Linux filesystems are commonly case-sensitive.</p></details>

<details><summary>3. What follows a PSR-4 mapping change?</summary><p>Run <code>composer dump-autoload</code> and verify class creation from a real entry point.</p></details>

## Lesson-specific problems

<details><summary>What does a PSR-4 rule connect?</summary><p>A namespace prefix to a base directory; Composer maps the remaining class name to a path.</p></details>

<details><summary>Why avoid putting every class in the global namespace?</summary><p>Names collide and ownership becomes unclear as the project and dependencies grow.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
composer dump-autoload -o
~~~

**Success criterion:** The command exits 0, then PHP resolves the fully qualified class without manual require calls or a naming collision.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Namespace resolution differs for fully qualified, relative, and unqualified names. Composer supports PSR-4, classmap, files, and autoload-dev for different needs. Use <code>composer dump-autoload -o</code> for production only after mappings are correct; optimization must not hide naming defects.

### Try it yourself

Break PSR-4 intentionally and diagnose namespace, path, and case.
