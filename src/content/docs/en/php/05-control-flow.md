---
title: 5. Conditions and loops
description: if, switch, match, for, while, do-while, and foreach with important differences.
sidebar:
  order: 5
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Loop:** A structure that repeats instructions according to a condition.


## How does a program choose a path?

So far, instructions could run in sequence. Real programs choose and repeat: show an account only when a user is authenticated, calculate a discount only when its rule is satisfied, and process every item in a list.

This is **control flow**. A condition selects a branch; a loop repeats a block. Before writing an `if`, express the business rule as a true/false question. Condition order matters: if a grade check begins with `$score >= 50`, a score of 95 enters that broad branch before reaching the A rule.

```php
$score = 75;

if ($score < 0 || $score > 100) {
    $grade = 'invalid';
} elseif ($score >= 90) {
    $grade = 'A';
} elseif ($score >= 75) {
    $grade = 'B';
} elseif ($score >= 50) {
    $grade = 'C';
} else {
    $grade = 'F';
}
```

Test exact boundaries such as 49, 50, 74, 75, 89, and 90. For every loop, identify the initial state, continuation condition, and update that moves toward termination. Missing one of them commonly creates an infinite loop.

## `if`, `elseif`, and `else`

```php
if ($score >= 90) {
    $grade = 'A';
} elseif ($score >= 75) {
    $grade = 'B';
} else {
    $grade = 'C';
}

$label = $active ? 'active' : 'inactive';
$username = $_GET['username'] ?? 'guest';
$postId = $user?->latestPost()?->id;
```

Alternative `if: ... endif;` syntax is useful in templates. `??` checks existence/non-null like `isset`; the nullsafe operator is `?->`.

```php
switch ($role) {
    case 'admin':
        $permissions = ['all'];
        break;
    default:
        $permissions = ['read'];
}
```

`switch` historically uses loose comparison and falls through without `break`.

```php
$message = match ($status) {
    200, 201 => 'success',
    404 => 'not found',
    default => 'unexpected',
};

$category = match (true) {
    $age < 13 => 'child',
    $age < 18 => 'teen',
    default => 'adult',
};
```

`match` returns a value, compares strictly, has no fall-through, and throws `UnhandledMatchError` when no arm/default matches.

```php
for ($i = 0; $i < 5; $i++) {
    echo $i;
}

while ($attempts < 3) {
    $attempts++;
}

do {
    $input = readline();
} while ($input === '');
```

A `while` body may never run; `do-while` runs once before checking.

```php
foreach ($users as ['id' => $id, 'name' => $name]) {
    echo "{$id}: {$name}";
}

foreach ($prices as &$price) {
    $price *= 1.14;
}
unset($price);
```

Always unset a reference variable after a by-reference `foreach`. Use `continue` to skip an iteration, `break` to leave a loop, and `break 2` for two nested levels.

## Progressive practice

<details><summary>1. Predict grades at 49, 50, 75, and 90</summary><p>Trace branches from top to bottom. The boundaries should produce F, C, B, and A. A different result usually means branch order or a comparison boundary is wrong.</p></details>

<details><summary>2. Find the infinite loop</summary><p><code>$i = 0; while ($i &lt; 3) { echo $i; }</code> never updates <code>$i</code>. Add <code>$i++</code> and predict output before running it.</p></details>

<details><summary>3. Choose switch or match</summary><p>Use <code>match</code> when you need a returned value, strict comparison, and no fall-through. Use <code>switch</code> deliberately in legacy code or multi-statement case flows.</p></details>

## Lesson-specific problems

<details><summary>When is <code>match</code> preferable to <code>switch</code>?</summary><p>When you want strict comparison, an expression result, and no accidental fall-through.</p></details>

<details><summary>How does a <code>while</code> loop become infinite?</summary><p>The condition-driving state never changes or no exit path is reached; verify progress on every iteration.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php control-flow-lab.php
~~~

**Success criterion:** Cases cover the minimum, below minimum, maximum, and above maximum, and each input reaches exactly one intended branch.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

<code>break</code> exits the current loop and <code>continue</code> advances to the next iteration; levels in nested loops require care. Alternative syntax can help templates. Every while loop needs a bound or provable progress, with zero-iteration and final-boundary tests.

### Try it yourself

Write a loop and test zero/one/many cases plus a guard against infinite execution.
