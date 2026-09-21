---
title: 13. Account lifecycle
description: Registration, verification, password recovery, identity changes, reauthentication, and session revocation.
sidebar:
  order: 13
---

## Registration and enumeration

Normalize identifiers according to a documented policy, validate product rules, rate-limit abuse, hash passwords, and delay sensitive privileges until required contact details are verified. Use similar public responses whether an account exists while keeping useful internal security logs.

## Verification token

```php
$token = bin2hex(random_bytes(32));
$tokenHash = hash('sha256', $token);
// Store hash + user_id + expires_at + used_at.
// Send the raw token once over an HTTPS link.
```

Hash the received value, verify expiry and one-time status, then consume it inside a transaction. Do not store raw bearer tokens.

## Password recovery

Use a short-lived one-time random token, a generic public response, and no guessable security questions. After success, rotate session identifiers and revoke other sessions or refresh tokens according to policy. Send a security notification.

## Sensitive changes

Require recent authentication or MFA before changing password, email, recovery factors, or performing high-risk actions. Track `auth_time`; possession of an old session is not sufficient.

Verify a new email, notify the old address, and enforce uniqueness in the database. Define suspension, deactivation, deletion, export, and retention explicitly. Test races such as double-clicked links and concurrent resets.

