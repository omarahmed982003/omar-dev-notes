---
title: 9. Federated Identity وSSO وSAML وOIDC
description: الهوية الاتحادية وتسجيل الدخول الموحد وأدوار IdP وSP ومقارنة SAML مع OpenID Connect.
sidebar:
  order: 9
---

# الهوية الاتحادية ليست بروتوكولًا واحدًا

**Federated Identity** علاقة ثقة تسمح لتطبيق بالاعتماد على جهة خارجية لإثبات هوية المستخدم. **Single Sign-On (SSO)** تجربة يستطيع فيها المستخدم الوصول إلى عدة تطبيقات بعد عملية دخول مركزية، لكنه قد يُنفذ داخل مؤسسة أو عبر اتحاد هويات.

```text
User -> Application / Service Provider
        -> Identity Provider
        <- signed identity result
     <- local session
```

التطبيق لا يشارك كلمة مرور المستخدم مع كل خدمة؛ يثق في نتيجة موقعة ومقيدة بجمهور ووقت محددين.

## OAuth وOIDC وSAML

| التقنية | الهدف الأساسي | النتيجة المعتادة |
|---|---|---|
| OAuth 2.0 | تفويض وصول عميل إلى Resource Server | Access token |
| OpenID Connect | مصادقة مبنية فوق OAuth 2.0 | ID token + معلومات هوية |
| SAML 2.0 | تبادل Assertions للهوية/الصفات، شائع في Enterprise SSO | SAML Response/Assertion XML |

:::caution[التصحيح الأهم]
OAuth وحده ليس بروتوكول Login. استخدام access token وendpoint عشوائي لاستنتاج هوية المستخدم يسمى أحيانًا pseudo-authentication وقد يؤدي لخلط المستخدم أو الجمهور. استخدم OIDC للمصادقة.
:::

## SAML Web Browser SSO

الأطراف الرئيسية:

- **Identity Provider (IdP):** يصادق المستخدم ويصدر assertion.
- **Service Provider (SP):** التطبيق الذي يستهلك النتيجة وينشئ جلسة محلية.
- **Assertion:** XML موقّع يحوي subject وconditions وattributes.

تدفق SP-initiated مبسط:

```text
Browser -> SP: protected page
SP -> Browser -> IdP: AuthnRequest
IdP authenticates user
IdP -> Browser -> SP ACS: SAMLResponse
SP validates response/assertion
SP creates local session
```

التحقق يجب أن يشمل XML signature من شهادة IdP الموثوقة، `Issuer`، `AudienceRestriction`، `Recipient/Destination`، حدود الزمن، و`InResponseTo` عند استخدام request. امنع replay وسجل assertion ID. استخدم مكتبة SAML ناضجة وعطّل external entities؛ XML Signature معقدة ولا تُنفذ يدويًا.

## OpenID Connect

OIDC يضيف طبقة هوية إلى OAuth. وجود `openid` داخل `scope` يحول الطلب إلى طلب OIDC:

```text
scope=openid profile email
```

النواتج:

- **ID token:** موجه إلى الـClient ويخبره بنتيجة المصادقة.
- **Access token:** موجه إلى API/Resource Server؛ لا تستخدم ID token بدلًا منه.
- **UserInfo endpoint:** معلومات إضافية اختيارية باستخدام access token.

Claims شائعة: `sub` و`iss` و`aud` و`exp` و`auth_time`، ومع scopes مناسبة قد تظهر `name` و`email`. الـscope طلب لمجموعة claims/صلاحيات وليس ضمانًا أن كل قيمة موجودة.

## تحقق ID token

1. اكتشف metadata من issuer موثوق مسبقًا.
2. تحقق من التوقيع عبر JWKS لهذا issuer.
3. طابق `iss` حرفيًا و`aud` مع `client_id`.
4. افحص `exp` و`iat` و`nbf` إن وُجد.
5. طابق `nonce` مع المعاملة التي بدأت في المتصفح.
6. طبّق قواعد `azp` عندما توجد جماهير متعددة.
7. إذا استخدمت UserInfo، يجب أن يطابق `sub` قيمة ID token.

`email` قابل للتغيير وقد لا يكون verified؛ استخدم `iss + sub` كمفتاح هوية خارجي ثابت.

## متى أختار ماذا؟

- تكامل حديث لتطبيقات Web/Mobile وAPIs: OIDC غالبًا.
- Enterprise قديم/مؤسسات تعتمد XML وSAML metadata: SAML 2.0.
- منح تطبيق حق الوصول إلى API دون الحاجة لهوية مستخدم: OAuth 2.0.

ليس SAML “غير آمن لأنه قديم” ولا OIDC آمنًا تلقائيًا. الخطر في validation ناقص، trust غير مضبوط، redirect غير دقيق، أو مكتبة غير محدثة.
