---
title: "Division, remainders, and numerical precision"
description: "Division, remainders, and numerical precision"
sidebar:
  order: 2
prev: {"link":"/en/programming-basics/math-problem-solving/01-arithmetic-foundations/","label":"Ratios, averages, and powers"}
next: {"link":"/en/programming-basics/math-problem-solving/02-variables-equations-logic/","label":"Variables, equations, and Boolean logic"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Seventeen items and boxes holding five give three full boxes and two remaining items. Packing **all** items takes four boxes. Different questions require different division operations.

The arithmetic needs no code. The optional complete example requires PHP 8+ and CLI file execution introduced in the [PHP course](/en/php/); completing that course is not required to read this lesson.

## Quotient and remainder

`17 = 3×5 + 2`. Three is the **integer quotient** and two the **remainder**. PHP uses `intdiv(17,5)` and `17 % 5` respectively.

PHP's `/` performs ordinary division: `17/5` gives 3.4. Integer operands do not guarantee an integer quotient.

For nonnegative item counts and positive box sizes, **ceiling division** counts enough boxes for everything: take the integer quotient and add one if a remainder exists. Seventeen items need four boxes, fifteen need three, and zero needs zero.

## Complete PHP experiment

Save as `division.php` in a new training folder and run `php division.php`. It only prints; it does not access your files.

A **function** names steps with inputs and a result. `int` declares integers, `return` returns the result, `%` calculates a remainder, `===` compares strictly, and `? :` chooses between two values. `foreach` visits the examples.

The input contract requires `count >= 0` and `size > 0`. `throw` signals failure with `InvalidArgumentException` when that contract is violated.

~~~php
<?php
declare(strict_types=1);

function boxesNeeded(int $count, int $size): int
{
    if ($count < 0 || $size <= 0) {
        throw new InvalidArgumentException('Invalid count or box size');
    }

    return intdiv($count, $size) + ($count % $size === 0 ? 0 : 1);
}

foreach ([[10, 3], [17, 5], [0, 5]] as [$count, $size]) {
    echo $count . '/' . $size . ': ' . boxesNeeded($count, $size) . PHP_EOL;
}
~~~

Expected output:

~~~text
10/3: 4
17/5: 4
0/5: 0
~~~

`strict_types` makes strict calls reject mismatched argument types instead of silently converting them; `PHP_EOL` ends the line. The calculation adds zero or one to the quotient instead of adding a box size to a possibly near-limit count.

`intdiv(count + size - 1, size)` also works for nonnegative count and positive size **if the intermediate addition fits**. In PHP, `(count + size - 1) / size` alone is not ceiling division: for 17 and 5 it gives 4.2. The division operation is part of the contract.

## Floor, ceiling, and rounding

**Floor** is the greatest integer no larger than a value. **Ceiling** is the least integer no smaller. **Round** selects a nearest value using the function's tie rule.

| Value | floor | ceil |
|---|---: |---: |
| 2.3 | 2 | 3 |
| −2.3 | −3 | −2 |

Removing the fractional part toward zero is not floor for negatives. PHP's `intdiv(-7,3)` gives−2; Python's `//` gives−3. State the language and operation.

Ties such as 2.5 depend on the language and rounding mode. Do not assume one universal rule.

## Remainders describe cycles

Five hours after hour 23 is `(23+5)%24 = 4`. A cycle of length 24 maps the result back into the clock. Remainders also describe parity, divisibility, and repeated positions.

PHP can return a negative remainder: `-1 % 24 = -1`. If the contract requires 0 through 23, normalize with `((value % 24)+24)%24`. A general formula needs a positive modulus and safe intermediate ranges.

## Optional depth: GCD and LCM

The **greatest common divisor (GCD)** is the largest positive integer dividing two positive integers exactly. **Euclid's algorithm** repeatedly replaces the pair with the divisor and remainder.

| Operation | Remainder |
|---|---: |
| 48 % 18 | 12 |
| 18 % 12 | 6 |
| 12 % 6 | 0 |

The last nonzero divisor is 6. The common divisors of `a,b` are exactly those of `b,a%b`.

The **least common multiple (LCM)** is the first positive common multiple of positive integers. Bells ringing every 4 and 6 minutes coincide again at 12. For 48 and 18, `48/6×18=144`. Dividing by the GCD before multiplying reduces the intermediate value but does not guarantee against overflow.

A common programming convention returns zero for the LCM if either input is zero; handle `(0,0)` before dividing. `abs` means absolute value, the distance from zero. Negative inputs, including the most negative integer, need an explicit type-range policy; these examples use small positives.

## Approximation and overflow are different

**Floating point** approximates many fractions. **Absolute error** is the magnitude of the difference from a reference: 100.2 instead of 100 has error 0.2. **Relative error** divides by the reference magnitude: 0.002, or 0.2%.

A **tolerance** is an acceptable difference chosen for the problem, not one universal constant. A zero reference requires special handling rather than relative-error division by zero.

**Overflow** exceeds a numeric type's range; a tolerance does not repair it. Exact monetary work may use integer minor units with range checks, or an appropriate decimal representation.

## Independent checks

1. Find quotient, remainder, and boxes needed for 17, 15, and 0 with box size 5.
2. Why does copying `(17+5-1)/5` into PHP not give the box count?
3. Predict `boxesNeeded(5,0)` and `boxesNeeded(-1,3)` from the contract.
4. Find the hour five hours after 23, and floor/ceiling of−2.3.

<details>
<summary>Answers and reasoning</summary>

1. Seventeen: 3, 2, 4. Fifteen: 3, 0, 3. Zero: 0, 0, 0.
2. Ordinary division returns 4.2; use integer division and add one if a remainder exists.
3. Both throw `InvalidArgumentException` instead of returning counts.
4. Hour 4; floor−3 and ceiling−2.

</details>

## Summary and references

Decide whether you need a quotient, remainder, approximation, or sufficient capacity. Continue to [logic and decisions](/en/programming-basics/math-problem-solving/02-variables-equations-logic/).

Execution references: [PHP arithmetic](https://www.php.net/manual/en/language.operators.arithmetic.php), [intdiv](https://www.php.net/manual/en/function.intdiv.php), and [floating-point precision](https://www.php.net/manual/en/language.types.float.php).
