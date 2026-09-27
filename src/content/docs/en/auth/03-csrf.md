---
title: 3. CSRF protection
description: How authenticated browsers are tricked and how tokens, SameSite, and origin checks help.
sidebar:
  order: 3
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Session:** Temporary server-side state used to recognize a user across requests.
- **Cookie:** A small value stored by the browser and sent with matching requests.
- **Token:** A value representing identity or permission without resending a password.


## Beginner bridge

CSRF works because a browser automatically attaches ambient credentials, such as cookies, to a request chosen by another site. The attacker does not need to read the response; causing a state-changing action can be enough.

The mental model is request intent. A valid session proves which browser account sent the cookie, while a CSRF token or strict origin check helps prove that the action came through a page and flow the application created. SameSite is useful defense in depth, not a universal replacement for request-specific protection.

CSRF tricks an authenticated browser into sending an unwanted state-changing request. Cookies may be attached automatically, so the server sees a valid session without proof of user intent.

```php
session_start();
$_SESSION['csrf_token'] ??= bin2hex(random_bytes(32));
```

Place the value in a hidden form field and verify before changing state:

```php
$sent = $_POST['csrf_token'] ?? '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? null;
$allowedOrigins = ['https://app.example.com'];

if (!is_string($sent)
    || $sent === ''
    || !is_string($origin)
    || !in_array($origin, $allowedOrigins, true)
    || !isset($_SESSION['csrf_token'])
    || !hash_equals($_SESSION['csrf_token'], $sent)) {
    http_response_code(403);
    exit('Invalid CSRF token');
}
```

Keep tokens out of URLs/logs. Do not mutate state through GET. Add suitable SameSite cookies, Origin checks for sensitive requests, strict accepted content types, and re-authentication/MFA for high-risk actions.

CORS is not CSRF protection, and simple cross-site requests may avoid preflight. XSS can often read tokens or issue same-origin requests, so XSS prevention is essential. Signed double-submit cookies are possible, but prefer framework-reviewed protection. Per-session and per-form tokens are both valid designs; per-request rotation can break concurrent tabs.

## Security scenario

<details><summary>Why is SameSite alone not always enough?</summary><p>It has limits and bypass scenarios; combine suitable cookies with tokens and origin checks for the threat.</p></details>

## Threat drill

**Scenario:** A hostile page attempts to change an email address while the browser carries the victim’s cookies.

**Negative test:** Send the request without a CSRF token, with another user’s token, and with a valid token from a disallowed Origin.

**Expected result:** All three attempts are rejected and the email stays unchanged; a valid cookie alone is insufficient.

### Verification source

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## Connect the ideas

SameSite reduces some paths but does not replace tokens and Origin checks; Lax, Strict, and None differ. Login CSRF can bind a victim to an attacker account before a trusted session exists. APIs without ambient cookies face a different CSRF model but still need token-leak prevention and correct CORS.

### Try it yourself

Test login CSRF and cross-site requests under different SameSite modes.


## Origin policy

Configure the exact trusted origin, including scheme and non-default port. Never construct this allowlist from the incoming Host header. The shown policy rejects a missing Origin as well as a foreign one; some clients omit it, so test legitimate clients before choosing a documented Referer fallback. Origin is another layer, not authentication: a non-browser client can set this header. Keep the session token check and use POST for changes.
