---
title: 5. Password hashing
description: Safe storage with password_hash, password_verify, Argon2id, bcrypt, and rehashing.
sidebar:
  order: 5
---

Passwords should be verified, not recovered. Store a slow salted password hash, not reversible encryption or a fast general-purpose hash.

```php
$hash = password_hash($password, PASSWORD_DEFAULT);
if ($hash === false) {
    throw new RuntimeException('Hashing failed');
}

if (!password_verify($password, $user['password_hash'])) {
    throw new AuthenticationException('Invalid credentials');
}

if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
    $users->updatePasswordHash(
        $user['id'],
        password_hash($password, PASSWORD_DEFAULT)
    );
}
```

Use a `VARCHAR(255)` column because `PASSWORD_DEFAULT` may evolve. Argon2id is available in compatible builds; benchmark memory/time costs on production-like hardware. PHP embeds salt and options in the result; do not create salts or compare hashes manually.

Allow long passphrases, avoid silent trimming/truncation, rate-limit attempts, add MFA for sensitive accounts, and never log passwords. bcrypt historically only uses the first 72 bytes.

A server-side pepper is optional and adds key-management complexity. Keep it in a secret manager. Password-reset tokens must be random, short-lived, one-time, and stored hashed; revoke relevant sessions after a successful reset.
