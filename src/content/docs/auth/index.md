---
title: الأمان والمصادقة والصلاحيات
description: مسار عملي لأمان PHP والجلسات وكلمات المرور والصلاحيات وJWT وOAuth 2.0 وOpenID Connect وSSO.
sidebar:
  order: 0
---

# الأمان والمصادقة والصلاحيات

يغطي هذا القسم الصفحات **60–66 و87–103** من الملاحظات، مع تصحيح النقاط الأمنية وتوسيعها إلى تطبيقات عملية وفق الممارسات الحديثة.

## خريطة الدروس

1. [حماية الجلسات](./01-session-security/) — Fixation وHijacking وتغيير المعرّف والكوكي الآمنة.
2. [التحقق من المدخلات والفلترة](./02-input-validation/) — Validation مقابل Sanitization ودوال Filter.
3. [الحماية من CSRF](./03-csrf/) — Tokens وSameSite وطرق التحقق.
4. [الحماية من XSS](./04-xss/) — Output Encoding حسب السياق وHTML Sanitization.
5. [كلمات المرور وHashing](./05-password-hashing/) — bcrypt وArgon2id والتحقق وإعادة الـhash.
6. [Encryption وHTTP Authentication](./06-encryption-http-auth/) — المفاتيح وAEAD وBasic/Bearer.
7. [المصادقة والصلاحيات عمليًا](./07-authentication-authorization/) — RBAC والملكية والسياسات والدفاع متعدد الطبقات.
8. [JWT والتحقق الآمن](./08-jwt-security/) — البنية والتوقيع والـClaims والتحقق وإدارة المفاتيح.
9. [Federated Identity وSSO وSAML وOIDC](./09-federation-saml-oidc/) — الفصل بين البروتوكولات واختيار المناسب.
10. [مفاهيم OAuth 2.0 والتوكينات](./10-oauth-concepts-tokens/) — الأدوار والـClients والـScopes وAccess/Refresh Tokens.
11. [OAuth Flows الحديثة](./11-oauth-flows-pkce-device/) — Authorization Code + PKCE وClient Credentials وDevice Flow.
12. [أمان OAuth وOIDC](./12-oauth-oidc-security/) — State وNonce وRedirect URIs وتخزين التوكينات والإبطال.
13. [دورة حياة الحساب](./13-account-lifecycle/) — التسجيل والتأكيد والاسترجاع وإلغاء الجلسات.
14. [MFA وTOTP وPasskeys](./14-mfa-passkeys/) — العوامل وWebAuthn وRecovery وStep-up.
15. [API Keys وهوية الأنظمة](./15-api-keys-machine-identity/) — التخزين والـScopes والدوران وService Accounts.
16. [ABAC وReBAC وعزل الـTenants](./16-advanced-authorization-multitenancy/) — السياسات المتقدمة ومنع IDOR.
17. [Rate Limiting ومقاومة الإساءة](./17-rate-limiting-abuse/) — الخوارزميات وحماية login وسياسة الفشل.
18. [Security Logging وAudit Trail](./18-security-logging-audit/) — الأحداث والتنقية والسلامة والتنبيهات.
19. [إدارة الأسرار والمفاتيح](./19-secrets-key-management/) — Secret managers وrotation وenvelope encryption.

:::danger[قاعدة أساسية]
كل ما يأتي من المتصفح أو API أو Cookie أو Header أو قاعدة بيانات قديمة يُعامل كبيانات غير موثوقة حتى يُتحقق منه، ثم يُرمّز عند موضع الإخراج المناسب.
:::

## مراجع المعايير

- [JWT - RFC 7519](https://www.rfc-editor.org/info/rfc7519/) و[أفضل ممارساته - RFC 8725](https://www.rfc-editor.org/info/rfc8725/)
- [OAuth 2.0 - RFC 6749](https://www.rfc-editor.org/info/rfc6749/) و[Security BCP - RFC 9700](https://www.rfc-editor.org/info/rfc9700/)
- [PKCE - RFC 7636](https://www.rfc-editor.org/info/rfc7636/) و[Device Authorization - RFC 8628](https://www.rfc-editor.org/info/rfc8628/)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0-18.html)
- [SAML 2.0 Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
