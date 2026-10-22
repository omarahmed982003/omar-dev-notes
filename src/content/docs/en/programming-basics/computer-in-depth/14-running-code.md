---
title: "From solution steps to running code"
description: "From solution steps to running code"
sidebar:
  order: 13
prev: {"link":"/en/programming-basics/computer-in-depth/15-parallel-work/","label":"When does parallel work help?"}
next: {"link":"/en/programming-basics/computer-in-depth/16-testing-and-debugging/","label":"Test behavior and locate a defect"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Turn a request into testable steps

“Write a program that decides whether a student passed” is incomplete. Which grades are valid, where does passing start, and what happens outside the range?

A **requirement** describes intended behavior. Our agreement is: a numeric grade from 0 through 100 is valid, passing starts at 50, and other values are rejected.

## An algorithm is not code

An **algorithm** is a sequence of defined steps for solving a problem, independent of a programming language. **Code** implements those steps using a language's rules.

**Pseudocode** expresses structured human-readable steps without executable language syntax. This is a paper model, not a shell command:

```text
READ grade
IF grade < 0 OR grade > 100
    REPORT invalid
ELSE IF grade >= 50
    REPORT passed
ELSE
    REPORT failed
```

READ receives a value; IF tests a condition; OR accepts either alternative; ELSE follows the alternative path when earlier conditions fail.

A **flowchart** draws the same steps as a start, input, branching decision, result, and finish. Its purpose is tracing decisions, not memorizing decorative arrows.

## Trace before running

A **dry run** follows an input by hand and records each decision. For 50, rejection is false and the passing condition is true, producing “passed.”

| Input | Expected result | Reason |
|---|---|---|
| -1 | invalid | Below the range |
| 0 | failed | Valid but below 50 |
| 49 | failed | Immediately below the boundary |
| 50 | passed | Exactly the boundary |
| 100 | passed | Last valid value |
| 101 | invalid | Beyond the range |

An **edge case** is a significant boundary or unusual input. Passing one test with 70 proves neither correct handling of 50 nor rejection of 101.

If users supply text, validating its shape and converting it to a number require additional rules. Arbitrary text is not automatically a valid numeric grade.

## Who turns the steps into execution?

**Source code** is the human-written program. A **compiler** transforms one representation into a lower-level representation; an **interpreter** executes instructions or a representation at runtime.

A **runtime** provides services while the program runs, such as memory management and error handling. An implementation can combine compilation and interpretation.

**JIT**, or just-in-time compilation, translates selected work into machine code during execution. Availability and benefit depend on implementation, settings, and workload.

A common PHP path parses and compiles source into intermediate instructions, then executes them in PHP's runtime. An ahead-of-time compiled program instead produces an executable during a build step. See [software and runtimes](/en/programming-basics/computer-in-depth/software-and-runtime/).

Language choice depends on the domain, libraries, team, performance, and distribution. Neither ahead-of-time compilation nor JIT proves that business logic is correct.

## Optional first implementation after configuring PHP

Writing code is not a prerequisite here. Complete the paper trace and revisit this example during the first PHP lessons.

`$grade` stores the grade; `if` chooses a path; `||` means “or”; `>=` means “at least.” `echo` displays text and `PHP_EOL` ends the line.

Save a new practice file named `grade.php`; it does not modify other files:

```php
<?php
$grade = 50;
if ($grade < 0 || $grade > 100) {
    echo 'invalid', PHP_EOL;
} elseif ($grade >= 50) {
    echo 'passed', PHP_EOL;
} else {
    echo 'failed', PHP_EOL;
}
```

Run `php grade.php` and expect `passed`. Change the value to 49 and then -1: expect `failed` and `invalid`.

Validation comes before classification. Checking only whether a value exceeds 50 could incorrectly accept 101.

## Independent practice

Write the table's results before reading the implementation. Then change the passing boundary to 60. Which condition and tests must change?

<details>
<summary>Review the reasoning after attempting</summary>

Use “at least 60” and test 59, 60, and 61. Retain range-boundary and invalid-input tests; changing one rule does not remove the rest of the agreement.

</details>

## Summary

Define inputs, outputs, and rules; trace cases; then implement. Compilation and execution do not replace understanding the problem.

Next: [testing behavior and diagnosing faults](/en/programming-basics/computer-in-depth/16-testing-and-debugging/).
