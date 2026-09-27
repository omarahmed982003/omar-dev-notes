---
title: 15. API keys and machine identity
description: Issuing, storing, scoping, rotating, and revoking API keys, service accounts, and mTLS.
sidebar:
  order: 15
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **IP:** A numeric address that identifies a device or network interface.
- **TLS:** An encryption layer that protects data while it moves between two parties.
- **API:** A defined interface through which one program requests data or actions from another.
- **Scope:** A named permission requested or granted to a client, such as orders:read; it does not by itself prove ownership of an order.


## A key is not a user identity

An API key usually identifies an application or integration. Bind it to a clear service/client principal with owner, purpose, environment, and least privilege.

Use a recognizable public prefix/identifier plus a random secret. Look up by identifier and store only a hash of the secret. Display the secret once.

## Lifecycle

- Small deny-by-default scopes.
- Expiry where practical.
- Safe last-used metadata.
- Rotation with a short overlap.
- Immediate revocation.
- Separate keys per system and environment.

Send keys in an authorization or dedicated header over TLS, never in a query string. Apply per-key and per-tenant quotas. Treat IP restrictions only as an additional layer.

## Service accounts and mTLS

Machine accounts should have no interactive login unless required, minimum privileges, and attributable audit events. Prefer short-lived workload identity over static key files when available.

Mutual TLS authenticates both endpoints but still requires certificate lifecycle management and operation-level authorization.

## Security scenario

<details><summary>How should an API key be stored?</summary><p>Show it once, store a hash or use a secret manager, and add scope, expiry, rotation, and audit.</p></details>

## Threat drill

**Scenario:** A broadly privileged service API key leaks and is used from an unexpected environment.

**Negative test:** Try the key after revocation, from a disallowed source, and against an operation outside its scope.

**Expected result:** All three attempts fail, rotation is possible without downtime, and logs contain a key identifier rather than the secret value.

### Verification source

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## Connect the ideas

Prefer workload identity federation or short-lived credentials over static secrets when infrastructure supports it. Signed client assertions need audience, time, jti, and replay prevention. HSM/KMS can keep private keys non-exportable, and rotation needs an overlap window plus version identifier without downtime.

### Try it yourself

Rotate a live service credential and prove the old one expires after a defined overlap.
