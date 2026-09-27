---
title: 17. Rate limiting and abuse resistance
description: Fixed/sliding windows, token buckets, login defenses, credential stuffing, CAPTCHA, and failure policy.
sidebar:
  order: 17
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **IP:** A numeric address that identifies a device or network interface.
- **Token:** A value representing identity or permission without resending a password.


## Choose a key per operation

IP alone is insufficient because users share NAT and attackers distribute traffic. Combine signals: account and network for login, contact and network for reset, key/tenant/endpoint for APIs, and user plus cost for expensive searches. Keep a global capacity limit.

## Algorithms

Fixed windows are simple but burst at boundaries. Sliding windows are more precise and expensive. Token buckets allow controlled bursts; leaky buckets smooth output. Updates must be atomic in shared storage across servers.

Return `429 Too Many Requests` and an appropriate `Retry-After` without revealing account existence.

## Login abuse

Avoid permanent lockouts that let attackers deny access to victims. Use progressive delay, layered limits, breach-aware password policy, MFA/passkeys, and user notification for unusual activity.

CAPTCHA adds friction but is not complete proof of humanity. Trigger it from risk signals and account for accessibility and privacy.

Define fail-open or fail-closed behavior when the limiter store is unavailable. A privileged login and a public read endpoint need different policy.

## Security scenario

<details><summary>Is IP-only rate limiting enough?</summary><p>No. Shared addresses and botnets make IP only one signal; combine identity, device, route, and operation cost.</p></details>

## Threat drill

**Scenario:** An attacker distributes login attempts across many IP addresses to evade a simple per-IP counter.

**Negative test:** Send a burst against one account from different sources, then a legitimate request for another account.

**Expected result:** The attack is delayed or blocked using account-aware signals while the other user still works; the defense does not become a global denial of service.

### Verification source

- [OWASP Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

## Connect the ideas

A distributed limiter needs atomic shared state or an approximation-tolerant design, including clock skew and failover behavior. Trust X-Forwarded-For only from known proxies. Add cost-based limits for expensive work across account, device, and IP, while ensuring the defense does not become denial of service for legitimate users.

### Try it yourself

Run the limiter on two nodes and simulate shared-store loss plus IP rotation.
