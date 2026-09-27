---
title: "Division, remainders, and numerical precision"
description: "Division, remainders, and numerical precision"
sidebar:
  order: 2
prev: {"link":"/en/programming-basics/math-problem-solving/01-arithmetic-foundations/","label":"Ratios, averages, and powers"}
next: {"link":"/en/programming-basics/math-problem-solving/02-variables-equations-logic/","label":"Variables, equations, and Boolean logic"}
---

You have 10 items and boxes holding 3. Three boxes are insufficient: all items need four. If you ask only for full boxes, the answer is three with one remaining. The question determines the division operation.

## Calculate before naming

`floor(10/3)=3` chooses the greatest integer no larger than the value; `ceil(10/3)=4` chooses the least integer no smaller. For −2.3, floor is −3 and ceiling −2: locate them on a number line.

Grouping 12 and 18 items equally without leftovers allows a largest group size of 6: **GCD, Greatest Common Divisor**. Bells ringing every 4 and 6 minutes first coincide again at 12: **LCM, Least Common Multiple**, for these positive integers.

**Try:** 17 items in size-5 boxes: full boxes, remainder, and boxes for everything are 3, 2, and 4. Explain each before studying the rules.


## Integer division, number theory, and precision

Integer division returns an integer quotient; negative-value rounding depends on the language, as the worked examples below show. For positive integers, `(count + size - 1) / size` computes ceiling division. Euclid's algorithm repeatedly replaces `(a, b)` with `(b, a % b)` to find the GCD (Greatest Common Divisor, the largest common divisor); the LCM (Least Common Multiple, the least common multiple under the stated zero convention) can then be derived carefully without overflowing intermediate values.

Modular arithmetic models cycles such as clocks and parity. Floating-point results are approximate, so comparisons may require a tolerance chosen for the problem's scale.

## Calculate instead of memorizing names

A **power** is repeated multiplication: 2³=8. The nonnegative **square root** of 25 is 5. For 2,4,9, the mean is 15/3=5 and the median is 4. An empty-list mean needs a policy instead of division by zero.

17 divided by 5 has remainder 2 because 17=3×5+2. Many languages use %. Integer division of negatives differs: C++ -7/3 truncates toward zero to -2; Python -7//3 floors to -3. JavaScript 7/3 is ordinary division. Specify the language.

Ten items in groups of three require four groups. The ceiling-division formula (count+size−1)/size requires integer division, nonnegative count, positive size, and no intermediate overflow. Zero items need zero groups; zero group size is invalid.

For **GCD**, 48%18=12, 18%12=6, 12%6=0, so the greatest common divisor is 6. **LCM** is 48/6×18=144. Under the common programming convention, return zero if either argument is zero, handling (0,0) before division. abs means absolute value.

**Worked check:** Five hours after hour 23 is (23+5)%24=4. This is modular arithmetic. **Tolerance** is a domain-appropriate permitted numerical difference; **overflow** exceeds a type's range and is not fixed by an approximation tolerance.
