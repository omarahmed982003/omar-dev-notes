---
title: 19. Secrets and key management
description: Secret managers, envelope encryption, rotation, revocation, access policy, break-glass, and incident response.
sidebar:
  order: 19
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **API:** A defined interface through which one program requests data or actions from another.
- **Cache:** A temporary copy that reduces waiting and repeated work.
- **Scope:** A named permission requested or granted to a client, such as orders:read; it does not by itself prove ownership of an order.


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

## Security scenario

<details><summary>What is the first response to a leaked secret?</summary><p>Revoke or rotate it immediately, determine usage from logs, fix the source, and monitor abuse.</p></details>

## Threat drill

**Scenario:** An old encryption-key version leaks while some stored data still depends on it.

**Negative test:** Rotate the key, encrypt new data, decrypt legacy data during the migration window, then disable the old version.

**Expected result:** New writes immediately use the new key, controlled migration succeeds, and the retired key cannot perform new operations.

### Verification source

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## Connect the ideas

Define a cryptoperiod for each key and use KMS/HSM for non-exportable keys or separation of duties. Encrypted backups need separate key backup and restore testing. Key destruction is a documented irreversible decision, and rotation differs from re-encryption; use dual-read/single-write during migration.

### Try it yourself

Rotate a key, restore an old backup, and prove required key availability matches policy.
