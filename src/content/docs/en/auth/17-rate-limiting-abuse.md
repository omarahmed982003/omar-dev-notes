---
title: 17. Rate limiting and abuse resistance
description: Fixed/sliding windows, token buckets, login defenses, credential stuffing, CAPTCHA, and failure policy.
sidebar:
  order: 17
---

## Choose a key per operation

IP alone is insufficient because users share NAT and attackers distribute traffic. Combine signals: account and network for login, contact and network for reset, key/tenant/endpoint for APIs, and user plus cost for expensive searches. Keep a global capacity limit.

## Algorithms

Fixed windows are simple but burst at boundaries. Sliding windows are more precise and expensive. Token buckets allow controlled bursts; leaky buckets smooth output. Updates must be atomic in shared storage across servers.

Return `429 Too Many Requests` and an appropriate `Retry-After` without revealing account existence.

## Login abuse

Avoid permanent lockouts that let attackers deny access to victims. Use progressive delay, layered limits, breach-aware password policy, MFA/passkeys, and user notification for unusual activity.

CAPTCHA adds friction but is not complete proof of humanity. Trigger it from risk signals and account for accessibility and privacy.

Define fail-open or fail-closed behavior when the limiter store is unavailable. A privileged login and a public read endpoint need different policy.

