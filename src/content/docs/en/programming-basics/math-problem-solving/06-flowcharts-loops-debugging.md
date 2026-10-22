---
title: "Flowcharts, loops, and debugging"
description: "A flowchart visualizes execution, loops represent repetition, and debugging compares actual behavior with intended behavior."
tableOfContents: true
sidebar:
  order: 7
prev: {"link":"/en/programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees/","label":"Algorithms, pseudocode, and decision trees"}
next: {"link":"/en/programming-basics/math-problem-solving/","label":"Math and problem solving"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Sum integers 1 through N, with N a nonnegative integer. A **loop** repeats instructions while a specified condition remains true.

Know assignment and comparisons. The optional PHP example follows variables and loops in the [PHP course](/en/php/); the manual trace does not require syntax knowledge.

## Initialization, condition, update

Start `sum=0` and `i=1`. While `i<=N`, add i to sum, increment i, then test again.

An **accumulator** gathers values, as sum does. A **counter** counts events or elements, such as attempts. Here i selects the current number and advances through the range. A variable's purpose determines its role.

<figure class="teaching-figure">
  <img src="/diagrams/foundations/math/loop-back-edge-en.svg" alt="Initialize sum and i, test i against N, add and increment on Yes, return to the test, and print sum on No." loading="lazy" />
  <figcaption>The return arrow goes from the update to the condition, not to initialization. For N = 3 the body runs three times; the condition is checked four times.</figcaption>
</figure>

## Trace N=3

A **manual trace** records values around each step.

| Before condition | i | sum | i≤3? | After body |
|---|---: |---: |---|---|
| Initial | 1 | 0 | Yes | sum=1, i=2 |
| Second | 2 | 1 | Yes | sum=3, i=3 |
| Third | 3 | 3 | Yes | sum=6, i=4 |
| Fourth | 4 | 6 | No | Print 6 and finish |

With N=0 the body never runs and sum remains zero. With N=1 it runs once and returns 1.

## Complete PHP example

Save `loop.php` and run `php loop.php` with PHP 8+. No files are read or written. A `for` groups initialization, condition, and update, separated by semicolons; braces contain the repeated body.

~~~php
<?php
declare(strict_types=1);

$n = 3;
$sum = 0;

for ($i = 1; $i <= $n; $i = $i + 1) {
    $sum = $sum + $i;
}

echo $sum . PHP_EOL;
~~~

Expected output is `6` on one line. `echo` prints and `PHP_EOL` ends the line. The small test value n is valid; user input needs type and range validation first. Large values need runtime and numeric-range checks.

## Debugging finds the first divergence

**Debugging** compares expected and actual behavior and isolates the cause. A result 3 instead of 6 for N=3 suggests checking `i<N`, which omits 3. This is an **off-by-one** error.

A result 10 can come from `i<=N+1`; the extra value is 4, not N=3. An excess of exactly 3 may instead mean starting sum at 3 or adding 3 twice. A difference suggests a hypothesis, not a unique proven cause.

Without the update, a true condition can remain true forever. Do not run an infinite loop as an experiment; inspect it on paper or with a debugger breakpoint and repair it.

## A flowchart supports, not replaces, testing

A **flowchart** represents execution. Conventional shapes are ovals for start/end, rectangles for operations, diamonds for decisions, and parallelograms for input/output.

This diagram emphasizes branches and the return edge. A forward-only line hides repetition. A correct diagram still does not prove the code implements it.

## Optional depth: sentinels and attempts

A **sentinel** is an agreed special stop value, such as `stop` ending number input. It must not conflict with valid data and normally is not included in the calculation.

Three login attempts use a counter: initialize attempts=0, increment after each failure, repeat while not successful and attempts<3. Test success on the first and third attempts and three failures. Abuse prevention belongs to a separate security treatment.

## Independent practice

1. Predict results for N=0, 1, 4.
2. For N=4 replace only `i<=N` with `i<N`. What is omitted?
3. Can zero be a sentinel if zero is valid data to be processed?
4. Trace every condition check for N=2, including the final failed check.

<details>
<summary>Answers and reasoning</summary>

1. Zero, one, ten.
2. Result 6; value 4 is omitted.
3. Not without changing the contract to exclude zero. Use a nonconflicting stop marker.
4. (i, sum) is (1, 0), (2, 1), then (3, 3). The last check fails and prints 3.

</details>

## Summary

A loop needs a starting state, condition, update, and exit path. This is a first-pass stopping point: return to the [math and problem-solving guide](/en/programming-basics/math-problem-solving/).

After practicing variables, loops, and functions in your chosen language, return to [comparing solutions and costs](/en/programming-basics/08-problem-solving-algorithms/) as later depth, not a prerequisite for a first program.
