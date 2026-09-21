---
title: 15. API keys and machine identity
description: Issuing, storing, scoping, rotating, and revoking API keys, service accounts, and mTLS.
sidebar:
  order: 15
---

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

