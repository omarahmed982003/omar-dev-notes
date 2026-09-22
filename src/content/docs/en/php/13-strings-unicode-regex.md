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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Strings, Unicode, and regular expressions">
<p class="lesson-diagram-title">Concept map: Strings, Unicode, and regular expressions</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>PHP strings are bytes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Graphemes and normalization</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Contextual output</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Regular expressions</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “PHP strings are bytes” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Use UTF-8 consistently across HTTP, PHP, and the database. Prefer mb_strlen, mb_substr, and mb_strtolower for multilingual text. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “PHP strings are bytes” with “Graphemes and normalization”. Why does neither replace the other in “Strings, Unicode, and regular expressions”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “PHP strings are bytes”: Use UTF-8 consistently across HTTP, PHP, and the database. Prefer mb_strlen, mb_substr, and mb_strtolower for multilingual text. For “Graphemes and normalization”: A visible symbol may contain multiple code points. The intl extension provides grapheme functions and Normalizer: Normalize for a clear purpose such as search or uniqueness. Preserve original text when required; case folding is language-sensitive. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Contextual output”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Use interpolation or sprintf for display, never SQL. Compare secret values with hash_equals() where timing-safe equality matters. Use htmlspecialchars for HTML text and rawurlencode for URL parameters. No universal sanitization function works for every context. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Regular expressions” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Use explicit anchors, inspect preg_last_error_msg(), limit input size before complex patterns, avoid catastrophic backtracking, and choose a real parser for HTML or JSON. Pattern validity is not business validity. Apply domain rules after matching the shape. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
