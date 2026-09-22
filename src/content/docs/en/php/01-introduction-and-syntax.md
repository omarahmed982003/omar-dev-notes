---
title: 1. Introduction and PHP syntax
description: What PHP is, request execution, tags, HTML templates, comments, and case sensitivity.
sidebar:
  order: 1
---

## What PHP is

The name historically meant **Personal Home Page**; its recursive official expansion is **PHP: Hypertext Preprocessor**. PHP is an open-source, general-purpose language best known for server-side web development.

A request normally follows this path: browser → web server → PHP runtime → database/files/services when needed → HTML or JSON response → browser. PHP source code stays on the server.

:::caution[Correction]
“PHP runs line by line without compilation” is only a teaching shortcut. The engine compiles source to opcodes before execution, and modern versions can use JIT.
:::

PHP can process forms, serve APIs, access databases and files, run CLI and cron jobs, send mail, create images/PDFs through libraries, and support both procedural and object-oriented programming. Desktop apps are possible through third-party tooling, but are not PHP’s common use case.

## Runtime and syntax

XAMPP, WAMP, MAMP, and LAMP bundle a web server, database, and PHP for local work. PHP also has a development server:

```bash
php -S localhost:8000 -t public
```

Do not use it as a production server.

```php
<?php
$title = 'My shop';
?>
<!doctype html>
<html lang="en">
<head><title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></title></head>
<body>
<?php if ($title !== ''): ?>
    <h1><?= htmlspecialchars($title) ?></h1>
<?php else: ?>
    <p>No title</p>
<?php endif; ?>
</body>
</html>
```

Statements end with `;`; compound blocks do not need a semicolon after `}`. In PHP-only files, omit the closing `?>` to avoid accidental output. Headers, cookies, and sessions must be started before output.

Comments use `//`, `#`, or `/* ... */`. Variable names are case-sensitive. Although keywords and function/class lookup are case-insensitive, always use the declared casing; constants are case-sensitive.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Introduction and PHP syntax">
<p class="lesson-diagram-title">Concept map: Introduction and PHP syntax</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>What PHP is</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Runtime and syntax</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>:::caution[Correction] “PHP runs line by line without compilation”</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>PHP can process forms, serve APIs, access databases</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Comments use //, #, or /* </span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “What PHP is” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The name historically meant Personal Home Page; its recursive official expansion is PHP: Hypertext Preprocessor. PHP is an open-source, general-purpose language best known for server-side web development. A request normally follows this path: browser → web server → PHP runtime → database/files/services when needed → HTML or JSON response → browser. PHP source code stays on the server. :::caution[Correction] “PHP… In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “What PHP is” with “Runtime and syntax”. Why does neither replace the other in “Introduction and PHP syntax”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “What PHP is”: The name historically meant Personal Home Page; its recursive official expansion is PHP: Hypertext Preprocessor. PHP is an open-source, general-purpose language best known for server-side web development. A request normally follows this path: browser → web server → PHP runtime → database/files/services when needed → HTML or JSON response → browser. PHP source code stays on the server. :::caution[Correction] “PHP… For “Runtime and syntax”: XAMPP, WAMP, MAMP, and LAMP bundle a web server, database, and PHP for local work. PHP also has a development server: Do not use it as a production server. Statements end with ;; compound blocks do not need a semicolon after }. In PHP-only files, omit the closing ?&gt; to avoid accidental output. Headers, cookies, and sessions must be started before output. Comments use //, #, or /* ... */. Variable names are… The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “:::caution[Correction] “PHP runs line by line without compilation””. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> :::caution[Correction] “PHP runs line by line without compilation” is only a teaching shortcut. The engine compiles source to opcodes before execution, and modern versions can use JIT. ::: Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “PHP can process forms, serve APIs, access databases” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> PHP can process forms, serve APIs, access databases and files, run CLI and cron jobs, send mail, create images/PDFs through libraries, and support both procedural and object-oriented programming. Desktop apps are possible through third-party tooling, but are not PHP’s common use case. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
