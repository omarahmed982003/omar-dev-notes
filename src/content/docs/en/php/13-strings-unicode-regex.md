---
title: 13. Strings, Unicode, and regular expressions
description: Bytes, UTF-8, mbstring, normalization, contextual encoding, and safe regular expressions.
sidebar:
  order: 13
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **URL:** The complete address of a resource such as a page or API endpoint.
- **Unicode:** A standard that assigns consistent numbers to characters and symbols.
- **UTF-8:** A common encoding that stores Unicode numbers as bytes.
- **Function:** A named, reusable block of code with one defined job.


## A visible character is not necessarily one byte

A PHP string is bytes. Basic English can hide this fact because ASCII characters use one byte, while Arabic characters usually use multiple UTF-8 bytes and one user-visible symbol may contain several Unicode code points.

```php
$text = 'عمر';

echo strlen($text), PHP_EOL;    // bytes
echo mb_strlen($text), PHP_EOL; // characters under the encoding
```

Therefore `strlen()` and `$text[0]` are not general Unicode text operations. Use `mb_*`, and use suitable `intl` grapheme functions when user-visible clusters matter.

```text
Bytes → UTF-8 decoding → Code points → Grapheme clusters → Display
```

A regular expression is a small language that describes a pattern, not magic search. Start small, anchor a pattern when the entire value must match, and enable Unicode mode with `u` for UTF-8 text. Do not parse full HTML or a complex formal language with regex when a maintained parser exists.

## PHP strings are bytes

```php
$text = 'مرحبًا';
echo strlen($text);              // bytes
echo mb_strlen($text, 'UTF-8');  // characters, approximately
```

Use UTF-8 consistently across HTTP, PHP, and the database. Prefer `mb_strlen`, `mb_substr`, and `mb_strtolower` for multilingual text.

## Graphemes and normalization

A visible symbol may contain multiple code points. The `intl` extension provides grapheme functions and `Normalizer`:

```php
$normalized = Normalizer::normalize($input, Normalizer::FORM_C);
```

Normalize for a clear purpose such as search or uniqueness. Preserve original text when required; case folding is language-sensitive.

## Contextual output

- Use interpolation or `sprintf` for display, never SQL.
- Compare secret values with `hash_equals()` where timing-safe equality matters.
- Use `htmlspecialchars` for HTML text and `rawurlencode` for URL parameters.
- No universal sanitization function works for every context.

## Regular expressions

```php
$ok = preg_match('/\A[A-Z]{2}-\d{6}\z/D', $code) === 1;
```

Use explicit anchors, inspect `preg_last_error_msg()`, limit input size before complex patterns, avoid catastrophic backtracking, and choose a real parser for HTML or JSON.

Pattern validity is not business validity. Apply domain rules after matching the shape.

## Progressive practice

<details><summary>1. Why is strlen not a user-visible Arabic length?</summary><p>It counts bytes. Use <code>mb_strlen()</code> for characters or grapheme functions when one visible symbol can contain several code points.</p></details>

<details><summary>2. Match a complete order ID such as ORD-1234</summary><p>Use full-input anchors and exactly four digits, then test valid input, extra prefixes, and trailing newlines.</p></details>

<details><summary>3. Why cap input length before an expensive regex?</summary><p>To prevent excessive CPU or memory use from huge input or pathological backtracking.</p></details>

## Lesson-specific problems

<details><summary>Why can <code>strlen</code> miscount visible characters?</summary><p>It counts bytes, while one UTF-8 character may use several; use mbstring or grapheme-aware tools as needed.</p></details>

<details><summary>Why is regex risky on long untrusted input?</summary><p>A poor pattern can trigger expensive backtracking; bound input, design carefully, and test adversarial cases.</p></details>

## Run and verify

The file distinguishes bytes/code points for ASCII, Arabic, and emoji and rejects a trailing newline in amounts. Performance testing another regex requires input bounds and separate measurement.

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php text-lab.php
~~~

**Extended integration exercise target:** ASCII, Arabic, and emoji cases pass using the appropriate length semantics; a catastrophic regex is bounded or redesigned.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Inspect <code>preg_*</code> errors and backtracking limits; do not accept a regex that can stall on attacker input. Normalize Unicode before identifier comparison when the domain requires it while preserving display data. Escaping is contextual across HTML text, attributes, URLs, and JavaScript.

### Try it yourself

Test a regex against long adversarial input and compare time with the normal case.
