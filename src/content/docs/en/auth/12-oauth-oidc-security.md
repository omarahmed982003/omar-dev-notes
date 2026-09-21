---
title: 12. OAuth and OIDC security
description: State, nonce, PKCE, redirect URIs, browser token storage, BFF, revocation, and monitoring.
sidebar:
  order: 12
---

# Different controls protect different boundaries

| Control | Primary purpose |
|---|---|
| session-bound `state` | callback CSRF and transaction swapping |
| OIDC `nonce` | authentication-response replay/substitution |
| PKCE | authorization-code theft or injection |
| exact redirect URI | redirecting results to an attacker |

Use transaction-specific values and consume them once.

## Callback skeleton

```php
session_start();

$tx = $_SESSION['oauth'] ?? null;
unset($_SESSION['oauth']);

if (!is_array($tx) || time() - $tx['created_at'] > 600) {
    throw new RuntimeException('OAuth transaction expired');
}

$returnedState = $_GET['state'] ?? '';
if (
    !is_string($returnedState)
    || !hash_equals($tx['state'], hash('sha256', $returnedState))
) {
    throw new RuntimeException('Invalid state');
}

if (isset($_GET['error'])) {
    throw new RuntimeException('Authorization was not completed');
}

$code = $_GET['code'] ?? null;
if (!is_string($code) || $code === '') {
    throw new RuntimeException('Missing authorization code');
}
```

Do not log the callback query. Use `Referrer-Policy: no-referrer` and avoid third-party content on callback pages.

## Redirect safety

Register and exactly match complete HTTPS redirect URIs. Avoid production wildcards and open redirects. Store post-login destinations server-side or restrict them to internal paths. Bind the transaction to the expected issuer when one client supports multiple authorization servers.

## Browser architectures

A Backend for Frontend keeps tokens server-side:

```text
Browser --Secure HttpOnly session cookie--> BFF
BFF --access token--> APIs
```

Protect the cookie session against CSRF and fixation. In browser-only clients, memory limits persistence; long-lived `localStorage` tokens are available to any JavaScript executing in that origin. Never ship a client secret to a SPA.

Keep tokens out of URLs, history, logs, and analytics.

## Lifecycle

- Keep access tokens short-lived and resource/audience restricted.
- Store refresh tokens with stronger protection.
- Rotate refresh tokens and detect reuse.
- Revoke the token family on compromise, logout, or security changes.
- Use revocation or introspection where immediate control is required.
- Consider mTLS or DPoP for sender-constrained tokens in higher-risk systems.

## OIDC checklist

1. Start discovery from a preconfigured trusted issuer.
2. Use Authorization Code + PKCE S256.
3. Bind state/PKCE and nonce to one browser transaction.
4. Require an exact registered redirect URI.
5. Validate signature, issuer, audience, expiration, and nonce.
6. Link accounts by `iss + sub`.
7. Do not turn email/domain claims into local privileges without an explicit policy.
8. Create a fresh local session and rotate its identifier.

Log issuer, client ID, flow, outcome, error code, and correlation ID, but never tokens, codes, verifiers, secrets, or assertions. Monitor invalid grants, refresh-token reuse, issuer/redirect mismatch, signature/audience failures, unusual scopes, and device-flow polling.
