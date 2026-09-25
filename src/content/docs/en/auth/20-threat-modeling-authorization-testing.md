---
title: 20. Threat modeling and authorization testing
description: Model login threats and build authorization test matrices for roles, ownership, and tenant isolation.
sidebar:
  order: 20
---

## Assets and trust boundaries

A threat model is not a generic vulnerability list. Identify assets—credentials, sessions, tokens, user data, and audit records—then actors such as users, administrators, internal services, identity providers, and attackers. Every browser, API, IdP, and database transition is a trust boundary requiring independent validation.

## Model the login flow

At each step ask whether identity can be spoofed, parameters such as `return_to` or `tenant_id` can be altered, secrets reach logs, sensitive actions lack evidence, errors reveal account existence, or recovery bypasses MFA. Convert every material threat into a control, test, and telemetry event.

Session fixation, for example, maps to session-ID regeneration after login, a test proving the identifier changed and the old one fails, and an audit event that never records the identifier value.

## Authorization test matrix

| Subject | Resource | Tenant | Action | Expected |
|---|---|---|---|---|
| Owner | Own invoice | Same | read | Allow |
| User | Other invoice | Same | read | Deny |
| Admin | Invoice | Same | refund | Policy-dependent allow |
| Admin | Invoice | Other | read | Deny |
| Suspended user | Own invoice | Same | read | Deny or documented read-only |

Add missing identity, stale role, deleted resource, and random identifier cases. Unit-test the policy and integration-test the endpoint so routing and middleware cannot bypass it.

## Deny by default

An action without an explicit policy is denied. A cross-tenant lookup may return `404` rather than `403` to avoid revealing resource existence, while recording the internal reason. Hiding a button is never authorization; the server decides from trusted subject, action, resource, and context.

## Review after change

Revisit the model when adding an identity provider, webhook, role, tenant boundary, or recovery path. Every threat needs an owner, decision, test, and documented residual risk.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How do an asset and a trust boundary differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> An asset is protected value; a boundary is a transition where trust assumptions change and validation must occur.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why is an administrator happy path insufficient?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Serious failures appear in ownership, tenant crossing, suspended users, and stale privileges.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>When can 404 be preferable to 403?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> When revealing the existence of an unauthorized resource is itself sensitive, while the internal denial reason remains audited.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn session fixation into a control and test.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Regenerate after login and invalidate the old ID; verify the old session fails and the new one has exactly the intended privileges.</div></details></section>
</div>
