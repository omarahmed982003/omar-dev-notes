---
title: الأمان والمصادقة والصلاحيات
description: مسار عملي لأمان PHP والجلسات وكلمات المرور والصلاحيات وJWT وOAuth 2.0 وOpenID Connect وSSO.
sidebar:
  order: 0
---

# الأمان والمصادقة والصلاحيات

المسار ده يبدأ من حماية جلسة المستخدم، وبعدها يتدرج إلى تسجيل الدخول والصلاحيات والبروتوكولات الأمنية المتقدمة. كل جزء يوضح الخطر الأول، ثم طريقة الحماية، ثم إزاي تتأكد إن الحماية شغالة.

## خريطة الدروس

1. [حماية الجلسات](/auth/01-session-security/) — Fixation وHijacking وتغيير المعرّف والكوكي الآمنة.
2. [التحقق من المدخلات والفلترة](/auth/02-input-validation/) — Validation مقابل Sanitization ودوال Filter.
3. [الحماية من CSRF](/auth/03-csrf/) — Tokens وSameSite وطرق التحقق.
4. [الحماية من XSS](/auth/04-xss/) — Output Encoding حسب السياق وHTML Sanitization.
5. [كلمات المرور وHashing](/auth/05-password-hashing/) — bcrypt وArgon2id والتحقق وإعادة الـhash.
6. [Encryption وHTTP Authentication](/auth/06-encryption-http-auth/) — المفاتيح وAEAD وBasic/Bearer.
7. [المصادقة والصلاحيات عمليًا](/auth/07-authentication-authorization/) — RBAC والملكية والسياسات والدفاع متعدد الطبقات.
8. [JWT والتحقق الآمن](/auth/08-jwt-security/) — البنية والتوقيع والـClaims والتحقق وإدارة المفاتيح.
9. [Federated Identity وSSO وSAML وOIDC](/auth/09-federation-saml-oidc/) — الفصل بين البروتوكولات واختيار المناسب.
10. [مفاهيم OAuth 2.0 والتوكينات](/auth/10-oauth-concepts-tokens/) — الأدوار والـClients والـScopes وAccess/Refresh Tokens.
11. [OAuth Flows الحديثة](/auth/11-oauth-flows-pkce-device/) — Authorization Code + PKCE وClient Credentials وDevice Flow.
12. [أمان OAuth وOIDC](/auth/12-oauth-oidc-security/) — State وNonce وRedirect URIs وتخزين التوكينات والإبطال.
13. [دورة حياة الحساب](/auth/13-account-lifecycle/) — التسجيل والتأكيد والاسترجاع وإلغاء الجلسات.
14. [MFA وTOTP وPasskeys](/auth/14-mfa-passkeys/) — العوامل وWebAuthn وRecovery وStep-up.
15. [API Keys وهوية الأنظمة](/auth/15-api-keys-machine-identity/) — التخزين والـScopes والدوران وService Accounts.
16. [ABAC وReBAC وعزل الـTenants](/auth/16-advanced-authorization-multitenancy/) — السياسات المتقدمة ومنع IDOR.
17. [Rate Limiting ومقاومة الإساءة](/auth/17-rate-limiting-abuse/) — الخوارزميات وحماية login وسياسة الفشل.
18. [Security Logging وAudit Trail](/auth/18-security-logging-audit/) — الأحداث والتنقية والسلامة والتنبيهات.
19. [إدارة الأسرار والمفاتيح](/auth/19-secrets-key-management/) — Secret managers وrotation وenvelope encryption.
20. [Threat Modeling واختبار الصلاحيات](/auth/20-threat-modeling-authorization-testing/) — أصول وحدود ثقة ومصفوفة أدوار وملكية وTenants.
21. [الأجهزة والجلسات وكلمات المرور المسربة وSCIM](/auth/21-device-sessions-breached-passwords-scim/) — إبطال الجلسات وBreached Passwords وProvisioning مؤسسي.
22. [PAR وJAR وRAR وحوادث التوكينات](/auth/22-par-jar-rar-token-incidents/) — طلبات OAuth المتقدمة وRunbook لتسريب Tokens وKeys.

:::danger[قاعدة أساسية]
كل ما يأتي من المتصفح أو API أو Cookie أو Header أو قاعدة بيانات قديمة يُعامل كبيانات غير موثوقة حتى يُتحقق منه، ثم يُرمّز عند موضع الإخراج المناسب.
:::

## مراجع المعايير

- [JWT - RFC 7519](https://www.rfc-editor.org/info/rfc7519/) و[أفضل ممارساته - RFC 8725](https://www.rfc-editor.org/info/rfc8725/)
- [OAuth 2.0 - RFC 6749](https://www.rfc-editor.org/info/rfc6749/) و[Security BCP - RFC 9700](https://www.rfc-editor.org/info/rfc9700/)
- [PKCE - RFC 7636](https://www.rfc-editor.org/info/rfc7636/) و[Device Authorization - RFC 8628](https://www.rfc-editor.org/info/rfc8628/)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0-18.html)
- [SAML 2.0 Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
- [SCIM Protocol - RFC 7644](https://www.rfc-editor.org/info/rfc7644/) و[PAR - RFC 9126](https://www.rfc-editor.org/info/rfc9126/)
- [JAR - RFC 9101](https://www.rfc-editor.org/info/rfc9101/) و[RAR - RFC 9396](https://www.rfc-editor.org/info/rfc9396/)


## تابع حسابًا واحدًا عبر حدود النظام

شغّل `php auth-journey.php` من [المختبر المحلي](/php/00-lab-setup/). اقرأه بعد الجلسات والـhash والصلاحيات واستعادة الحساب. يحتاج SQLite 3.35+ لاستخدام `DELETE … RETURNING`، ويستخدم نفس مخطط المخزون. البرنامج ينشئ حسابًا مؤقتًا، يرفض كلمة خاطئة، يصدر جلسة عشوائية، يفحص انتهاءها، ينشئ طلبًا بهوية المستخدم المتحقق منها، يمنع مستخدمًا آخر من قراءته، يعيد نفس الطلب، يغير كلمة السر مرة واحدة ويلغي الجلسات القديمة. يفضل في outbox حدث واحد. حدث التدقيق يذهب إلى stderr بلا كلمة سر أو توكين جلسة أو استرجاع.

توكين الجلسة والاسترجاع سر عشوائي من 32 بايت ممثل بالنظام الست عشري؛ قاعدة البيانات تحفظ SHA-256 له فقط. بعكس كلمة السر البشرية، التوكين عالي العشوائية مش محتاج password hash بطيئًا عمدًا. استهلاك توكين الاسترجاع وتغيير كلمة السر وإلغاء الجلسات في معاملة واحدة؛ فشل كتابة يلغي الجميع. DELETE ذرية ترجع user_id تمنع مستهلكين من أخذ نفس التوكين.

تتبّع الحد: تسجيل الدخول يثبت الهوية، و`WHERE id=? AND user_id=?` يفرض الملكية، ومفتاح idempotency يمنع تكرار الأثر التجاري، وسجل التدقيق يثبت النتيجة بلا بيانات اعتماد. الجلسة تصدر عشوائيًا بعد التحقق بدل قبول معرّف جلسة مصادق عليها اختاره المستدعي.

ده مثال محلي كامل لتدفق الحالة، مش خادم مصادقة جاهز للنشر. تسليم التوكين محاكاة في الذاكرة ولا يُرسل بريد. Cookies وCSRF وتحديد المعدل ومنع كشف وجود الحساب وسياسة كلمات المرور وتكامل المزود تتطبق حسب دروسها قبل فتح endpoints. حد الطول هنا سياسة تجريبية صغيرة معلنة، مش سياسة كلمات مرور كاملة. تدريب: زوّد `$now` بعد انتهاء توكين الاسترجاع، وتأكد أن الرفض لا يغير كلمة السر أو الجلسات. ثم ارمِ استثناء قبل commit وتحقق من بقاء كل الحالة السابقة بسبب rollback.
