---
title: 5. Conditions and loops
description: if, switch, match, for, while, do-while, and foreach with important differences.
sidebar:
  order: 5
---

## The problem: choose a path, then repeat

A grade sheet gives 95 an A, 40 an F, and rejects 150. Then we repeat that decision for every student. **Control flow** is execution's route through instructions; a **condition** is a question producing `true` or `false`, and a **loop** repeats instructions. Study branching first, then trace repetition on paper. Every complete program here runs on PHP 8.0+ in its own file.

## if, elseif, else: the first matching branch

A **block** groups instructions inside `{ }`. A **branch** is a selected path. Read `if` as “if,” `elseif` as “otherwise if,” and `else` as “in all remaining cases.” PHP checks top to bottom and selects the first true branch in the chain. Save `grade.php` and run `php grade.php`:

~~~php
<?php
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
echo "Score {$score}: {$grade}", PHP_EOL;
~~~

~~~text
Score 75: B
~~~

`$score` is the input. `||` means “or,” rejecting values below 0 or above 100. For 75, the first condition is false, the 90 check is false, and the 75 check is true. We store B and skip later branches. `echo` is outside the chain and runs after any branch.

| Input | Result |
|---|---|
| -1 / 101 | invalid |
| 0 / 49 | F |
| 50 / 74 | C |
| 75 / 89 | B |
| 90 / 100 | A |

**Mistake and correction:** starting with `$score >= 50` gives 95 a C. Check higher thresholds first. Separate `if` statements can overwrite the result several times; keep alternatives in a chain and reserve independent conditions for independent actions. `>=` includes the boundary; `>` excludes it.

## Short forms for choosing a value

`$active ? 'active' : 'paused'` is ternary: condition, true result, false result. Use it for a short choice. `$input['name'] ?? 'guest'` replaces only missing keys or `null`, preserving `0` and `''`. The shorter `?:` uses Boolean conversion and also replaces `'0'`.

`$user?->address?->city` uses nullsafe access: it stops at `null` in an object chain, not at an exception or a missing array key. See [OOP](/en/oop/) for objects. In HTML you may use `if (...): ... else: ... endif;` instead of braces, but do not mix styles within one block.

## switch and match

`switch` selects a `case` by a value. `break` prevents continuing into the next case; that continuation is called **fall-through**. PHP 8.0's `match` is an expression returning a value, compares type and value with `===`, and never falls through. Run `status.php`:

~~~php
<?php
$status = '200';
switch ($status) {
    case 200:
        echo "switch: success", PHP_EOL;
        break;
    default:
        echo "switch: other", PHP_EOL;
}
$message = match ($status) {
    200, 201 => 'success',
    default => 'other',
};
echo "match: {$message}", PHP_EOL;
~~~

~~~text
switch: success
match: other
~~~

`switch` compares loosely, matching the string `'200'` to integer `200`. `match` does not. An **arm** supplies a matching value and a result after `=>`; multiple values can share one result. No match and no `default` raises `UnhandledMatchError`. `match (true)` can use range conditions such as `$age < 18`, although `if` is often clearer. Validate input before converting its type.

## for: initialize, test, run the body, update

A **counter** tracks iterations; an **accumulator** collects the result. Save and run `sum.php`:

~~~php
<?php
$total = 0;
for ($i = 1; $i <= 3; $i++) {
    $total += $i;
    echo "i={$i}, total={$total}", PHP_EOL;
}
echo "after: i={$i}, total={$total}", PHP_EOL;
~~~

~~~text
i=1, total=1
i=2, total=3
i=3, total=6
after: i=4, total=6
~~~

`$total = 0` runs once; putting it in the body resets the total on every iteration. `$i = 1` initializes once, then `$i <= 3` is tested before each iteration. The body adds and prints; `$i++` increments afterward. At 4 we exit. Do not put `;` after `for (...)`: it creates an empty body.

| Before body | Total before | Total after addition | After increment |
|---|---|---|---|
| i=1 | 0 | 1 | i=2 |
| i=2 | 1 | 3 | i=3 |
| i=3 | 3 | 6 | i=4 |

A three-element list has keys 0, 1, 2, so use `$i < count($names)`, not `<=`. One extra or missing iteration is an **off-by-one error**. All `for` parts are optional; `for (;;)` cannot stop by itself. Templates may use `for (...): ... endfor;`.

## while and do-while: when do we check?

`while` checks before its body and may run zero times. `do-while` checks afterward and runs at least once. `attempts.php` uses fixed inputs so the experiment is repeatable:

~~~php
<?php
$replies = ['', '', 'Omar'];
$attempt = 0;
do {
    $input = $replies[$attempt] ?? '';
    $attempt++;
    echo "attempt={$attempt}", PHP_EOL;
} while ($input === '' && $attempt < 3);
echo $input === '' ? "No name\n" : "Hello {$input}\n";

$remaining = 0;
while ($remaining > 0) {
    echo "work", PHP_EOL;
    $remaining--;
}
~~~

~~~text
attempt=1
attempt=2
attempt=3
Hello Omar
~~~

We read an element, then increment before testing. `&&` requires both conditions: the name is empty and fewer than 3 attempts have occurred. The final loop never runs. With `fgets(STDIN)`, check `false` for end of input. Every loop needs progress and an exit condition; an increment on one path does not guarantee every path reaches it.

## foreach, continue, and break

`foreach` visits elements without managing an index. `continue` skips the rest of the current iteration; `break` ends the loop. Run `scores.php`:

~~~php
<?php
$scores = ['Ali' => 0, 'Mona' => -1, 'Omar' => 100, 'Nour' => 80];
foreach ($scores as $name => $score) {
    if ($score < 0) {
        continue;
    }
    echo "{$name}: {$score}", PHP_EOL;
    if ($score === 100) {
        break;
    }
}
~~~

~~~text
Ali: 0
Omar: 100
~~~

`$name => $score` reads key and value. Zero is valid; Mona is skipped and Nour is never visited. For rows you may use `foreach ($users as ['id' => $id, 'name' => $name])` when fields exist. `break 2` exits two levels; draw the nesting first. `continue` inside a nested `switch` can target the wrong level; simplify the structure or specify the level carefully.

`foreach ($prices as &$price)` modifies original elements by reference. Afterward `$price` still points to the last element: call `unset($price)` immediately. Start with iteration by value and use references only for deliberate mutation.

## Predict, debug, complete

<details><summary>Predict grades 49, 50, 75, 90, and a loop starting at 4 with i &lt;= 3</summary><p>F, C, B, A. The loop runs zero times because its condition is checked before the body. Test both sides of each boundary.</p></details>

<details><summary>Debug: $i = 0; while ($i &lt; 3) { if ($i === 1) continue; $i++; }</summary><p>The counter gets stuck at 1 because continue skips the increment. Move progress before the skip, or use for with its update in the third part; for still executes that update after continue.</p></details>

<details><summary>Complete a loop summing even integers from 1 through 6</summary><p>Start total at zero and iterate 1 through 6 inclusive, then <code>if ($i % 2 === 0) { $total += $i; }</code>. Zero remainder means even, so the result is 12.</p></details>

<details><summary>After foreach by reference, you assign $price = 99 without unset. What changes?</summary><p>The last element becomes 99. Call <code>unset($price)</code> after the loop; removing the reference variable does not delete the array element.</p></details>

## A step toward the project

The notebook in lesson 17 will choose between an error and saving a submitted form, then display elements using a loop. List missing, empty, and valid input cases now. For extra practice run `php control-flow-lab.php` from the [existing lab](/en/php/00-lab-setup/) and check zero, one, and several elements.
