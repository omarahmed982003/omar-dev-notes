---
title: 1. Session security
description: Secure lifecycle, fixation and hijacking defenses, ID rotation, expiry, and cookies.
sidebar:
  order: 1
---

The server stores session state while the browser normally holds a random identifier cookie. That ID is a credential: stealing it can impersonate the user.

Session fixation makes a victim use an attacker-known ID; hijacking steals a valid ID through XSS, insecure transport, logs, or a compromised device.

```php
session_start([
    'use_strict_mode' => true,
    'use_only_cookies' => true,
    'cookie_secure' => true,
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);
```

Use HTTPS, never put IDs in URLs, and regenerate after authentication or privilege changes before writing elevated state:

```php
session_regenerate_id();
$_SESSION['user_id'] = $user['id'];
$_SESSION['auth_time'] = time();
```

Immediate deletion through `session_regenerate_id(true)` can race concurrent requests or unstable networks. Sensitive systems use a short timestamp-based transition and retire obsolete IDs deliberately.

Implement both idle and absolute expiry; do not confuse garbage collection with access policy. Treat IP/User-Agent changes as risk signals rather than strict identity because mobile networks, NAT, and VPNs change. Close session locks early with `session_write_close()`.

Logout must clear `$_SESSION`, expire the cookie with matching options, destroy storage, and revoke server-side refresh tokens or recorded sessions where applicable.
