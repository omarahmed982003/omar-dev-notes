---
title: 9. Federated identity, SSO, SAML, and OIDC
description: Federation and single sign-on, IdP/SP roles, SAML assertions, and OpenID Connect identity.
sidebar:
  order: 9
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **API:** A defined interface through which one program requests data or actions from another.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **Token:** A value representing identity or permission without resending a password.
- **Scope:** A named permission requested or granted to a client, such as orders:read; it does not by itself prove ownership of an order.


- **Authentication:** Confirming that a user owns an identity.
- **Authorization:** Deciding which actions an identity may perform.
- **OAuth:** A delegation protocol granting limited access without sharing a password.
- **OIDC:** An identity layer over OAuth that identifies who signed in.
- **SAML:** A standard for exchanging sign-in information between services.

# Federation is not one protocol

Federated identity lets an application rely on an external identity provider. Single Sign-On is the experience of reaching multiple applications after a central sign-in.

```text
User -> Application / Service Provider
        -> Identity Provider
        <- signed identity result
     <- local session
```

## Separate the protocols

| Technology | Primary purpose | Typical result |
|---|---|---|
| OAuth 2.0 | delegated API authorization | access token |
| OpenID Connect | authentication layered on OAuth | ID token and identity claims |
| SAML 2.0 | XML identity/assertion exchange, common in enterprise SSO | SAML response/assertion |

OAuth alone is not a login protocol. Inferring identity from an arbitrary access token endpoint creates unsafe pseudo-authentication; use OIDC.

## SAML browser SSO

The Identity Provider authenticates the user and issues an assertion. The Service Provider validates it and creates its own session.

```text
Browser -> SP: protected page
SP -> Browser -> IdP: AuthnRequest
IdP authenticates user
IdP -> Browser -> SP ACS: SAMLResponse
SP validates response/assertion and creates a session
```

Validate the XML signature with trusted IdP metadata, issuer, audience restriction, recipient/destination, time conditions, and `InResponseTo` where applicable. Detect replay by assertion ID. Use a mature SAML library and safe XML parsing; do not implement XML signatures yourself.

## OpenID Connect

The `openid` scope makes an OAuth authorization request an OIDC request:

```text
scope=openid profile email
```

- ID token: authentication result for the client.
- Access token: authorization credential for an API.
- UserInfo: optional additional claims obtained with an access token.

Never substitute an ID token as the API's access token.

## Validate an ID token

1. Use metadata rooted in a preconfigured trusted issuer.
2. Verify the signature with that issuer's JWKS.
3. Exactly match `iss` and require the client ID in `aud`.
4. Check expiration and relevant time claims.
5. Match the transaction-specific `nonce`.
6. Apply `azp` rules for multiple audiences.
7. Require UserInfo `sub` to match the ID-token subject.

An email can change and may be unverified. Use the pair `iss + sub` as the stable external identity key.

Choose OIDC for modern web/mobile login, SAML where enterprise federation requires it, and OAuth for delegated API access. Security depends on exact validation and trust configuration, not the protocol name alone.

## Security scenario

<details><summary>Who authenticates the user in federation?</summary><p>The identity provider authenticates; the relying party validates the assertion or ID token and creates its session.</p></details>

## Threat drill

**Scenario:** A correctly signed identity response arrives for a different client or login transaction.

**Negative test:** Test a different <code>audience</code>, a stale <code>nonce</code>, and an unregistered redirect URI.

**Expected result:** All cases fail, and the response is bound to the local request before a session is created.

### Verification source

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)

## Connect the ideas

For SAML, validate metadata, entity ID, Destination, Audience, InResponseTo, time, and the signature at the expected element to resist XML signature wrapping; do not hand-roll XML security. For OIDC, use trusted discovery/JWKS and pin issuer, client ID, redirect URI, and a small clock-skew allowance.

### Try it yourself

Test a signed assertion wrapping the wrong element and an ID token from another issuer.
