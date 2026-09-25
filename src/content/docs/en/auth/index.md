---
title: Security, Authentication & Authorization
description: Practical PHP security covering sessions, passwords, authorization, JWT, OAuth 2.0, OpenID Connect, and SSO.
sidebar:
  order: 0
---

# Security, Authentication & Authorization

This section expands pages **60–66 and 87–103** into a practical, modern security track.

1. [Session security](./01-session-security/)
2. [Input validation](./02-input-validation/)
3. [CSRF protection](./03-csrf/)
4. [XSS protection](./04-xss/)
5. [Password hashing](./05-password-hashing/)
6. [Encryption and HTTP authentication](./06-encryption-http-auth/)
7. [Authentication and authorization](./07-authentication-authorization/)
8. [JWT and secure validation](./08-jwt-security/)
9. [Federated identity, SSO, SAML, and OIDC](./09-federation-saml-oidc/)
10. [OAuth 2.0 concepts and tokens](./10-oauth-concepts-tokens/)
11. [Modern OAuth flows](./11-oauth-flows-pkce-device/)
12. [OAuth and OIDC security](./12-oauth-oidc-security/)
13. [Account lifecycle](./13-account-lifecycle/)
14. [MFA, TOTP, and passkeys](./14-mfa-passkeys/)
15. [API keys and machine identity](./15-api-keys-machine-identity/)
16. [ABAC, ReBAC, and tenant isolation](./16-advanced-authorization-multitenancy/)
17. [Rate limiting and abuse resistance](./17-rate-limiting-abuse/)
18. [Security logging and audit trails](./18-security-logging-audit/)
19. [Secrets and key management](./19-secrets-key-management/)
20. [Threat modeling and authorization testing](./20-threat-modeling-authorization-testing/) — Assets, trust boundaries, roles, ownership, and tenant matrices.
21. [Devices, sessions, breached passwords, and SCIM](./21-device-sessions-breached-passwords-scim/) — Session revocation, password screening, and enterprise provisioning.
22. [PAR, JAR, RAR, and token incidents](./22-par-jar-rar-token-incidents/) — Advanced OAuth requests and incident runbooks for leaked credentials.

Treat browser, API, cookie, header, uploaded, and legacy database data as untrusted. Validate at the boundary and encode for the exact output context.

## Standards

- [JWT - RFC 7519](https://www.rfc-editor.org/info/rfc7519/) and [JWT BCP - RFC 8725](https://www.rfc-editor.org/info/rfc8725/)
- [OAuth 2.0 - RFC 6749](https://www.rfc-editor.org/info/rfc6749/) and [Security BCP - RFC 9700](https://www.rfc-editor.org/info/rfc9700/)
- [PKCE - RFC 7636](https://www.rfc-editor.org/info/rfc7636/) and [Device Authorization - RFC 8628](https://www.rfc-editor.org/info/rfc8628/)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0-18.html)
- [SAML 2.0 Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
