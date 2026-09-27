---
title: 5. Password hashing
description: Safe storage with password_hash, password_verify, Argon2id, bcrypt, and rehashing.
sidebar:
  order: 5
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **API:** A defined interface through which one program requests data or actions from another.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **Token:** A value representing identity or permission without resending a password.


## Beginner bridge

Password storage is designed for an eventual database leak. The system must verify a password without keeping a reversible copy, and each guess should be deliberately expensive for an attacker. General-purpose fast hashes solve a different problem and are therefore unsuitable.

Use the platform password API, let it manage salts, tune cost for the deployment, and rehash after successful login when policy changes. Rate limiting protects the online login endpoint; a slow password hash protects against offline guessing after stolen hashes.

Passwords should be verified, not recovered. Store a slow salted password hash, not reversible encryption or a fast general-purpose hash.

```php
<?php
declare(strict_types=1);

$password = 'a long example passphrase';
// One policy for registration AND rehashing after successful login.
$algorithm = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT;
$options = $algorithm === PASSWORD_DEFAULT ? [] : [
    'memory_cost' => 64 * 1024, 'time_cost' => 3, 'threads' => 2,
];
$storedHash = password_hash($password, $algorithm, $options);
echo password_verify($password, $storedHash) ? "valid\n" : "invalid\n";
echo password_verify('wrong password', $storedHash) ? "valid\n" : "invalid\n";
if (password_verify($password, $storedHash)
    && password_needs_rehash($storedHash, $algorithm, $options)) {
    $storedHash = password_hash($password, $algorithm, $options);
    // Persist using a conditional update against the previous hash.
}
```

Use a `VARCHAR(255)` column because `PASSWORD_DEFAULT` may evolve. Argon2id is available in compatible builds; benchmark memory/time costs on production-like hardware. PHP embeds salt and options in the result; do not create salts or compare hashes manually.

Allow long passphrases, avoid silent trimming/truncation, rate-limit attempts, add MFA for sensitive accounts, and never log passwords. bcrypt historically only uses the first 72 bytes.

A server-side pepper is optional and adds key-management complexity. Keep it in a secret manager. Password-reset tokens must be random, short-lived, one-time, and stored hashed; revoke relevant sessions after a successful reset.

## Security scenario

<details><summary>Why use Argon2id or bcrypt instead of SHA-256?</summary><p>Password hashes are deliberately slow and salted; a fast hash lets attackers test more guesses.</p></details>

## Threat drill

**Scenario:** The user database leaks; passwords should remain expensive to crack and no response or log should expose sensitive values.

**Negative test:** Verify that the same password produces different hashes twice, a wrong password fails, and <code>password_needs_rehash</code> detects an old policy.

**Expected result:** Only the correct password verifies, plaintext is never stored, and a successful login upgrades an obsolete hash when needed.

### Verification source

- [PHP password hashing functions](https://www.php.net/manual/en/ref.password.php)

## Connect the ideas

Choose Argon2 or bcrypt parameters by measuring latency and memory on production-class hardware, then version policy through needs_rehash. Check breached passwords with privacy and rate controls, and bind reset tokens to expiry, single use, hashed storage, and session revocation policy.

### Try it yourself

Benchmark two hash settings, choose a budget, then test a reset token twice.


## Read the result and failure behavior

The complete program prints `valid` then `invalid`. `PASSWORD_DEFAULT` is a policy that PHP may change; storing its result does not pin your application to Argon2id. Choose and benchmark a policy explicitly. PHP 8 throws on hashing failures (`ValueError` for invalid parameters or `Error` for certain failures); a `=== false` branch is obsolete for this baseline. Let a central error handler return a generic failure and avoid logging passwords. The database update is application-specific: use a conditional update to avoid overwriting a concurrent password reset.

Exercise: change only `time_cost` after creating the hash. `password_verify` still succeeds because the stored hash contains the old parameters, while `password_needs_rehash` becomes true for the new policy.
