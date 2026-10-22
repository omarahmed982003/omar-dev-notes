---
title: "Representing numbers and characters in memory"
description: "Representing numbers and characters in memory"
tableOfContents: true
sidebar:
  order: 5
prev: {"link":"/en/programming-basics/computer-in-depth/04-cpu-gpu/","label":"How a processor executes instructions"}
next: {"link":"/en/programming-basics/computer-fundamentals/18-media-and-units/","label":"Images, audio, video, and size units"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## What will you understand?

Why can two programs interpret the same bytes as a number and as text? A **representation** is how a value is written; an **interpretation** is the agreement that gives that representation meaning.

You only need small additions and multiplications. On the first pass, focus on bits/bytes, binary/hex, and Unicode versus UTF-8. A foundation check and exit point follow; signed values, fractional precision, and byte order are optional depth. PHP experiments wait until the language environment is ready.

## Bits and bytes

A **bit** is a position with two possible values: 0 and 1. Eight bits form a **byte**, with 256 possible patterns because each position doubles the number of combinations.

A pattern alone does not identify its meaning. It could belong to an image, a number, or a character depending on the file format and the programs' agreement.

### Binary: why 101 can mean five

**Binary** is base two. From right to left, place values are 1, 2, 4, 8, and so on. Thus `101₂ = 1×4 + 0×2 + 1×1 = 5`. The small ₂ identifies the base.

Similarly, `45 = 32 + 8 + 4 + 1`, giving `101101₂`. The value stays the same; its written representation changes.

### Hexadecimal: a shorter representation

**Hexadecimal**, or **hex**, uses base sixteen: digits 0–9 followed by A–F for values 10–15. Each hex digit corresponds to exactly four bits.

`FA₁₆ = 15×16 + 10 = 250`, or `1111 1010` in binary. The prefix `0x` commonly identifies hex, as in `0xFA`.

Hex appears in memory addresses, colors, and binary-file inspection.

## Unicode is not UTF-8

**Unicode** assigns agreed numbers to symbols. A **code point** is one such number: the Arabic letter “ع” is `U+0639`, with hexadecimal digits after U+.

An **encoding** maps those numbers to bytes. **UTF-8** is a common Unicode encoding using one to four bytes per code point.

Basic Latin letters usually take one byte, while “ع” takes two: `D8 B9`. One visible character need not be one code point: a letter with a combining mark, or some emoji, can contain several.

A **grapheme cluster** groups code points treated as one visible unit. Byte count, code-point count, and visible-unit count therefore answer different questions.

### A no-code text experiment

Save two new text files in a practice folder: one containing `A`, the other `ع`. Select UTF-8 without a final newline or **BOM**, an optional encoding-identification mark at the beginning, if your editor supports these options.

The text payload should occupy one byte versus two. If the file is larger, inspect newlines, the initial mark, and the encoding before blaming the calculation. Allocated disk space can differ from the file's data length.

### Optional PHP experiment

PHP runs the language examples here. After configuring PHP, save a new file named `text-bytes.php`. `echo` displays results, `strlen` counts string bytes, `bin2hex` renders bytes as hex, and `PHP_EOL` supplies the platform line ending.

```php
<?php
echo strlen('A'), PHP_EOL;
echo strlen('ع'), PHP_EOL;
echo bin2hex('ع'), PHP_EOL;
```

Run `php text-bytes.php`. With UTF-8 source, expect:

```text
1
2
d8b9
```

This does not count visible characters. Cutting Arabic text at an arbitrary byte offset can split a UTF-8 sequence and produce invalid text.

## Pause: check the first-pass foundation

1. Represent thirteen in binary, then convert it back.
2. Do ten text bytes prove there are ten visible characters?
3. What decimal value does hex F represent, and how many bits correspond to one hex digit?
4. Why does renaming arbitrary data to .txt not turn it into valid text?

<details>
<summary>Review the foundation after attempting</summary>

1. `1101₂ = 8 + 4 + 1 = 13`.
2. No: encoding, combining marks, and symbol composition affect the relationship.
3. F means fifteen; one hex digit corresponds to four bits.
4. The extension helps choose a reader; it does not rewrite data into a text encoding.

</details>

If you can explain these answers and the A/“ع” experiment, continue to [images, audio, and video](/en/programming-basics/computer-fundamentals/18-media-and-units/). Mastering the calculations below is not required before a first program.

## Optional depth: choose a representation topic

Each folded topic explores important cases and has its own exercise. Open one when studying numbers or binary files, or return after the foundation.

<details>
<summary>Signed values, overflow, and bit masks</summary>

### Integers: one pattern, different interpretations

**Unsigned** represents nonnegative integers. An eight-bit model has a range of 0–255.

**Signed** permits negative values. A common representation called **two's complement** gives an eight-bit range of -128 through 127.

To represent -5, write 5 as `00000101`, invert the bits to `11111010`, then add one to obtain `11111011`. The same pattern means 251 when interpreted as unsigned.

**Overflow** occurs when a result exceeds a type's range. Behavior depends on the language and type: fixed-width unsigned types in languages such as C++ wrap, but signed overflow in C++ is not guaranteed wrapping. This model does not imply that a PHP integer has eight bits.

A **bit mask** selects particular bits, such as checking a nonnegative integer's last bit for parity.

#### Check the pattern's interpretation

How can `11111011` represent both -5 and 251? Does this eight-bit model specify every PHP integer's size?

<details>
<summary>Review the integer interpretation</summary>

Signed two's-complement interpretation gives -5; unsigned interpretation gives 251. The bits are unchanged. Eight bits is a teaching model, not a universal size or overflow rule for other languages and types.

</details>

</details>

<details>
<summary>Fractional precision: display versus exact value</summary>

### Fractions and finite precision

**Floating point** commonly represents fractions using a sign, an exponent, and a significand. The exponent scales the number; the significand limits precision. **IEEE 754** specifies common floating-point representations and operations.

Just as one third has no finite decimal expansion, 0.1 has no finite binary expansion. Computation usually uses finite approximations rather than exact mathematical fractions.

In PHP, `printf` formats output and `%.17f` requests seventeen fractional digits. Displaying enough digits can expose the approximation:

```php
<?php
printf("%.17f\n", 0.1 + 0.2);
```

A common result with binary double precision is `0.30000000000000004`; default formatting may hide it.

Do not choose an arbitrary tolerance to hide an unexplained error. Choose precision and rounding for the domain. Money may require integer minor units or decimal arithmetic with explicit conversion and rounding rules.

#### Independent precision exercise

1. A display shows `0.3` after `0.1 + 0.2`. Does that prove storage of an exact mathematical fraction? How would you inspect formatting's effect?
2. A price convention uses integer cents: 30 and 20. What is their sum, and what unit must remain explicit when converting to the major currency unit?

<details>
<summary>Review precision and units</summary>

1. No. Formatting may round or hide digits. The printf example asks for more digits, but remains finite formatting rather than general proof that every calculation is exact.
2. Fifty cents, or 0.50 major units under a 100-cents-per-unit agreement. This avoids some fractional-representation errors in addition, but division or tax producing fractions of a cent still needs a rounding policy.

</details>

</details>

<details>
<summary>Byte order when reading a multibyte integer</summary>

### Endianness: ordering bytes

**Endianness** defines the order of bytes in a multibyte value. It does not reverse the bits inside each byte.

For the two-byte value `0x1234`, the following 12 and 34 are hex byte values, not decimal numbers: **big-endian** stores 12 then 34 from the lowest address; **little-endian** stores 34 then 12. Readers of binary files and cross-system messages must agree on the order.

The bytes `35 00` mean 53 as a sixteen-bit little-endian integer. The first byte alone represents “5” in UTF-8. Meaning requires a type, order, and encoding.

When combining two unsigned bytes, the higher byte has weight 256 and the lower weight 1. For example, `0x0102 = 1 × 256 + 2 = 258`. The ordering agreement determines where the higher byte is stored.

#### Independent ordering exercise

Two bytes, listed from the lowest address, are `01 02`. Assume an unsigned sixteen-bit number.

1. Calculate its value using big-endian, then little-endian.
2. If a reader uses the wrong ordering, must the file's bytes have changed?

<details>
<summary>Review byte-order calculations</summary>

1. Big-endian: `1 × 256 + 2 = 258`. Little-endian: `2 × 256 + 1 = 513`.
2. No. Interpretation can change while stored bytes remain identical. Byte ordering does not reverse the bits inside each byte.

</details>

</details>

## Summary

Separate values from representations, and bytes from the agreement that interprets them. A size unit is not a data type, and UTF-8 is not a programming language.

Next: [images, audio, video, and size units](/en/programming-basics/computer-fundamentals/18-media-and-units/).

## Further reading

- [Unicode: encodings and BOM](https://www.unicode.org/faq/utf_bom.html)
- [PHP: strlen counts bytes](https://www.php.net/manual/en/function.strlen.php)
- [PHP: floating-point precision](https://www.php.net/manual/en/language.types.float.php)
