---
title: 4. XSS protection
description: Reflected, stored, and DOM XSS with context-aware output encoding.
sidebar:
  order: 4
---

XSS occurs when untrusted data is interpreted as browser code. It may be reflected in one response, stored for later victims, or introduced by DOM code using a dangerous sink.

```php
function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
```

Use this for HTML text and quoted safe attributes. For a URL query value, apply `rawurlencode` first and HTML-encode the final attribute. Encoding does not make a `javascript:` scheme safe; validate protocols and hosts.

Prefer JSON rather than string concatenation for JavaScript data, with `JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT`. In DOM code, prefer `textContent` over `innerHTML`.

If users must author HTML, use a maintained allow-list sanitizer; regex is not an HTML parser. Avoid untrusted data in scripts, styles, comments, tag/attribute names, and event handlers.

Template auto-escaping, CSP, Trusted Types, secure cookies, and correct MIME types provide defense in depth. CSP is not a substitute for encoding and sanitization.
