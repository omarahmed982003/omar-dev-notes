---
title: 10. OAuth 2.0 concepts and tokens
description: Delegated authorization, roles, scopes, consent, client types, access tokens, and refresh tokens.
sidebar:
  order: 10
---

# The problem OAuth solves

OAuth 2.0 is a delegated authorization framework. It lets a client obtain limited access to a resource server without receiving the resource owner's password.

## Four roles

1. Resource Owner: can grant access, often a user.
2. Client: application requesting access.
3. Authorization Server: issues tokens after authorization.
4. Resource Server: protected API accepting access tokens.

```text
Resource Owner -> Authorization Server: approve
Client -> Authorization Server: grant/code
Authorization Server -> Client: access token
Client -> Resource Server: token + API request
```

## Client registration and types

Registration commonly defines a public `client_id`, exact redirect URIs, allowed grants, and authentication methods.

- Public clients cannot keep a secret, including browser JavaScript and native apps.
- Confidential clients run on a backend capable of protecting credentials.

Putting a client secret into a distributed application does not make it confidential.

## Scope and consent

Scopes describe requested capabilities:

```text
orders:read orders:write profile
```

Use least privilege and clear capability names. Consent is the resource owner's approval experience, not a replacement for authorization-server policy.

## Access tokens

An access token is a credential presented to a resource server. It can be opaque or a JWT; OAuth does not require one format. Restrict it by lifetime, audience/resource, and scope. An API must enforce both intended audience and permitted action.

## Refresh tokens

A refresh token goes only to the authorization server's token endpoint to obtain a new access token. It never goes to the resource API.

```text
Client --refresh token--> Authorization Server
Client <--new access token (+ rotated refresh token)--
```

For public clients, use rotation with reuse detection or sender-constraining as appropriate.

## API keys differ

An API key often identifies a project or caller for quota and service access. It does not automatically model a user, consent, or dynamic scopes. Protect it as a secret, but do not call it user authentication.

```json
{
  "access_token": "opaque-or-structured-value",
  "token_type": "Bearer",
  "expires_in": 300,
  "refresh_token": "long-lived-secret",
  "scope": "orders:read"
}
```

Protect token responses with TLS and `Cache-Control: no-store`; never log them.

OAuth is not authentication, JWT is only a token format, a client ID is not secret, and token validity never replaces object ownership and domain-policy checks.
