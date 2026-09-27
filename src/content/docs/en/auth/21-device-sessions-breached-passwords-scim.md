---
title: 21. Devices, sessions, breached passwords, and SCIM
description: Manage device sessions, screen breached passwords, and implement safe enterprise provisioning through SCIM.
sidebar:
  order: 21
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **IP:** A numeric address that identifies a device or network interface.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **Token:** A value representing identity or permission without resending a password.
- **Scope:** A named permission requested or granted to a client, such as orders:read; it does not by itself prove ownership of an order.
- **Function:** A named, reusable block of code with one defined job.


## Manageable session inventory

For each session, store a server-side hash of its identifier, creation and last-use times, expiry, an approximate device label, and minimized IP metadata where operationally and legally justified. User-Agent data is mutable and does not prove device identity.

An “Your devices” page lists active sessions and revokes one or all. “Log out all devices” can increment a session version or revoke sessions and refresh tokens. Require re-authentication for this sensitive operation.

```php
function revokeAllSessions(PDO $pdo, int $userId): void
{
    $statement = $pdo->prepare(
        'UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP
         WHERE user_id = :user_id AND revoked_at IS NULL'
    );
    $statement->execute(['user_id' => $userId]);
}
```

Notify the user after password changes or unusual new sessions without placing revocation credentials in email or logs.

## Breached-password screening

Length rules and `password_hash` do not reveal whether a chosen password appeared in a breach. Screen during registration and change through a trusted dataset or service. Never send the raw password; use a privacy-preserving protocol such as k-anonymity where available, with explicit timeout and outage behavior.

Allow password managers and paste. Do not force periodic changes without evidence of compromise.

## SCIM provisions accounts; it does not log users in

SCIM is an HTTP protocol for managing users and groups between an identity system and an application. It complements rather than replaces SAML or OIDC. Core actions include user creation, attribute updates, `active` disablement, and group membership.

Bind every SCIM client to one tenant, scope its credential, validate media type and schema, and use versions or ETags to prevent lost concurrent updates.

## Deprovisioning is critical

When `active=false`, block new login, revoke relevant sessions and tokens, remove group-derived privileges, preserve or transfer data under retention policy, and audit actor, source, and correlation ID. Test duplicate, replayed, and out-of-order updates; make disablement idempotent.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is a displayed device name not identity proof?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It is usually inferred from mutable, shared User-Agent and IP data; use it for display and risk hints, not authentication.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>What should “log out all devices” do?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Revoke applicable sessions and refresh tokens, audit the action, and notify the user without leaking credentials.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why does SCIM not replace OIDC?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> SCIM manages account and group lifecycle; OIDC authenticates a user during login.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why must deprovisioning be idempotent?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Providers retry requests; repetition must not duplicate deletion, transfer, or another dangerous side effect.</div></details></section>
</div>

## Threat drill

**Scenario:** An administrator disables a user through SCIM while sessions remain active on several devices.

**Negative test:** Deliver the disable event twice, then try every session, token refresh, and a login using a breached password.

**Expected result:** Processing is idempotent, sessions and tokens are revoked within policy, and the breached password is rejected with privacy and abuse controls.

### Verification source

- [RFC 7644: SCIM Protocol](https://www.rfc-editor.org/rfc/rfc7644.html)

## Connect the ideas

Device binding is a risk signal rather than absolute truth because browsers and devices change. Show users session inventory, last activity, approximate location, and individual/global revocation. For SCIM, test PATCH, groups, idempotency, and out-of-order events, and make deprovisioning revoke sessions and tokens within a monitored SLO.

### Try it yourself

Send duplicate and delayed SCIM disable events and verify final state plus revocation.
