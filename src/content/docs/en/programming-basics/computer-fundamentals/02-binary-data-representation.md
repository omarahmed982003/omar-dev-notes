---
title: "How computers represent numbers and text"
description: "How computers represent numbers and text"
sidebar:
  order: 6
prev: {"link":"/en/programming-basics/computer-fundamentals/02-computers-data-processing/","label":"How a computer turns input into a result"}
next: {"link":"/en/programming-basics/computer-fundamentals/18-media-and-units/","label":"Images, sound, and size units"}
---

Typing 5 into a calculator shows a familiar symbol. Inside a computer, data has a representation that circuits can handle. We will write decimal 5 as binary 101, check the conversion, and distinguish a number from the text character "5". You only need addition of small numbers. A **representation** is a way of expressing information; changing it does not change the numerical value.

## Why zero and one?

Electronic circuits distinguish two states within defined limits, such as low and high voltage, which we label 0 and 1. A **bit** is one such binary position. The digits are not tiny written characters inside a wire, and zero does not necessarily mean no electricity. Memory, storage, and networks can represent bits physically in different ways.

Eight bits form a **byte**. Patterns of bits can represent numbers, text, instructions, or pictures. An agreed interpretation is necessary: bits alone do not announce that they are a picture.

## Start with decimal place values

**Decimal** uses ten digits, 0 through 9:

```text
245 = 2 × 100 + 4 × 10 + 5 × 1
```

Moving one place left multiplies the place value by ten. **Binary** uses only two digits, so place values double instead:

| Position, left to right | First | Second | Third | Fourth |
|---|---:|---:|---:|---:|
| Weight contributed by a 1 | 8 | 4 | 2 | 1 |

A zero contributes nothing. The smallest weight is on the right.

## Convert 5 to 101

1. The largest weight no greater than 5 is 4. Use it; 1 remains.
2. The next weight, 2, is greater than the remainder. Do not use it.
3. Use the final weight, 1.

| Weight | 4 | 2 | 1 |
|---|---:|---:|---:|
| Used? | Yes | No | Yes |
| Bit | 1 | 0 | 1 |

Therefore **decimal 5 = binary 101** because `1×4 + 0×2 + 1×1 = 5`. Do not read binary 101 as decimal one hundred and one. The notation `101₂ = 5₁₀` uses small subscripts to identify the base.

In a full byte, write `00000101`. Leading zeroes do not change an unsigned value. A trailing zero does: `1010₂ = 10₁₀`.

**Pause:** represent6 with weights4,2,1 before opening the answer.

<details><summary>Answer</summary>6=4+2, so110. Zero says the weight1 is unused.</details>

## Another method: divide by two

Split a nonnegative integer into groups of two. The number of complete groups is the **integer quotient**; anything left is the **remainder**. For example, 5 contains two complete groups and leaves 1. Repeat using the quotient, then read the remainders from bottom to top.

| Division | Integer quotient | Remainder |
|---|---:|---:|
| 5 ÷ 2 | 2 | 1 |
| 2 ÷ 2 | 1 | 0 |
| 1 ÷ 2 | 0 | 1 |

Reading upward gives 101. Stop when the quotient reaches zero. Zero itself is written 0, or 00000000 in a byte. Negative numbers and fractions need additional representation rules.

## Convert back to decimal

```text
Weights:  32  16   8   4   2   1
Bits:      1   0   1   1   0   1

101101₂ = 32 + 8 + 4 + 1 = 45₁₀
```

Counting in binary starts `0, 1, 10, 11, 100, 101`, corresponding to decimal 0 through 5. After 1, carry to the next position, just as decimal counting carries after 9.

## How many values fit in a byte?

Two bits have four patterns: 00, 01, 10, 11. Eight bits have `2×2×2×2×2×2×2×2 = 256` patterns. The notation `2⁸` means multiplying eight factors of two.

An **unsigned** one-byte integer uses those patterns for 0 through 255. Zero counts as one of the 256 values. Decimal 256 needs nine bits: 100000000. A **signed** integer uses an agreement that includes negative values. The same byte cannot simultaneously mean both an unsigned value in 0–255 and a signed value in -128–127. See [the deeper representation lesson](/en/programming-basics/computer-in-depth/03-binary-languages-algorithms/) for signed numbers and fractions.

**Try:** three bits give2×2×2=8 patterns, representing0–7 unsigned. List them before moving to text.

## The number 5 versus the text character "5"

An **encoding** is an agreement for representing symbols. **Unicode** assigns numbers to characters; **UTF-8 (Unicode Transformation Format with 8-bit units)** is a common way to encode those numbers as bytes.

| Information and interpretation | Example byte | Meaning |
|---|---|---|
| Number 5 as an unsigned byte | `00000101` | Numerical value 5 |
| Text character "5" in UTF-8 | `00110101` | Character number 53, displayed as 5 |
| Letter A in UTF-8 | `01000001` | Character number 65, displayed as A |

This does not mean every variable containing 5 occupies one byte. Actual storage depends on its language and data type.

### An Arabic character and hexadecimal bytes

The Arabic letter ع has Unicode number `U+0639`; U+ introduces a character number. UTF-8 stores it as two bytes, `D8 B9`. This is **hexadecimal**, a compact notation using digits 0–9 and A–F for values 10–15. Each hexadecimal digit represents four bits: D8 is 11011000, and B9 is 10111001.

Visible character count need not equal byte count. A single visible symbol can also contain multiple Unicode numbers. Renaming a file extension does not convert its encoding.

**Try:** A uses one byte and ع two. Text Aع uses three UTF-8 bytes, excluding extra file data, while these two code points are two characters here. Encoding does not promise one byte per character.

## Worked practice

<details><summary>Convert 13 to binary and check it.</summary><p>13=8+4+1, so weights 8,4,2,1 contain 1,1,0,1: 1101. The reverse check is 8+4+0+1=13.</p></details>
<details><summary>What is binary 10010? Does adding a leading zero change it?</summary><p>16+2=18. A leading zero does not change this unsigned interpretation.</p></details>
<details><summary>Why does unsigned 300 not fit in one byte?</summary><p>The maximum is 255. 300=256+32+8+4 requires nine bits: 100101100. Use a wider representation rather than dropping the extra bit.</p></details>
<details><summary>Does a text file containing 5 necessarily contain byte 00000101?</summary><p>No. In UTF-8, the character 5 is 00110101. Meaning depends on the interpretation.</p></details>

Build a table for decimal 0 through 7. The answers are `000, 001, 010, 011, 100, 101, 110, 111`. Check any disagreement by adding weights where the bit is 1.

Next, [computer components](/en/programming-basics/computer-fundamentals/03-hardware-architecture/) explains which parts process and store these representations.

## Next step

After completing this practice, continue with [Images, sound, and size units](/en/programming-basics/computer-fundamentals/18-media-and-units/).
