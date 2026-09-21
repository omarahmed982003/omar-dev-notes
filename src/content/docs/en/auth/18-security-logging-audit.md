---
title: 18. Security logging and audit trails
description: Security events, structured schemas, redaction, tamper resistance, alerting, and investigation.
sidebar:
  order: 18
---

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

