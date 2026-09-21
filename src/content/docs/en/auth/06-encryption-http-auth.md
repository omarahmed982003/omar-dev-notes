---
title: 6. Encryption and HTTP authentication
description: Authenticated encryption, key management, Basic auth, Bearer tokens, and hashing differences.
sidebar:
  order: 6
---

Use encryption when plaintext must be recovered; passwords use hashing. Prefer authenticated encryption APIs that provide confidentiality and tamper detection.

```php
$nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
$cipher = sodium_crypto_secretbox($plainText, $nonce, $key);
$stored = base64_encode($nonce . $cipher);
```

The key must be securely random with the required length and stored in a secret manager. Base64 is encoding, not encryption. Keep key versions with ciphertext, restrict decrypt permission, audit use, and plan rotation/revocation.

HTTP Basic sends Base64-encoded `username:password` on each request:

```http
Authorization: Basic dXNlcjpwYXNz
```

It requires HTTPS and rate limiting. PHP may expose credentials through `PHP_AUTH_USER` and `PHP_AUTH_PW`, depending on server configuration. Basic can suit constrained internal tools but has limited lifecycle/logout controls.

A Bearer token grants access to whoever holds it. Treat it as a secret and design expiry, scope, rotation, and revocation. Not every token is JWT, and JWT is neither encrypted nor automatically revocable.
