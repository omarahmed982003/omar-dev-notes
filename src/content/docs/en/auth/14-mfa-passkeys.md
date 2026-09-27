---
title: 14. MFA, TOTP, and passkeys
description: Authentication factors, TOTP, recovery codes, WebAuthn/passkeys, step-up, and safe recovery.
sidebar:
  order: 14
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.


### New terms in this lesson

This lesson introduces no extra technical label that needs memorizing; its new ideas are explained where they first appear.

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

## Security scenario

<details><summary>Is SMS the strongest MFA?</summary><p>No. It is exposed to SIM swaps and phishing; passkeys are generally phishing-resistant, and TOTP is stronger than a password alone.</p></details>

## Threat drill

**Scenario:** An attacker knows the password and tries to bypass the second factor or replay a passkey challenge for another origin.

**Negative test:** Test a wrong and reused OTP, then a WebAuthn assertion with a different challenge or origin.

**Expected result:** Every case fails, challenges are single-use, and account recovery cannot silently downgrade stronger protection.

### Verification source

- [W3C Web Authentication Level 3](https://www.w3.org/TR/webauthn-3/)

## Connect the ideas

Enrollment is sensitive and needs reauthentication, notification, and a credential inventory. Plan device loss and recovery without downgrading to weak questions. Understand synced passkeys versus device-bound credentials and attestation policy; do not require attestation without a reason. Step-up depends on action risk and authentication age.

### Try it yourself

Enroll and revoke a passkey, then test recovery without the original device.


## Reject a successfully used OTP

A valid TOTP is not reusable within its accepted time window. After verifying it, atomically consume the matched time step for that factor before granting access. A unique database constraint on `(factor_id, time_step)` lets only one concurrent request succeed. Track the matched step, not just the current server step when a clock window is allowed. Keep records until that step cannot be accepted again; factor rotation changes the factor ID. Test two simultaneous submissions: exactly one may succeed. Recovery codes need the same one-use guarantee.


[RFC 6238, section 5.2](https://www.rfc-editor.org/rfc/rfc6238#section-5.2)
