---
title: 13. Strings, Unicode, and regular expressions
description: Bytes, UTF-8, mbstring, normalization, contextual encoding, and safe regular expressions.
sidebar:
  order: 13
---

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

