---
title: 11. Modern OAuth flows
description: Authorization Code with PKCE, Client Credentials, Device Authorization, refresh tokens, and obsolete grants.
sidebar:
  order: 11
---

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
