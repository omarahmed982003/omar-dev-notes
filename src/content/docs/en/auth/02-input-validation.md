---
title: 2. Input validation
description: Validation vs sanitization, PHP filters, domain rules, and output encoding boundaries.
sidebar:
  order: 2
---

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
