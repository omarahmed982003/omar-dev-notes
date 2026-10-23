---
title: "2. Variables and references"
prev: {"link":"/en/php/01-introduction-and-syntax/","label":"PHP introduction and syntax"}
next: {"link":"/en/php/03-types/","label":"Data types and the type system"}
description: Variables from first principles, value and reference assignment, scope, and how request data reaches a PHP program through superglobals.
sidebar:
  order: 2
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **URL:** The complete address of a resource such as a page or API endpoint.
- **Cache:** A temporary copy that reduces waiting and repeated work.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **UTF-8:** A common encoding that stores Unicode numbers as bytes.
- **Scope:** The region of code in which a name or variable is visible.
- **Function:** A named, reusable block of code with one defined job.


## Why do programs need variables?

Programs work with values that change: a user's name, a product price, a quantity, or a calculated result. A **variable** gives a value a meaningful name so later instructions can use it.

The “labeled box” analogy is useful at first, although the engine's real storage strategy depends on the value type and memory management.

```php
<?php

$productName = 'Keyboard';
$priceCents = 150000;
$inStock = true;

echo $productName, PHP_EOL;
echo $priceCents, PHP_EOL;
```

The `$` introduces a variable name. Here `=` is assignment: evaluate the right side and assign its value to the name on the left.

## Naming rules and useful names

After `$`, a variable name starts with a letter or underscore and may then contain digits:

```php
$name = 'Omar';       // valid
$_count = 3;          // valid
$price2 = 19.5;       // valid
// $2price = 19.5;    // invalid
```

Variable names are case-sensitive:

```php
$userName = 'Omar';
$username = 'Ali';

echo $userName; // Omar
echo $username; // Ali
```

Choose a name that carries meaning. `$priceCents` is clearer than `$p`; `$isEmailVerified` is clearer than `$flag`.

## The value determines the current type

PHP is dynamically typed, so a variable declaration does not need a type:

```php
$value = 10;      // int
$value = 'ten';   // now string
```

This does not mean PHP has no types. Every value has a type, and operations, conversions, and comparisons follow type rules. Inspect a value while learning or debugging:

```php
$price = 19.5;

var_dump($price);             // float(19.5)
echo get_debug_type($price);  // float
```

## Variables inside strings

Double-quoted strings interpolate variables; single-quoted strings usually preserve the text:

```php
$name = 'Omar';
$price = 20;

echo "Hello {$name}, the price is {$price} pounds.", PHP_EOL;
echo 'Hello $name', PHP_EOL;
```

Output:

```text
Hello Omar, the price is 20 pounds.
Hello $name
```

Braces clearly mark the variable boundary. The older `${name}` interpolation syntax is deprecated.

## Assignment by value

Predict this result before running it:

```php
$a = 10;
$b = $a;
$b++;

echo $a, PHP_EOL;
echo $b, PHP_EOL;
```

Output:

```text
10
11
```

`$b = $a` gives `$b` a logically independent value. Changing `$b` does not change `$a`.

For arrays and strings, PHP can optimize copying internally through **copy-on-write**. It need not copy every byte immediately, but the values behave independently and separation occurs when one is changed. Learn the visible semantics before the storage optimization.

## Assignment by reference

`&` links two variable names to the same logical container:

```php
$score = 10;
$alias =& $score;

$alias++;
echo $score; // 11
```

`unset($alias)` removes that name's link; it does not delete `$score`.

A PHP reference is not manual pointer arithmetic like C. Most application code does not need references. Unnecessary aliases make it difficult to answer “which code changed this value?”

## Objects behave differently

Assigning an object to another variable normally makes both variables refer to the same object:

```php
$first = new stdClass();
$first->name = 'Omar';

$second = $first;
$second->name = 'Ali';

echo $first->name; // Ali
```

Use `clone` when you need a distinct object. The OOP track explains shallow and deep copying later.

## Variable variables

PHP can use one variable's value as another variable's name:

```php
$field = 'email';
$$field = 'omar@example.com';

echo $email;
```

The feature exists, but an array or object is usually clearer:

```php
$user = ['email' => 'omar@example.com'];
echo $user['email'];
```

Never turn arbitrary user input directly into variable names. It hides allowed fields and makes validation and reasoning difficult.

## Continue with Variable scope and lifetime

[Read the standalone topic](/en/php/scope/) after the prerequisites. Its original examples and mechanisms are preserved there.

## Continue after language fundamentals

[Request input and superglobals](/en/php/request-input/) owns HTTP input, validation, and output encoding. Study it after functions and arrays.

## Value flow

```text
Request value → Read → Check type and rules → Store clearly → Encode for output
```

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Predict <code>$a = 5; $b = $a; $b++; echo "$a,$b";</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> <code>5,6</code>; normal assignment produces logically independent values.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>What changes if assignment uses <code>&</code>?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> With <code>$b =& $a</code>, the result becomes <code>6,6</code> because the names are linked.</div></details></section>
</div>

## Summary

A variable names a value during execution. Normal assignment, references, and objects do not have identical sharing behavior. Scope controls visibility, and explicit parameters are clearer than global dependencies. Superglobals bring request data into PHP, but data must be read defensively, validated, converted, and encoded for its output context.

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php scope-lab.php
~~~

**Success criterion:** Output proves the difference among local, global, and static state, and no superglobal value is read before checking key presence and shape.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Superglobals are trust boundaries, not ready data: check presence, shape, and size, then convert into a request object. Variable variables and <code>eval</code> are rarely sound design tools; a map, callable registry, or explicit parser is clearer and safer. Avoid hidden global dependencies.

### Try it yourself

Refactor an endpoint reading $_GET everywhere into validated values passed to functions.
