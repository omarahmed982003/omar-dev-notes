---
title: 3. CSRF protection
description: How authenticated browsers are tricked and how tokens, SameSite, and origin checks help.
sidebar:
  order: 3
---

CSRF tricks an authenticated browser into sending an unwanted state-changing request. Cookies may be attached automatically, so the server sees a valid session without proof of user intent.

```php
session_start();
$_SESSION['csrf_token'] ??= bin2hex(random_bytes(32));
```

Place the value in a hidden form field and verify before changing state:

```php
$sent = $_POST['csrf_token'] ?? '';

if (!is_string($sent)
    || !isset($_SESSION['csrf_token'])
    || !hash_equals($_SESSION['csrf_token'], $sent)) {
    http_response_code(403);
    exit('Invalid CSRF token');
}
```

Keep tokens out of URLs/logs. Do not mutate state through GET. Add suitable SameSite cookies, Origin checks for sensitive requests, strict accepted content types, and re-authentication/MFA for high-risk actions.

CORS is not CSRF protection, and simple cross-site requests may avoid preflight. XSS can often read tokens or issue same-origin requests, so XSS prevention is essential. Signed double-submit cookies are possible, but prefer framework-reviewed protection. Per-session and per-form tokens are both valid designs; per-request rotation can break concurrent tabs.
