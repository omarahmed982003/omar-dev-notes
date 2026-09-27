---
title: 4. XSS protection
description: Reflected, stored, and DOM XSS with context-aware output encoding.
sidebar:
  order: 4
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Sanitizer:** An HTML sanitizer parses untrusted markup and removes disallowed elements and attributes while preserving permitted formatting.
- **URL:** The complete address of a resource such as a page or API endpoint.
- **UTF-8:** A common encoding that stores Unicode numbers as bytes.
- **Function:** A named, reusable block of code with one defined job.


## Beginner bridge

XSS is a context confusion: text supplied as data reaches a browser position where it is interpreted as HTML, an attribute, a URL, CSS, or JavaScript. The correct defense depends on that final context, so one universal escaping function cannot be safe everywhere.

Prefer APIs that create text nodes or set safe properties, apply context-specific output encoding at the last responsible moment, and treat HTML sanitization as a specialized operation. Content Security Policy limits impact but does not repair unsafe rendering.

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

## Security scenario

<details><summary>Where should encoding happen?</summary><p>At output, for the exact HTML, attribute, URL, or JavaScript context; one encoder does not fit all.</p></details>

## Threat drill

**Scenario:** An attacker stores a comment containing markup or an event handler so JavaScript runs when the page is opened later.

**Negative test:** Submit text containing <code>&lt;script&gt;</code> and an attribute-context attempt, then render it in every context the page uses.

**Expected result:** It is displayed only as text, no handler runs, and CSP remains a defense-in-depth layer rather than a substitute for contextual encoding.

### Verification source

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## Connect the ideas

DOM XSS flows from an untrusted source into sinks such as innerHTML or eval; server encoding alone is insufficient. Trusted Types can restrict dangerous sinks, and strong CSP uses nonces or hashes rather than broad allowlists. Sanitizing allowed HTML differs from encoding plain text.

### Try it yourself

Trace a value from location to a DOM sink, then replace the sink or enforce a policy.
