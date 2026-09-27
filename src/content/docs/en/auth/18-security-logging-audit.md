---
title: 18. Security logging and audit trails
description: Security events, structured schemas, redaction, tamper resistance, alerting, and investigation.
sidebar:
  order: 18
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **API:** A defined interface through which one program requests data or actions from another.
- **Session:** Temporary server-side state used to recognize a user across requests.


## Different records

Operational logs support debugging, security events support detection, and an audit trail records who did what, when, and to which resource with stronger integrity and retention requirements.

Use a structured schema containing UTC time, event name, request ID, actor, tenant, action, resource, result, and a stable reason code. Prefer identifiers over unnecessary personal values and version the schema.

## Events and exclusions

Record login/MFA/recovery outcomes, identity and role changes, key lifecycle, authorization denial, administrative activity, exports/deletion, secret access, and policy changes.

Never record passwords, raw tokens, session IDs, API secrets, or recovery codes.

## Integrity and detection

Send records to centralized restricted storage, separate write and deletion authority, define retention and backup, synchronize clocks, and detect ingestion failure or tampering.

Alert on patterns such as distributed failures, privilege escalation, a new key followed by a large export, or unusual recovery. Give every alert an owner and runbook, and preserve request/trace IDs for investigation.

## Reference

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## Security scenario

<details><summary>What belongs in a security event?</summary><p>Actor, action, resource, outcome, time, and correlation ID without passwords, tokens, or excess sensitive data.</p></details>

## Threat drill

**Scenario:** An attacker tries to forge log entries with newline characters or flood telemetry with secrets.

**Negative test:** Submit a value containing a newline and a token-shaped string, then inspect the stored event and correlation chain.

**Expected result:** The event remains one structured record, secrets are redacted, and actor, time, outcome, and searchable correlation ID are present.

### Verification source

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## Connect the ideas

Audit trails need append-only or tamper-evident storage with write/delete separation, synchronized time, and a clear timestamp source. Define retention, legal access, and SIEM export, and test log injection plus redaction. Every alert needs an owner, runbook, and noise threshold.

### Try it yourself

Modify a stored event or inject a newline and prove tampering is detected.
