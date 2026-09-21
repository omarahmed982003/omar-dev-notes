---
title: 8. JWT and secure validation
description: JWT structure, signatures, claims, issuer/audience/time validation, and key management.
sidebar:
  order: 8
---

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
