---
title: 8. JWT and secure validation
description: JWT structure, signatures, claims, issuer/audience/time validation, and key management.
sidebar:
  order: 8
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **URL:** The complete address of a resource such as a page or API endpoint.
- **TLS:** An encryption layer that protects data while it moves between two parties.
- **API:** A defined interface through which one program requests data or actions from another.
- **Cache:** A temporary copy that reduces waiting and repeated work.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **Token:** A value representing identity or permission without resending a password.
- **Scope:** A named permission requested or granted to a client, such as orders:read; it does not by itself prove ownership of an order.


- **Authorization:** Deciding which actions an identity may perform.
- **Encryption:** A reversible transformation requiring the correct key.
- **XSS:** An attack that runs untrusted JavaScript in a user page.
- **CSRF:** An attack that makes a signed-in browser send an unintended request.
- **JWT:** A signed token format; signing does not encrypt its contents.
- **Secret:** A sensitive value such as an API key or service password.

# JWT is not a magic session

A common signed JWT is a JWS with three Base64url segments:

```text
BASE64URL(header).BASE64URL(payload).BASE64URL(signature)
```

The signature protects integrity and authenticity when verified with the correct key. Base64url provides no confidentiality: anyone holding the token can read its payload.

## Claims to validate

| Claim | Meaning |
|---|---|
| `iss` | exact trusted issuer |
| `sub` | token subject, not necessarily an email |
| `aud` | intended recipient API/client |
| `exp` | expiration |
| `nbf` | not valid before |
| `iat` | issued at |
| `jti` | unique token identifier |

Short-lived tokens limit stale authorization. Roles embedded in a token do not automatically update when the account changes.

## Algorithms

`HS256` uses a shared secret, so every verifier with that key can also issue tokens. Asymmetric signatures separate a private signing key from public verification keys. Configure an explicit allowed algorithm; never trust the token's `alg` choice by itself or accept `none` accidentally.

```bash
composer require firebase/php-jwt
```

```php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$payload = [
    'iss' => 'https://id.example.com',
    'sub' => 'user_123',
    'aud' => 'https://api.example.com',
    'iat' => time(),
    'nbf' => time(),
    'exp' => time() + 300,
    'scope' => 'orders:read',
];

$token = JWT::encode($payload, $privateKey, 'RS256', 'key-2026-09');
$claims = (array) JWT::decode($token, new Key($publicKey, 'RS256'));

validateAccessClaims($claims, 'https://id.example.com', 'https://api.example.com', time());

if (($claims['iss'] ?? null) !== 'https://id.example.com') {
    throw new RuntimeException('Invalid issuer');
}

if (!in_array('https://api.example.com', (array) ($claims['aud'] ?? []), true)) {
    throw new RuntimeException('Invalid audience');
}
```

The library verifies cryptography and time claims, while the application still owns issuer, audience, token type, and authorization policy checks.

## Rotation and JWKS

`kid` is untrusted input. Resolve it only inside a key set already bound to a trusted issuer. Never turn it into an arbitrary filename or follow a token-supplied `jku` URL. Cache JWKS with bounded refresh and retain retiring verification keys until outstanding tokens expire.

## Checklist

- Require TLS.
- Allowlist algorithms and expected token type.
- Validate signature, issuer, audience, expiration, and not-before.
- Use a small, explicit clock skew.
- Separate ID-token and access-token validation rules and keys.
- Never log complete tokens.
- Choose short lifetimes, a targeted denylist, or opaque tokens where immediate revocation is required.

## Security scenario

<details><summary>Why not put secrets in a JWT?</summary><p>The payload is usually encoded, not encrypted, and token holders can read it; minimize claims and scope.</p></details>

## Threat drill

**Scenario:** An attacker changes a JWT header or claim, or replays a token issued for another issuer or audience.

**Negative test:** Test a modified signature, an unexpected <code>alg</code>, a wrong <code>aud</code>, and an expired token.

**Expected result:** Every case is rejected before business logic; algorithm, issuer, audience, and lifetime are server-side policy, not token-controlled choices.

### Verification source

- [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

## Connect the ideas

A JWT access token has no inherent instant revocation; use short lifetimes plus rotation, introspection, or a denylist according to risk. Define browser storage against the XSS/CSRF model. Pin algorithm, issuer, and audience in configuration, manage JWKS caching/rotation, and avoid nested or encrypted tokens without a supported need.

### Try it yourself

Rotate a signing key and prove the old key works only during the overlap window.


## Required claims are an application contract

The example above is an integration fragment: load Composer autoloading and supply managed RSA keys. Add this function in the same file. Call it only after the library verifies the signature with a trusted key and fixed algorithm. This access-token profile requires `iss`, `sub`, `aud`, and integer `exp`; JWT itself does not require every registered claim. A library may validate expiration only when the field exists. Optional `nbf` must also be an integer here. This strict teaching profile uses zero clock tolerance; production tolerance must be explicit and bounded.

```php
function validateAccessClaims(array $claims, string $issuer, string $audience, int $now): void
{
    // Only call AFTER a JOSE library has verified the signature and fixed algorithm.
    if (($claims['iss'] ?? null) !== $issuer
        || !is_string($claims['sub'] ?? null) || $claims['sub'] === ''
        || !is_int($claims['exp'] ?? null) || $claims['exp'] <= $now) {
        throw new InvalidArgumentException('Missing or invalid required claim');
    }
    $aud = $claims['aud'] ?? null;
    if (is_string($aud)) {
        $aud = [$aud];
    }
    if (!is_array($aud) || !array_is_list($aud) || $aud === []
        || count(array_filter($aud, 'is_string')) !== count($aud)
        || !in_array($audience, $aud, true)) {
        throw new InvalidArgumentException('Invalid audience');
    }
    if (array_key_exists('nbf', $claims)
        && (!is_int($claims['nbf']) || $claims['nbf'] > $now)) {
        throw new InvalidArgumentException('Invalid not-before claim');
    }
}
```

Test a correctly signed token issued without `exp`: it must fail policy validation. Removing a field from an existing signed token instead tests signature tampering. The local `security` tests validate this policy, not the third-party signature implementation.
