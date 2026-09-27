---
title: 11. Modern OAuth flows
description: Authorization Code with PKCE, Client Credentials, Device Authorization, refresh tokens, and obsolete grants.
sidebar:
  order: 11
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **Token:** A value representing identity or permission without resending a password.
- **CLI:** A text-based interface controlled by typed commands.
- **Scope:** A named permission requested or granted to a client, such as orders:read; it does not by itself prove ownership of an order.
- **Function:** A named, reusable block of code with one defined job.


- **Authentication:** Confirming that a user owns an identity.
- **Authorization:** Deciding which actions an identity may perform.
- **OAuth:** A delegation protocol granting limited access without sharing a password.
- **OIDC:** An identity layer over OAuth that identifies who signed in.
- **SAML:** A standard for exchanging sign-in information between services.
- **MFA:** Using more than one independent sign-in factor.
- **Secret:** A sensitive value such as an API key or service password.

# Match the flow to the client

```text
User + web/browser/native -> Authorization Code + PKCE
Service to service       -> Client Credentials
TV/CLI without browser   -> Device Authorization
Renew previous access    -> Refresh Token
```

## Authorization Code + PKCE

```text
Browser        Client             Authorization Server
  |              |                         |
  |--- start --->|-- authorize + challenge|
  |<------------- redirect to login -------|
  |------------- login/consent ----------->|
  |<---- redirect: code + state ------------|
  |-- callback -->|-- code + verifier ------>|
  |              |<-- access/refresh token--|
```

```php
function base64Url(string $bytes): string
{
    return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
}

$codeVerifier = base64Url(random_bytes(32));
$codeChallenge = base64Url(hash('sha256', $codeVerifier, true));
$state = base64Url(random_bytes(32));
$nonce = base64Url(random_bytes(32));

$_SESSION['oauth'] = [
    'state' => hash('sha256', $state),
    'verifier' => $codeVerifier,
    'nonce' => $nonce,
    'created_at' => time(),
];
```

Send `response_type=code`, exact redirect URI, scopes, state, OIDC nonce, code challenge, and `code_challenge_method=S256`. At callback, consume the bound state once, then exchange the code with the verifier through the token endpoint.

PKCE binds a code to the client instance that started the transaction. Use a new high-entropy verifier and S256 for every attempt.

## Client Credentials

Use this for a confidential service acting as itself:

```http
POST /oauth/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Authorization: Basic BASE64(client_id:client_secret)

grant_type=client_credentials&scope=reports:write
```

There is no end user. Prefer independent workload identities and consider mTLS or `private_key_jwt` for stronger client authentication.

## Device Authorization

A constrained device obtains a secret `device_code`, a human `user_code`, and a verification URI. The user approves on a second device while the original device polls.

Respect the returned polling interval. Increase it by five seconds on `slow_down`, and stop on denial or expiration.

## Refresh Token

Send refresh tokens only to the token endpoint and never request broader scope. Rotation replaces each used refresh token and detects reuse of an older member of the token family.

## Assertion grants

RFC 7522 can exchange a SAML bearer assertion as an OAuth grant or use it for client authentication. This is a federation bridge, not the default SAML browser SSO flow. Validate signature, issuer, audience, time, and replay.

## Do not start new systems with these

- The Implicit Grant exposes access tokens through the front channel; use Authorization Code + PKCE.
- The Resource Owner Password Credentials grant exposes user passwords to clients and is incompatible with modern MFA/WebAuthn. The OAuth Security BCP says it must not be used.

## Security scenario

<details><summary>What does PKCE prevent?</summary><p>It binds an authorization code to the initiating client, so an interceptor cannot redeem it without the verifier.</p></details>

## Threat drill

**Scenario:** An attacker intercepts an authorization code for a public client and tries to redeem it first.

**Negative test:** Start a PKCE flow, then redeem the code without <code>code_verifier</code> and with a value that does not match the challenge.

**Expected result:** Both attempts fail; only the original verifier with the exact redirect URI is accepted.

### Verification source

- [RFC 7636: Proof Key for Code Exchange](https://www.rfc-editor.org/rfc/rfc7636.html)

## Connect the ideas

Require PKCE S256 rather than plain, binding code to client, redirect URI, and verifier. Device flow is vulnerable to user-code phishing, so display service/client identity and enforce interval plus expiry. Rotate refresh tokens and detect reuse to revoke the family; do not start new implicit or password-grant designs.

### Try it yourself

Test a wrong verifier, expired device code, and reused refresh token.
