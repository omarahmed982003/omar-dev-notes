---
title: 14. MFA, TOTP, and passkeys
description: Authentication factors, TOTP, recovery codes, WebAuthn/passkeys, step-up, and safe recovery.
sidebar:
  order: 14
---

## Factors and TOTP

Factors are something known, possessed, or inherent/local user verification. Two steps from the same category are not strong MFA. SMS may improve password-only login but is exposed to phishing and SIM swap.

For TOTP, generate a random secret, prove setup with a code before enabling it, encrypt the secret under a managed key, use a small clock window, rate-limit checks, and avoid logging codes or secrets.

## Recovery codes

Generate random one-time codes, show them once, store strong hashes, consume each atomically, notify the user, and require reauthentication to regenerate the set.

## WebAuthn and passkeys

During registration the server sends a challenge and stores the resulting credential ID and public key. During authentication it verifies a fresh challenge, signature, origin, RP ID, user-verification policy, and relevant authenticator metadata. The server never stores the private key.

Passkeys resist phishing because credentials are scoped to the relying party and origin.

## Step-up and recovery

Ask for stronger assurance before changing recovery factors, high-value payments, or secret access—not every click. Bind the result to a short-lived action context.

Recovery must not silently bypass MFA. Use risk-appropriate evidence, delays and notifications for sensitive changes, audited support procedures, and explicit revocation of lost credentials.

## Reference

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

