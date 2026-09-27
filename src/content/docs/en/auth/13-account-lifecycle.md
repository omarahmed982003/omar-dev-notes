---
title: 13. Account lifecycle
description: Registration, verification, password recovery, identity changes, reauthentication, and session revocation.
sidebar:
  order: 13
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Session:** Temporary server-side state used to recognize a user across requests.
- **Token:** A value representing identity or permission without resending a password.


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

## Security scenario

<details><summary>What should happen when an employee is disabled?</summary><p>Block login, revoke sessions, tokens, and keys, and review ownership; deleting one user row is insufficient.</p></details>

## Threat drill

**Scenario:** A former employee has a still-live session or refresh token after the account is disabled.

**Negative test:** Disable the account, then attempt a new login, token refresh, and use of an existing session.

**Expected result:** All three paths fail within the defined revocation window, and the actor plus reason are audited without sensitive data.

### Verification source

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## Connect the ideas

Normalize email under an explicit policy without assuming every provider behaves alike, and enforce uniqueness in the database. Make registration and recovery resistant to account enumeration. Define dormant-account handling, retention, deletion, and legal hold, and audit transitions plus actor.

### Try it yourself

Test reset for existing and absent emails with equivalent response shape and acceptable timing.
