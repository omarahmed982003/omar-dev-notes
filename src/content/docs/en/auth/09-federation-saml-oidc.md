---
title: 9. Federated identity, SSO, SAML, and OIDC
description: Federation and single sign-on, IdP/SP roles, SAML assertions, and OpenID Connect identity.
sidebar:
  order: 9
---

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
