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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: JWT and secure validation">
<p class="lesson-diagram-title">Concept map: JWT and secure validation</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Claims to validate</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Algorithms</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Rotation and JWKS</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Checklist</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Claims to validate” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> | Claim | Meaning | |---|---| | iss | exact trusted issuer | | sub | token subject, not necessarily an email | | aud | intended recipient API/client | | exp | expiration | | nbf | not valid before | | iat | issued at | | jti | unique token identifier | Short-lived tokens limit stale authorization. Roles embedded in a token do not automatically update when the account changes. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Claims to validate” with “Algorithms”. Why does neither replace the other in “JWT and secure validation”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Claims to validate”: | Claim | Meaning | |---|---| | iss | exact trusted issuer | | sub | token subject, not necessarily an email | | aud | intended recipient API/client | | exp | expiration | | nbf | not valid before | | iat | issued at | | jti | unique token identifier | Short-lived tokens limit stale authorization. Roles embedded in a token do not automatically update when the account changes. For “Algorithms”: HS256 uses a shared secret, so every verifier with that key can also issue tokens. Asymmetric signatures separate a private signing key from public verification keys. Configure an explicit allowed algorithm; never trust the token's alg choice by itself or accept none accidentally. The library verifies cryptography and time claims, while the application still owns issuer, audience, token type, and authorization… The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Rotation and JWKS”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> kid is untrusted input. Resolve it only inside a key set already bound to a trusted issuer. Never turn it into an arbitrary filename or follow a token-supplied jku URL. Cache JWKS with bounded refresh and retain retiring verification keys until outstanding tokens expire. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Checklist” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Require TLS. Allowlist algorithms and expected token type. Validate signature, issuer, audience, expiration, and not-before. Use a small, explicit clock skew. Separate ID-token and access-token validation rules and keys. Never log complete tokens. Choose short lifetimes, a targeted denylist, or opaque tokens where immediate revocation is required. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
