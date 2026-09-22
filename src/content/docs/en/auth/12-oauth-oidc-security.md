---
title: 12. OAuth and OIDC security
description: State, nonce, PKCE, redirect URIs, browser token storage, BFF, revocation, and monitoring.
sidebar:
  order: 12
---

# Different controls protect different boundaries

| Control | Primary purpose |
|---|---|
| session-bound `state` | callback CSRF and transaction swapping |
| OIDC `nonce` | authentication-response replay/substitution |
| PKCE | authorization-code theft or injection |
| exact redirect URI | redirecting results to an attacker |

Use transaction-specific values and consume them once.

## Callback skeleton

```php
session_start();

$tx = $_SESSION['oauth'] ?? null;
unset($_SESSION['oauth']);

if (!is_array($tx) || time() - $tx['created_at'] > 600) {
    throw new RuntimeException('OAuth transaction expired');
}

$returnedState = $_GET['state'] ?? '';
if (
    !is_string($returnedState)
    || !hash_equals($tx['state'], hash('sha256', $returnedState))
) {
    throw new RuntimeException('Invalid state');
}

if (isset($_GET['error'])) {
    throw new RuntimeException('Authorization was not completed');
}

$code = $_GET['code'] ?? null;
if (!is_string($code) || $code === '') {
    throw new RuntimeException('Missing authorization code');
}
```

Do not log the callback query. Use `Referrer-Policy: no-referrer` and avoid third-party content on callback pages.

## Redirect safety

Register and exactly match complete HTTPS redirect URIs. Avoid production wildcards and open redirects. Store post-login destinations server-side or restrict them to internal paths. Bind the transaction to the expected issuer when one client supports multiple authorization servers.

## Browser architectures

A Backend for Frontend keeps tokens server-side:

```text
Browser --Secure HttpOnly session cookie--> BFF
BFF --access token--> APIs
```

Protect the cookie session against CSRF and fixation. In browser-only clients, memory limits persistence; long-lived `localStorage` tokens are available to any JavaScript executing in that origin. Never ship a client secret to a SPA.

Keep tokens out of URLs, history, logs, and analytics.

## Lifecycle

- Keep access tokens short-lived and resource/audience restricted.
- Store refresh tokens with stronger protection.
- Rotate refresh tokens and detect reuse.
- Revoke the token family on compromise, logout, or security changes.
- Use revocation or introspection where immediate control is required.
- Consider mTLS or DPoP for sender-constrained tokens in higher-risk systems.

## OIDC checklist

1. Start discovery from a preconfigured trusted issuer.
2. Use Authorization Code + PKCE S256.
3. Bind state/PKCE and nonce to one browser transaction.
4. Require an exact registered redirect URI.
5. Validate signature, issuer, audience, expiration, and nonce.
6. Link accounts by `iss + sub`.
7. Do not turn email/domain claims into local privileges without an explicit policy.
8. Create a fresh local session and rotate its identifier.

Log issuer, client ID, flow, outcome, error code, and correlation ID, but never tokens, codes, verifiers, secrets, or assertions. Monitor invalid grants, refresh-token reuse, issuer/redirect mismatch, signature/audience failures, unusual scopes, and device-flow polling.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: OAuth and OIDC security">
<p class="lesson-diagram-title">Concept map: OAuth and OIDC security</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Callback skeleton</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Redirect safety</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Browser architectures</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Lifecycle</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>OIDC checklist</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Callback skeleton” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Do not log the callback query. Use Referrer-Policy: no-referrer and avoid third-party content on callback pages. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Callback skeleton” with “Redirect safety”. Why does neither replace the other in “OAuth and OIDC security”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Callback skeleton”: Do not log the callback query. Use Referrer-Policy: no-referrer and avoid third-party content on callback pages. For “Redirect safety”: Register and exactly match complete HTTPS redirect URIs. Avoid production wildcards and open redirects. Store post-login destinations server-side or restrict them to internal paths. Bind the transaction to the expected issuer when one client supports multiple authorization servers. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Browser architectures”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A Backend for Frontend keeps tokens server-side: Protect the cookie session against CSRF and fixation. In browser-only clients, memory limits persistence; long-lived localStorage tokens are available to any JavaScript executing in that origin. Never ship a client secret to a SPA. Keep tokens out of URLs, history, logs, and analytics. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Lifecycle” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Keep access tokens short-lived and resource/audience restricted. Store refresh tokens with stronger protection. Rotate refresh tokens and detect reuse. Revoke the token family on compromise, logout, or security changes. Use revocation or introspection where immediate control is required. Consider mTLS or DPoP for sender-constrained tokens in higher-risk systems. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
