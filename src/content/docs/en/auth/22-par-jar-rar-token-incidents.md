---
title: 22. PAR, JAR, RAR, and token incidents
description: Advanced OAuth authorization requests and practical response to leaked access tokens, refresh tokens, or signing credentials.
sidebar:
  order: 22
---

## The authorization-request problem

A normal authorization request passes through the browser with `client_id`, `redirect_uri`, `scope`, `state`, and possibly sensitive details. Signed or directly pushed requests reduce manipulation and leakage but do not replace PKCE, state, nonce, or exact redirect validation.

## PAR

With Pushed Authorization Requests, the client sends details directly to an authenticated PAR endpoint and receives a short-lived `request_uri`. The browser then carries the reference to the authorization endpoint. Bind the reference to its client and enforce its expiration and reuse policy.

## JAR

JWT-Secured Authorization Request packages parameters in a signed Request Object. Validate signature, `iss`, `aud`, `exp`, and conflicts between JWT and query parameters. A signature protects integrity and authenticity; it does not hide content unless encryption is separately applied.

## RAR

Rich Authorization Requests place structured detail in `authorization_details` rather than relying only on a broad scope. Payment type, amount, currency, and recipient can support precise policy and consent. Validate a registered schema and prevent clients from requesting unregistered power.

PAR, JAR, and RAR solve different problems and can be combined: RAR describes rich authority, JAR protects a Request Object, and PAR pushes it through a back channel.

## Incident: a leaked access token

Activate incident command, identify whether exposure affects one token, a client, or a signing key, revoke the grant or session where possible, stop continued leakage from logs, preserve restricted evidence, and rotate a broader secret when necessary. Hunt suspicious use by `jti`, client, or subject without logging the raw token. Notify affected parties under policy and law, fix the source, and add detection and regression tests.

A leaked refresh token requires family or grant revocation and reuse investigation. A leaked signing key may require rejecting all tokens signed by it, publishing new JWKS material, and coordinating safe retirement of the old key.

## A tested runbook

Document contacts, revocation authority, safe commands, evidence sources, communication templates, and closure criteria. Run a tabletop exercise for a token found in Git history, an error trace, or a frontend bundle. Measure detection and containment time.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How do PAR and JAR differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> PAR pushes parameters through a back channel and returns a reference; JAR packages them in a signed Request Object.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Does a JAR signature hide its data?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> No. It protects integrity and authenticity; confidentiality requires separate encryption and key policy.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>What does RAR add beyond a broad scope?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Structured transaction details that support more precise consent and policy decisions.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>What follows a leaked refresh token?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Revoke its family or grant, investigate reuse, contain the leak, rotate broader secrets if needed, and hunt suspicious use.</div></details></section>
</div>
