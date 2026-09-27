---
title: 2. Input validation
description: Validation vs sanitization, PHP filters, domain rules, and output encoding boundaries.
sidebar:
  order: 2
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **URL:** The complete address of a resource such as a page or API endpoint.


## Beginner bridge

Validation answers whether input belongs to the business domain, not whether it looks harmless. Parse into the intended type, reject impossible ranges and unsupported states, and keep the original untrusted value away from decisions until that process succeeds.

Validation does not replace output encoding, prepared statements, or authorization. Each control belongs at a different boundary: validation defines acceptable data, encoding prevents a rendering context from treating data as code, and authorization decides whether the caller may perform the action.

Validation checks whether data satisfies rules without changing it. Normalization standardizes legitimate representation. Sanitization removes/changes characters and may silently corrupt meaning. Output encoding belongs at the exact HTML/URL/JS sink.

```php
$email = filter_var($rawEmail, FILTER_VALIDATE_EMAIL);
if ($email === false) {
    throw new InvalidArgumentException('Invalid email');
}

$age = filter_var($rawAge, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 18, 'max_range' => 120],
]);
if ($age === false) {
    throw new InvalidArgumentException('Invalid age');
}
```

Use `=== false` because zero can be valid. `FILTER_DEFAULT` is `FILTER_UNSAFE_RAW`; it is not automatic safety.

```php
$page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, [
    'options' => ['default' => 1, 'min_range' => 1],
]);
```

Shape validation is insufficient: a valid order ID does not prove ownership. Validate type/range, then authorize the current user against the loaded resource. Use allow-lists for enums, sort fields, and identifiers; prepared SQL and context-aware output encoding remain separate controls.

## Security scenario

<details><summary>Does input validation replace output encoding?</summary><p>No. Validation enforces an input contract; context-specific encoding prevents data from becoming code.</p></details>

## Threat drill

**Scenario:** A client submits a value that looks numeric but is out of range or carries extra characters to bypass a shallow check.

**Negative test:** Try a negative value, an over-limit value, and <code>12x</code> in the same field.

**Expected result:** All three inputs are rejected consistently, and none reaches business logic or the database.

### Verification source

- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## Connect the ideas

Canonicalize before validation when multiple representations exist, but never decode indefinitely. Validate nested arrays for depth, count, and size, not only scalar fields. For files, inspect upload status, size, signature/MIME, and content, using allowlists for known values.

### Try it yourself

Test double encoding, deeply nested input, and a file whose name conflicts with its content.
