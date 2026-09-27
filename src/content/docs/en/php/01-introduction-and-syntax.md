---
title: 1. PHP introduction and syntax
description: A calm start from zero—where PHP runs, how a request reaches it, and how to write, run, and safely embed your first PHP program.
sidebar:
  order: 1
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **HTTP:** The rules used to exchange requests and responses on the web.
- **API:** A defined interface through which one program requests data or actions from another.
- **Queue:** A line of background jobs waiting to be processed.
- **CLI:** A text-based interface controlled by typed commands.
- **UTF-8:** A common encoding that stores Unicode numbers as bytes.
- **Scope:** The region of code in which a name or variable is visible.


## What will you learn?

Before memorizing syntax, build the mental model. When someone submits a login form, the browser sends a request to a server. A program must read the data, validate it, talk to storage when necessary, and return a result. **PHP is one language you can use to write that server-side program.**

By the end of this lesson, you should understand:

- where PHP runs and how it differs from HTML and browser JavaScript;
- how to run a PHP file from a terminal and a browser;
- how PHP statements, blocks, and semicolons work;
- how PHP and HTML fit together safely;
- how to read a basic error instead of guessing.

## What is PHP?

PHP is a general-purpose programming language best known for backend web development. Its name originally referred to “Personal Home Page”; the recursive name used today is **PHP: Hypertext Preprocessor**.

Keep these three roles separate:

- **HTML** describes page content and structure sent to the browser.
- **Browser JavaScript** can add behavior after the page reaches the user.
- **PHP** commonly runs on the server before the response reaches the browser.

If the server contains this code:

```php
<?php
$name = 'Omar';
echo "Hello {$name}";
```

the browser does not receive `$name` or `echo`. It receives the output:

```text
Hello Omar
```

PHP source should remain on the server. If source code or database credentials are downloaded by a browser, the server is misconfigured; that is not normal PHP execution.

## How does a request reach PHP?

Imagine opening `/products.php`:

1. The browser sends an HTTP request.
2. A web server such as Nginx or Apache receives it.
3. For dynamic PHP work, the web server passes the request to the PHP runtime.
4. PHP executes the code and may read files, query a database, or call another API.
5. PHP produces a body, headers, and a status code.
6. The web server sends the HTTP response.
7. The browser renders HTML or processes JSON, depending on the response.

```text
Browser → HTTP Request → Web Server → PHP → Database/File/API
Browser ← HTTP Response ← Web Server ← Result
```

Not every request needs a database, and PHP does not have to return HTML. It can return JSON to a mobile application, generate a file, or run from the command line without a browser.

:::note[Is PHP interpreted line by line?]
That phrase is a useful first approximation but technically incomplete. The engine compiles source into opcodes and executes them; OPcache can retain compiled opcodes, and modern PHP also includes a JIT. The practical beginner takeaway is that normal PHP development does not require a traditional manual build after every edit.
:::

## What can PHP build?

PHP can:

- receive forms and validate HTTP input;
- generate dynamic pages and web APIs;
- read and write databases and files;
- manage sessions, authentication, and authorization;
- run CLI commands, scheduled jobs, and queue workers;
- send email and communicate with external services;
- create images or PDFs with suitable libraries;
- support procedural and object-oriented code.

External tools can target desktop applications, but that is not PHP's most common use or its natural first use case.

## Prepare the environment

You may install PHP separately or use a local bundle:

- **XAMPP** on several operating systems;
- **WAMP** on Windows;
- **MAMP** on macOS;
- **LAMP**, commonly meaning Linux, Apache, MySQL/MariaDB, and PHP.

Open a terminal and run:

```bash
php --version
```

A working installation prints a version. If the command is unknown, PHP is probably not installed or its executable directory is missing from `PATH`.

## Your first CLI program

Create `hello.php`:

```php
<?php

$name = 'Omar';
$lessonCount = 1;

echo "Hello {$name}!", PHP_EOL;
echo "You finished lesson {$lessonCount}.", PHP_EOL;
```

Run it:

```bash
php hello.php
```

Expected output:

```text
Hello Omar!
You finished lesson 1.
```

Line by line:

- `<?php` begins PHP mode.
- `$name` stores a string in a variable.
- `$lessonCount` stores an integer.
- `echo` outputs values.
- braces make a variable's boundary clear inside a string.
- `PHP_EOL` emits the platform-appropriate line ending.
- `;` terminates a simple statement.

In a PHP-only file, normally omit the closing `?>`. This avoids accidental whitespace output after the closing tag.

## Run PHP in a browser

Create a `public` directory with `index.php`:

```php
<?php

echo '<h1>My first PHP page</h1>';
echo '<p>The server generated this HTML.</p>';
```

From the directory that contains `public`, run:

```bash
php -S localhost:8000 -t public
```

Then open `http://localhost:8000`. The built-in server is designed for learning and local development, not direct production exposure.

## Statements and blocks

Simple statements normally end in a semicolon:

```php
$price = 150;
$quantity = 2;
$total = $price * $quantity;
echo $total;
```

A control block does not take a semicolon after its closing brace:

```php
if ($total >= 300) {
    echo 'Free shipping';
} else {
    echo 'Shipping fee applies';
}
```

When a semicolon or quote is missing, the parser may report the following line because that is where the statement finally became impossible to parse. Always inspect the previous line too.

## Embed PHP in HTML

PHP can enter and leave PHP mode inside an HTML template:

```php
<?php
$title = 'My shop';
$products = ['Keyboard', 'Mouse', 'Monitor'];
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></title>
</head>
<body>
    <h1><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></h1>

    <?php if ($products === []): ?>
        <p>No products are available.</p>
    <?php else: ?>
        <ul>
            <?php foreach ($products as $product): ?>
                <li><?= htmlspecialchars($product, ENT_QUOTES, 'UTF-8') ?></li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>
</body>
</html>
```

`<?= $value ?>` means “output this value.” The alternative `if: ... endif;` and `foreach: ... endforeach;` syntax is easier to follow inside HTML than many nested braces.

We used `htmlspecialchars()` because untrusted text must be encoded before insertion into HTML. If a product name contains `<script>`, it should appear as text rather than execute as browser code.

:::caution[Encoding depends on context]
`htmlspecialchars()` is suitable for ordinary HTML text. URLs, JavaScript, CSS, and attributes can have additional rules. Encode at output time for the exact destination context.
:::

## Headers must precede the body

An HTTP response contains headers followed by a body. Call `header()`, `setcookie()`, and `session_start()` before outputting HTML or text:

```php
<?php

header('Content-Type: application/json; charset=utf-8');

$response = ['status' => 'ok'];
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
```

Output:

```json
{"status":"ok"}
```

If output happens first, PHP may report `headers already sent`. Look for earlier HTML, `echo`, or even whitespace before `<?php`.

## Comments and letter case


The syntax example below uses comments: text ignored by PHP. Composer manages PHP packages; OPcache caches compiled instructions; Nginx receives web requests and can forward PHP work. A variable names a stored value, and syntax defines how code must be written.

```php
// One-line comment

# Another one-line form, used less often
/* A comment
   across lines */

$userName = 'Omar';
echo $userName;
// echo $username; // a different variable
```

Variable names are case-sensitive. Keywords such as `if` are effectively case-insensitive, and functions/classes are resolved case-insensitively, but do not rely on that behavior. Use the declared spelling and follow PSR conventions.

A useful comment explains a decision rather than narrating syntax:

```php
// Keep money in cents to avoid binary floating-point rounding.
$priceCents = 1999;
```

## A complete small example

This program reads a name from the query string and renders it safely. Start the built-in server and open `http://localhost:8000/?name=Omar`:

```php
<?php

$rawName = $_GET['name'] ?? 'Guest';
$name = is_string($rawName) ? trim($rawName) : 'Guest';

if ($name === '') {
    $name = 'Guest';
}

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Welcome</title></head>
<body><h1>Hello <?= $safeName ?></h1></body>
</html>
```

Try `?name=<b>Omar</b>`. The markup should appear as text rather than bold output, proving that the value was encoded.

## Common first-day mistakes

- Opening a PHP file directly: run it with PHP CLI or a web server.
- `php` is unknown: check installation and `PATH`.
- A parse error points at innocent code: inspect the previous line for a missing quote, bracket, or semicolon.
- An undefined variable appears: check spelling and whether assignment ran first.
- `headers already sent`: body output happened before header changes.
- User input is rendered directly: validate it and encode for the output context.

## The first-program journey

```text
Write hello.php → Run PHP → Read output or error → Change one thing → Run again
```

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Does a browser receive PHP source? Describe the request path.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> No. The web server hands work to PHP; PHP executes source and returns output. The browser receives an HTTP response such as HTML or JSON.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Predict the output of <code>echo 'PHP', ' ', 8;</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> <code>PHP 8</code>. <code>echo</code> can output several comma-separated values in order.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>An error points to line 8, but line 8 looks valid. Where should you inspect next?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Inspect the preceding line for an unclosed string or bracket or a missing semicolon.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why is <code>echo $_GET['name'];</code> unsafe in HTML?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A user can submit markup or script. Validate according to business rules and encode the value for its HTML context at output time.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>Fix <code>$name = 'Omar' echo $name;</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Add the missing statement terminator: <code>$name = 'Omar'; echo $name;</code>.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>Build a page that accepts <code>product</code> and <code>price</code> and displays them safely.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Solution outline:</strong> Read defaults with <code>??</code>, validate the price as a number in an allowed range, and pass the product through <code>htmlspecialchars()</code> when rendering. Test missing, invalid, and markup-containing values.</div></details></section>
</div>

## Summary

PHP usually runs on the server and the browser receives its output. You can run PHP through the CLI or a local web server. Begin PHP mode with `<?php`, terminate simple statements with semicolons, and encode untrusted values for their output context. The next lesson explains how variables store values, how scope controls visibility, and how request data enters PHP.

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php hello.php
~~~

**Success criterion:** The program prints the expected line and exits 0; then introduce one syntax error and confirm the diagnostic identifies file and line.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

To reduce overload, study this lesson in two passes: CLI for syntax and exit codes, then Web for headers and body. Composer is not required for a first file but becomes the project entry point for autoloading and locked dependencies. The built-in server is not production.

### Try it yourself

Run the example in CLI and Web modes and identify differences in input, output, and hosting process.
