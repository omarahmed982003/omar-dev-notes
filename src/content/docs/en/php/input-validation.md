---
title: "Input validation: turn external data into trusted values"
prev: {"link":"/en/php/12-arrays-functional-tools/","label":"Arrays and transformation tools"}
next: {"link":"/en/php/13-strings-unicode-regex/","label":"Strings and Unicode"}
description: "Input validation: turn external data into trusted values"
sidebar:
  order: 6.7
---

## A number-looking string is not enough

Prerequisites: strings, booleans, conditions, and operators. Validation checks application rules. Parsing interprets a format; casting requests a type conversion but does not prove the whole input is valid. Normalization is an agreed transformation, not unrestricted rewriting.

## Define the contract

Allow string or int quantities from 0 to 100. Keep '0'; reject null, false, arrays, and emptiness. The following function is explained fully in [functions](/en/php/07-functions-and-includes/); trace each case as a decision first.

~~~php
<?php
function quantity(mixed $raw): ?int
{
    if (!is_string($raw) && !is_int($raw)) {
        return null;
    }
    $value = filter_var($raw, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 0, 'max_range' => 100],
    ]);
    return $value === false ? null : $value;
}
foreach (['0', '100', '101', '12x', null, false, []] as $raw) {
    echo json_encode($raw), ' => ', quantity($raw) ?? 'invalid', PHP_EOL;
}
~~~

Results are 0 and 100 followed by invalid for the remaining cases. Strict comparison preserves zero. A valid int can still violate a domain range.

## Missing and invalid differ

Only a missing value may use a documented default. Do not silently replace an explicitly invalid value. Validation differs from HTML encoding and authorization: a valid booking ID does not prove ownership.

## Independent exercise

Allow duration 100..60000. Only absence defaults to 5000; reject '0', emptiness, an array, and overflow.

<details><summary>Review the decision</summary>

Separate absence from validation. Do not use ?: for a default because it also replaces '0'. Test 99, 100, 60000, 60001.

</details>

## Summary

The contract defines accepted input and outcomes. Parsing, casting, validation, encoding, and authorization are distinct. [Numeric strings](https://www.php.net/manual/en/language.types.numeric-strings.php).


