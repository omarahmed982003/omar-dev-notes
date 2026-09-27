---
title: 1. Session security
description: Secure lifecycle, fixation and hijacking defenses, ID rotation, expiry, and cookies.
sidebar:
  order: 1
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **IP:** A numeric address that identifies a device or network interface.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **Cookie:** A small value stored by the browser and sent with matching requests.
- **Worker:** A background process that takes jobs from a queue and runs them.


## Beginner bridge

A session is the server’s way to connect several independent HTTP requests to one signed-in browser. The browser normally carries only an opaque session ID; the valuable state stays on the server. Security therefore depends on protecting that identifier as if it were a temporary password.

Keep three threats separate: fixation chooses an ID before login, hijacking steals a valid ID after login, and weak expiry leaves an old ID useful for too long. Cookie flags reduce exposure, but rotation, server-side invalidation, time limits, and reauthentication are separate controls.

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

## Security scenario

<details><summary>Why rotate the session ID after login?</summary><p>To prevent session fixation; create a new session identity instead of keeping an attacker-known ID.</p></details>

## Threat drill

**Scenario:** An attacker captured a pre-login session identifier and tries to reuse it after the victim signs in.

**Negative test:** Sign in, record the new session identifier, then send a sensitive request from a separate client with the old identifier.

**Expected result:** The old identifier is rejected, account data is unchanged, and authentication produced a fresh identifier.

### Verification source

- [PHP session security](https://www.php.net/manual/en/session.security.php)

## Connect the ideas

In distributed deployments, use a shared session store or revocation reaching every node rather than worker memory. Apply suitable cookie prefixes such as <code>__Host-</code> where the contract fits, with Secure, HttpOnly, SameSite, and Path. Cookie-authenticated state changes still need CSRF protection.

### Try it yourself

Revoke a session on one node, try it through another, then run a CSRF test.
