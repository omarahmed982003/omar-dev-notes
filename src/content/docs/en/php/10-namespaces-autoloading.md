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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Namespaces and autoloading">
<p class="lesson-diagram-title">Concept map: Namespaces and autoloading</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Why namespaces?</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Imports and aliases</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Composer and PSR-4</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Organization rules</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>References</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Why namespaces?” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Namespaces prevent name collisions and give code a logical identity independent of a filename. Place namespace near the top after declare. A namespace does not load its file; an autoloader does. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Why namespaces?” with “Imports and aliases”. Why does neither replace the other in “Namespaces and autoloading”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Why namespaces?”: Namespaces prevent name collisions and give code a logical identity independent of a filename. Place namespace near the top after declare. A namespace does not load its file; an autoloader does. For “Imports and aliases”: A leading \ is fully qualified. Imported names resolve through use; other qualified names resolve relative to the current namespace. Imports are file-level compile-time declarations, not dynamic function-local operations. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Composer and PSR-4”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> App\Billing\InvoiceService normally maps to src/Billing/InvoiceService.php. Run composer dump-autoload after changing mappings. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Organization rules” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Prefer one main class per file. Match filename case because Linux filesystems are usually case-sensitive. Keep domain namespaces independent of a framework where practical. Put test namespaces in autoload-dev. Avoid side effects when a class file is loaded. :::caution PHP itself does not require a namespace to match a directory. PSR-4 and Composer define that mapping. ::: Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
