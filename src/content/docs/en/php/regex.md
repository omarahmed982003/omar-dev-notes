---
title: "Regex: validate a string shape"
prev: {"link":"/en/php/13-strings-unicode-regex/","label":"Strings and Unicode"}
next: {"link":"/en/php/cli-expenses-project/","label":"CLI project: expenses before the web"}
description: "Regex: validate a string shape"
sidebar:
  order: 13.5
---

Requires strings, conditions, and functions. Regex describes a text pattern, not whether a record exists or the caller may access it. A pattern describes the required shape; a match means the text satisfies it. PCRE is the regex-engine family PHP uses; a parser understands a structured format such as JSON. Valid UTF-8 can still violate the required code format.

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


## Independent exercise

Test ORD-0042, ORD-42, XORD-0042, and ORD-0042 with a trailing newline. Predict from the pattern.

<details><summary>Review after trying</summary>

Trace the anchors and fixed length. preg_match returning 0 means no match; false means pattern execution failure.

</details>

## Predict and diagnose

<details><summary>Complete a regex accepting exactly AB-123456</summary><p><code>/\A[A-Z]{2}-[0-9]{6}\z/</code>. Test extra prefixes and a trailing newline, then separately check whether the country code is allowed.</p></details>

<details><summary>preg_match returned false. Is that simply no match?</summary><p>No: zero means no match. False indicates a pattern, encoding, or engine-limit error. Inspect preg_last_error_msg and handle it at the application boundary.</p></details>

[Return to the PHP guide](/en/php/).

