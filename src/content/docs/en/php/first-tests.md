---
title: "Your first automated test"
prev: {"link":"/en/php/cli-expenses-project/","label":"CLI project: expenses before the web"}
next: {"link":"/en/php/","label":"PHP guide"}
description: "Expected and actual, boundary cases and regression"
sidebar:
  order: 11.7
---

## Why running once is not a test

Requires functions, arrays, conditions, and exit codes. A test pairs known input with an independently chosen expected result. An assertion compares actual and expected, failing visibly on a mismatch. Regression means a behavior that worked has broken after a change.

Save first-tests.php and run php first-tests.php on PHP 8.1+. No files or database are modified.

~~~php
<?php
declare(strict_types=1);
function total(array $values): int
{
    return array_sum($values);
}
$cases = [[[], 0], [[0], 0], [[10, 0, 20], 30]];
$failed = 0;
foreach ($cases as [$input, $expected]) {
    $actual = total($input);
    if ($actual !== $expected) {
        fwrite(STDERR, "FAIL expected=$expected actual=$actual\n");
        $failed++;
    }
}
echo 'cases=', count($cases), ' failures=', $failed, PHP_EOL;
exit($failed === 0 ? 0 : 1);
~~~

Expected: cases=3 failures=0, exit 0. Empty input and zero are valid. Deliberately change total to return 1: all three cases must fail and exit 1. Restore the code. A green result without checking a deliberately broken version does not prove the test is useful.

## Independent exercise

Extract the expenses project's count-above-100 calculation into a function. Test empty input, 100, 101, and two qualifying values. Derive expected values by hand, not by calling the same function twice.

<details><summary>Review after trying</summary>

Expected counts are 0, 0, 1, and 2. Include the equality boundary so changing > to >= fails. Keep printing outside the calculation.

</details>

## Test boundaries

A unit test isolates a small calculation; an integration test crosses a real boundary such as file storage. Use temporary training files, not personal data. Do not rely only on PHP assert, which may be disabled by configuration. [Continue to quality tools](/en/php-runtime/10-testing-quality/).

