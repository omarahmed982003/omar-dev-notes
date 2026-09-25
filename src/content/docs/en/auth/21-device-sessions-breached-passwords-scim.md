---
title: 21. Devices, sessions, breached passwords, and SCIM
description: Manage device sessions, screen breached passwords, and implement safe enterprise provisioning through SCIM.
sidebar:
  order: 21
---

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
