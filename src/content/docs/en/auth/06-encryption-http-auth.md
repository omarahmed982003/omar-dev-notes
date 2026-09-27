---
title: 6. Encryption and HTTP authentication
description: Authenticated encryption, key management, Basic auth, Bearer tokens, and hashing differences.
sidebar:
  order: 6
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **TLS:** An encryption layer that protects data while it moves between two parties.
- **Token:** A value representing identity or permission without resending a password.
- **Scope:** A named permission requested or granted to a client, such as orders:read; it does not by itself prove ownership of an order.


## Beginner bridge

Encryption, hashing, MACs, and digital signatures answer different questions. Encryption hides content, a hash fingerprints it, a MAC proves integrity to parties sharing a secret, and a signature allows verification with a public key. Choosing a primitive before naming the threat usually creates a fragile design.

HTTP authentication schemes also differ in what travels on every request. Basic authentication merely encodes credentials and therefore requires TLS. Bearer credentials grant access to whoever possesses them, so transport protection, narrow scope, short lifetime, and careful logging are essential.

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

## Security scenario

<details><summary>Does encryption replace signing?</summary><p>No. Encryption hides content; signing proves integrity and origin. A system may need both.</p></details>

## Threat drill

**Scenario:** A network attacker attempts to read Basic Authentication credentials or force the client onto an unencrypted connection.

**Negative test:** Send HTTP without credentials, then incorrect test credentials over HTTPS; verify TLS is established before attaching secrets.

**Expected result:** HTTP is redirected or rejected, bad credentials fail, and secrets appear in neither URLs nor logs.

### Verification source

- [OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)

## Connect the ideas

Use AEAD with a unique nonce per key and associated data for context; do not invent key derivation or formats. Separate data from encryption keys and backups. Basic sends credentials on every request and always needs TLS, while a Bearer token grants its holder access; scope, audience, lifetime, and storage are part of the contract.

### Try it yourself

Test wrong associated data with the complete AEAD example below. Nonce reuse is unsafe but does not automatically produce a library exception.


## Authenticate the context with AEAD

`secretbox` authenticates the ciphertext but has no associated-data argument. AEAD (authenticated encryption with associated data) also binds unencrypted context to it: a note for user 42 must not decrypt as a note for user 99. The context is not secret. Build it from trusted account/record identifiers and a stable format. This standalone Sodium example prints `private note`, then `wrong context rejected`.

```php
<?php
declare(strict_types=1);



function seal(string $plain, string $context, string $key): string
{
    $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
    $cipher = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($plain, $context, $nonce, $key);
    return base64_encode($nonce . $cipher);
}

function openSealed(string $encoded, string $context, string $key): string
{
    $payload = base64_decode($encoded, true);
    $nonceBytes = SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES;
    if ($payload === false || strlen($payload) < $nonceBytes + SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_ABYTES) {
        throw new RuntimeException('Invalid encrypted payload');
    }
    $plain = sodium_crypto_aead_xchacha20poly1305_ietf_decrypt(
        substr($payload, $nonceBytes), $context, substr($payload, 0, $nonceBytes), $key,
    );
    if ($plain === false) {
        throw new RuntimeException('Authentication failed');
    }
    return $plain;
}

$key = sodium_crypto_aead_xchacha20poly1305_ietf_keygen();
$encoded = seal("private note", "user:42:note:v1", $key);
echo openSealed($encoded, "user:42:note:v1", $key), PHP_EOL;
try {
    openSealed($encoded, "user:99:note:v1", $key);
} catch (RuntimeException) {
    echo "wrong context rejected", PHP_EOL;
}
```

Generate a fresh random 24-byte nonce for each encryption with this algorithm. Uniqueness is a caller obligation; a repeated nonce need not raise an exception. This teaching envelope has no key-ID/rotation protocol; add a versioned, validated envelope before persistent production storage.

An HTTP-to-HTTPS redirect cannot protect Basic credentials already sent in the first HTTP request. Configure HTTPS at the client before attaching credentials, enforce TLS at the edge, and avoid forwarding Authorization across redirects to other origins. HSTS helps supporting browsers after policy is learned (or preloaded); it does not repair past disclosure.


[PHP XChaCha20-Poly1305](https://www.php.net/manual/en/function.sodium-crypto-aead-xchacha20poly1305-ietf-encrypt.php)
