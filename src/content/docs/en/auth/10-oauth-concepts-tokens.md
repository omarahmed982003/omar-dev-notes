---
title: 10. OAuth 2.0 concepts and tokens
description: Delegated authorization, roles, scopes, consent, client types, access tokens, and refresh tokens.
sidebar:
  order: 10
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **TLS:** An encryption layer that protects data while it moves between two parties.
- **API:** A defined interface through which one program requests data or actions from another.
- **Token:** A value representing identity or permission without resending a password.
- **Scope:** A named permission requested or granted to a client, such as orders:read; it does not by itself prove ownership of an order.


- **Authentication:** Confirming that a user owns an identity.
- **Authorization:** Deciding which actions an identity may perform.
- **Encryption:** A reversible transformation requiring the correct key.
- **JWT:** A signed token format; signing does not encrypt its contents.
- **OAuth:** A delegation protocol granting limited access without sharing a password.
- **OIDC:** An identity layer over OAuth that identifies who signed in.
- **Secret:** A sensitive value such as an API key or service password.

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

## Security scenario

<details><summary>Is an access token proof of application login?</summary><p>Not necessarily; it delegates API access. Use OIDC and a validated ID token for user identity.</p></details>

## Threat drill

**Scenario:** A client presents an access token meant for another service or lacking the required permission.

**Negative test:** Send a token with the wrong audience, then a valid token without the required scope.

**Expected result:** The first is rejected as invalid and the second as insufficient scope; an access token is not treated as proof of user login.

### Verification source

- [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html)

## Connect the ideas

A resource indicator or audience identifies the intended API and prevents a token for one service from working at another. Introspection supports opaque tokens or central decisions, while revocation invalidates a grant with a defined propagation delay. Consent does not replace least privilege, and scopes are not automatically internal roles.

### Try it yourself

Send a token from the same issuer but for another resource and confirm rejection.
