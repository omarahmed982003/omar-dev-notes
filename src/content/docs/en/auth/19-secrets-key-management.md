---
title: 19. Secrets and key management
description: Secret managers, envelope encryption, rotation, revocation, access policy, break-glass, and incident response.
sidebar:
  order: 19
---

## Identify the secret

Database passwords, API keys, private keys, encryption keys, and signing secrets are sensitive. Public environment names and URLs usually are not. A `.env` file is a development loading mechanism, not a secret manager, and Base64 is not encryption.

## Lifecycle

```text
generate -> store -> distribute -> use -> rotate -> revoke -> destroy
```

Every secret needs an owner, purpose, consumers, lifetime, and rotation policy. Avoid sharing one credential across many services.

## Secret managers and envelope encryption

Let the workload authenticate with least privilege and prefer short-lived or dynamic credentials. Cache only briefly in memory and never write values to logs.

With envelope encryption, a KMS/HSM master key protects a data-encryption key, while the DEK encrypts application data. Store ciphertext, encrypted DEK, algorithm, and key version. Use authenticated encryption with correct nonces and contextual associated data.

## Rotation

Store a key ID/version. Create a new key, write new data with it, keep old versions readable, re-encrypt where needed, then revoke after a safe window. Destroying an encryption key may permanently destroy access to data.

## Access and incident response

Apply least privilege, separate administration from runtime, audit access and changes, provide controlled break-glass procedures, alert on unusual access, and test encrypted backup recovery.

After exposure, restrict use, rotate or revoke, determine scope from audit records, fix the source, and inspect history, artifacts, and logs. Removing a value from Git does not revoke it.

## Reference

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

