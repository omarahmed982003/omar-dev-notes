---
title: Security, Authentication & Authorization
description: Practical PHP security covering sessions, passwords, authorization, JWT, OAuth 2.0, OpenID Connect, and SSO.
sidebar:
  order: 0
---

# Security, Authentication & Authorization

This path begins with protecting a user session, then moves through sign-in, permissions, and advanced security protocols. Each part explains the risk, the defense, and how to verify that the defense works.

1. [Session security](/en/auth/01-session-security/)
2. [Input validation](/en/auth/02-input-validation/)
3. [CSRF protection](/en/auth/03-csrf/)
4. [XSS protection](/en/auth/04-xss/)
5. [Password hashing](/en/auth/05-password-hashing/)
6. [Encryption and HTTP authentication](/en/auth/06-encryption-http-auth/)
7. [Authentication and authorization](/en/auth/07-authentication-authorization/)
8. [JWT and secure validation](/en/auth/08-jwt-security/)
9. [Federated identity, SSO, SAML, and OIDC](/en/auth/09-federation-saml-oidc/)
10. [OAuth 2.0 concepts and tokens](/en/auth/10-oauth-concepts-tokens/)
11. [Modern OAuth flows](/en/auth/11-oauth-flows-pkce-device/)
12. [OAuth and OIDC security](/en/auth/12-oauth-oidc-security/)
13. [Account lifecycle](/en/auth/13-account-lifecycle/)
14. [MFA, TOTP, and passkeys](/en/auth/14-mfa-passkeys/)
15. [API keys and machine identity](/en/auth/15-api-keys-machine-identity/)
16. [ABAC, ReBAC, and tenant isolation](/en/auth/16-advanced-authorization-multitenancy/)
17. [Rate limiting and abuse resistance](/en/auth/17-rate-limiting-abuse/)
18. [Security logging and audit trails](/en/auth/18-security-logging-audit/)
19. [Secrets and key management](/en/auth/19-secrets-key-management/)
20. [Threat modeling and authorization testing](/en/auth/20-threat-modeling-authorization-testing/) — Assets, trust boundaries, roles, ownership, and tenant matrices.
21. [Devices, sessions, breached passwords, and SCIM](/en/auth/21-device-sessions-breached-passwords-scim/) — Session revocation, password screening, and enterprise provisioning.
22. [PAR, JAR, RAR, and token incidents](/en/auth/22-par-jar-rar-token-incidents/) — Advanced OAuth requests and incident runbooks for leaked credentials.

Treat browser, API, cookie, header, uploaded, and legacy database data as untrusted. Validate at the boundary and encode for the exact output context.

## Standards

- [JWT - RFC 7519](https://www.rfc-editor.org/info/rfc7519/) and [JWT BCP - RFC 8725](https://www.rfc-editor.org/info/rfc8725/)
- [OAuth 2.0 - RFC 6749](https://www.rfc-editor.org/info/rfc6749/) and [Security BCP - RFC 9700](https://www.rfc-editor.org/info/rfc9700/)
- [PKCE - RFC 7636](https://www.rfc-editor.org/info/rfc7636/) and [Device Authorization - RFC 8628](https://www.rfc-editor.org/info/rfc8628/)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0-18.html)
- [SAML 2.0 Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)


## Follow one account through the boundaries

Run `php auth-journey.php` from the [local lab](/en/php/00-lab-setup/). Read it after sessions, password hashing, authorization, and account recovery. It uses SQLite 3.35+ (`DELETE … RETURNING`) and the shared inventory schema. The program creates a temporary account, rejects a wrong password, issues a random opaque session, checks expiry, buys an order with the authenticated user ID, denies another user ownership, retries the same order, resets the password once, and revokes earlier sessions. The outbox still contains one event. A structured audit event goes to stderr without any password, session, or reset token.

The raw session/reset token is a 32-byte random secret encoded as hex; only its SHA-256 digest is stored. Unlike a human password, such a high-entropy token does not need a deliberately slow password hash. Reset consumption, password change, and session revocation share a transaction; if any write fails, all are rolled back. An atomic DELETE returning the user ID prevents two consumers from both taking the same token.

Trace the boundary: login establishes identity; the query `WHERE id=? AND user_id=?` enforces ownership; an idempotency key prevents duplicate business effects; the audit event records the outcome without credentials. A random session is freshly issued after password verification instead of accepting a caller-selected authenticated session ID.

This is a complete local state-flow example, not a deployable authentication server. Token delivery is simulated in memory; no email is sent. HTTP cookies, CSRF, rate limiting, account-enumeration resistance, password policy, and provider integration belong to the corresponding lessons and must be implemented before exposing endpoints. The length check here is a small explicit demo policy, not a full password policy. Exercise: move `$now` beyond reset expiry and verify reset fails without changing the old password or sessions. Then inject an exception before commit and verify rollback preserves every prior state.
