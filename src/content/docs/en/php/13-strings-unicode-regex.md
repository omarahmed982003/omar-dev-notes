---
title: 13. Strings, Unicode, and regular expressions
description: Bytes, UTF-8, mbstring, normalization, contextual encoding, and safe regular expressions.
sidebar:
  order: 13
---

## The problem: a three-letter name has strlen six

A PHP `string` is a sequence of **bytes**, each an 8-bit storage unit. **Unicode** assigns numbers called **code points** to characters. **UTF-8** encodes a code point using 1–4 bytes. A **grapheme cluster** combines code points that a user usually perceives as one character. These are different measurements; choose according to the question.

For example, عمر has three code points and six bytes. An e followed by a separate accent appears as one character but has two code points. A family emoji combines several symbols and invisible joiners. This lesson needs PHP 8.1+ with `mbstring` and `intl`; check `php -m`.

## Compare all three units in one program

Save `unicode.php` as UTF-8 and run `php unicode.php`:

~~~php
<?php
declare(strict_types=1);

$samples = [
    'ASCII' => 'Omar',
    'Arabic' => 'عمر',
    'accent' => "e\u{0301}",
    'family' => "👨‍👩‍👧‍👦",
];
foreach ($samples as $label => $text) {
    if (!mb_check_encoding($text, 'UTF-8')) {
        throw new InvalidArgumentException('Invalid UTF-8');
    }
    printf("%s: bytes=%d points=%d graphemes=%d\n",
        $label, strlen($text), mb_strlen($text, 'UTF-8'), grapheme_strlen($text));
}
$text = 'عمر';
echo 'first byte=', bin2hex($text[0]), PHP_EOL;
echo 'first point=', mb_substr($text, 0, 1, 'UTF-8'), PHP_EOL;
~~~

~~~text
ASCII: bytes=4 points=4 graphemes=4
Arabic: bytes=6 points=3 graphemes=3
accent: bytes=3 points=2 graphemes=1
family: bytes=25 points=7 graphemes=1
first byte=d8
first point=ع
~~~

`\u{0301}` inserts the accent code point in a double-quoted string. `mb_check_encoding` verifies that the bytes form valid UTF-8 before interpretation. `strlen` suits file/request sizes, `mb_strlen` counts code points, and `grapheme_strlen` counts clusters according to the installed Unicode/ICU rules. Newer symbols can depend on ICU version; these examples use established characters.

`$text[0]` is the single byte d8, an incomplete part of ع. `substr` can also cut through a UTF-8 sequence. `mb_substr` cuts by code points but can separate a combining accent; `grapheme_substr` better fits visible-character limits. Grapheme limits alone do not bound request size because one cluster can contain many marks; bound bytes too.

## Two representations of one character: normalization

**Normalization** standardizes equivalent Unicode representations under a chosen rule. NFC favors composed forms where available. Save `normalize.php`:

~~~php
<?php
$composed = "\u{00E9}";
$decomposed = "e\u{0301}";
var_dump($composed === $decomposed);
$normalized = Normalizer::normalize($decomposed, Normalizer::FORM_C);
if ($normalized === false) {
    throw new RuntimeException('Normalization failed');
}
var_dump($composed === $normalized);
echo strlen($decomposed), ' -> ', strlen($normalized), PHP_EOL;
~~~

~~~text
bool(false)
bool(true)
3 -> 2
~~~

The first comparison sees different bytes despite matching appearance. NFC makes this pair identical. Normalization does not equate every visually similar character and does not repair XSS. Define identifier/search policy before normalizing and retain original text for display when needed. Never silently normalize or alter passwords. `mb_strtolower` is more suitable than strtolower for multilingual case conversion, but case folding and linguistic ordering have additional rules; intl's `Collator` supports locale-aware sorting.

## Regex describes a small pattern, not every language

A **regular expression** describes text shape. Start with a length bound and a simple pattern. `\A` anchors the actual start, `\z` the actual end, `[0-9]` an ASCII digit, and `{4}` four repetitions. `(?<id>...)` names a captured group. A `u` modifier enables UTF-8 mode; it does not automatically implement business rules.

`code.php` accepts ORD followed by exactly four digits:

~~~php
<?php
function orderId(string $input): ?string
{
    if (strlen($input) > 32) {
        return null;
    }
    $matched = preg_match('/\AORD-(?<id>[0-9]{4})\z/u', $input, $matches);
    if ($matched === false) {
        throw new RuntimeException(preg_last_error_msg());
    }
    return $matched === 1 ? $matches['id'] : null;
}
foreach (['ORD-1234', 'xORD-1234', "ORD-1234\n", 'ORD-0000'] as $input) {
    echo json_encode($input), ' => ', orderId($input) ?? 'invalid', PHP_EOL;
}
~~~

~~~text
"ORD-1234" => 1234
"xORD-1234" => invalid
"ORD-1234\n" => invalid
"ORD-0000" => 0000
~~~

The function returns a string, preserving leading zeros. A pre-engine length check bounds work. `preg_match` returns 1 for match, 0 for no match, false for failure; do not merge 0 and false. Read captures only after a match. Accepting 0000 structurally does not prove an order exists; that needs a separate data check.

**Mistake:** `/^ORD-[0-9]{4}$/` can match before a final newline. `\z` enforces the actual end. Patterns such as `(a+)+` can cause expensive **backtracking**, where the engine tries many partitions near failure. Simplify the pattern, bound input length, and check PCRE errors. Do not freely execute untrusted user patterns. JSON and HTML have parsers; regex is not a universal substitute.

## Encode for the destination context

**Validation** decides whether data is allowed. **Encoding** makes it text in the output context rather than instructions. No universal sanitization function exists. Save `escaping.php`:

~~~php
<?php
$name = '<Omar & Mona>';
echo htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'), PHP_EOL;
echo '/search?q=', rawurlencode($name), PHP_EOL;
echo json_encode(['name' => $name], JSON_THROW_ON_ERROR), PHP_EOL;
~~~

~~~text
&lt;Omar &amp; Mona&gt;
/search?q=%3COmar%20%26%20Mona%3E
{"name":"<Omar & Mona>"}
~~~

HTML text/quoted attributes need htmlspecialchars; a URL parameter needs rawurlencode or http_build_query. A URL inside an HTML attribute needs HTML encoding after URL construction. JavaScript is another context: prefer a separate JSON response or safe embedding mechanism, not concatenation. `sprintf`/interpolation serve presentation, not SQL construction. Compare fixed-length secrets such as CSRF tokens with `hash_equals`; that is a different purpose from ordinary user-text comparison.

## Predict, debug, complete

<details><summary>Predict measurements for e followed by U+0301</summary><p>3 bytes, 2 code points, 1 grapheme. ASCII e uses one byte and the accent two; rendering combines them.</p></details>

<details><summary>Debug cutting Arabic with substr($name, 0, 1)</summary><p>It takes one byte and may create invalid UTF-8. Use mb_substr for code points or grapheme_substr for perceived characters, according to the contract.</p></details>

<details><summary>Complete a regex accepting exactly AB-123456</summary><p><code>/\A[A-Z]{2}-[0-9]{6}\z/</code>. Test extra prefixes and a trailing newline, then separately check whether the country code is allowed.</p></details>

<details><summary>preg_match returned false. Is that simply no match?</summary><p>No: zero means no match. False indicates a pattern, encoding, or engine-limit error. Inspect preg_last_error_msg and handle it at the application boundary.</p></details>

Run `php text-lab.php` in the [lab](/en/php/00-lab-setup/). The notebook bounds bytes and code points, validates UTF-8, and encodes on output. See the [grapheme reference](https://www.php.net/manual/en/function.grapheme-strlen.php).
