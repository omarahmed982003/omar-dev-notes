---
title: 10. مفاهيم OAuth 2.0 والتوكينات
description: التفويض المفوض والأدوار والـScopes والـConsent وأنواع Clients وAccess وRefresh Tokens.
sidebar:
  order: 10
---

# ما المشكلة التي يحلها OAuth؟

OAuth 2.0 إطار **تفويض مفوض**: يمنح المستخدم أو النظام Client وصولًا محدودًا إلى Resource Server دون تسليم كلمة مرور المستخدم للـClient.

مثال: تطبيق صور يطلب قراءة ملفات محددة من خدمة تخزين. المستخدم يصادق نفسه لدى خدمة التخزين، يوافق على النطاق، ويحصل التطبيق على access token محدود بدل كلمة المرور.

## الأدوار الأربعة

1. **Resource Owner:** الجهة القادرة على منح الوصول، وغالبًا المستخدم.
2. **Client:** التطبيق الذي يطلب الوصول؛ ليس “المستخدم”.
3. **Authorization Server:** يصادق الأطراف حسب الحاجة ويصدر التوكينات بعد التفويض.
4. **Resource Server:** الـAPI التي تستقبل access token وتحمي الموارد.

```text
Resource Owner -> Authorization Server: approve
Client -> Authorization Server: grant/code
Authorization Server -> Client: access token
Client -> Resource Server: token + API request
```

قد تكون Authorization Server وResource Server جزءًا من منتج واحد أو خدمتين مختلفتين.

## Client registration

يسجل العميل عادة:

- `client_id`: معرف عام، **ليس سرًا**.
- Redirect URIs دقيقة.
- نوع العميل وطرق authentication المسموحة.
- scopes/grants المسموحة وسياسات consent.

### Public وConfidential

- Public client: لا يستطيع حفظ secret، مثل native app أو JavaScript يعمل في المتصفح. تضمين `client_secret` في bundle لا يجعله سريًا.
- Confidential client: backend قادر على حماية credentials ويصادق نفسه عند token endpoint.

اسم النوع يصف قدرة حفظ السر، وليس ثقة أخلاقية أو مستوى صلاحية تلقائيًا.

## Scope وConsent

`scope` اسم صلاحية يطلبها Client:

```text
orders:read orders:write profile
```

صمم scopes حول capabilities واضحة وبأقل صلاحية. لا تجعل `admin` scope عامًا يختصر عشرات العمليات الحساسة بلا سبب.

Consent واجهة/قرار يمنح فيه Resource Owner وصولًا. لكنه ليس بديلًا عن سياسة Authorization Server؛ قد ترفض المؤسسة scope حتى لو وافق المستخدم، وقد يكون consent سابقًا أو إداريًا في machine-to-machine.

## Access token

Credential يقدمها Client إلى Resource Server:

```http
Authorization: Bearer eyJ...
```

- قد يكون opaque string أو JWT؛ OAuth لا يفرض صيغة واحدة.
- يجب تقييده بالمدة والجمهور والموارد والإجراءات.
- Bearer يعني أن من يحمله يمكنه استخدامه، لذلك خزنه وانقله كسر.
- API يجب أن تتحقق أنه موجه إليها وأن scope يسمح بالفعل، لا أن signature صحيحة فقط.

## Refresh token

Credential طويل الحساسية يستخدم عند token endpoint للحصول على access token جديد. لا يُرسل إلى Resource Server.

```text
Client --refresh token--> Authorization Server
Client <--new access token (+ rotated refresh token)--
```

لـpublic clients استخدم refresh-token rotation مع reuse detection أو sender-constraining حسب النظام. عند اكتشاف إعادة استخدام token قديم، ألغِ family كاملة واطلب تسجيل دخول جديدًا.

## API key ليست OAuth token

API key غالبًا تعرّف project/client وتستخدم للحصة أو خدمة بسيطة، ولا تمثل بالضرورة مستخدمًا أو consent أو scopes ديناميكية. تعامل معها كسر، لكن لا تسمها access token ولا تستخدمها لتسجيل دخول مستخدم.

## Token endpoint response

```json
{
  "access_token": "opaque-or-structured-value",
  "token_type": "Bearer",
  "expires_in": 300,
  "refresh_token": "long-lived-secret",
  "scope": "orders:read"
}
```

الاستجابة حساسة: استخدم TLS، أرسل `Cache-Control: no-store`، ولا تسجل الجسم. `expires_in` مدة من لحظة الاستلام؛ لا تفترض أن access token JWT أو تحاول parse opaque token.

## أخطاء مفاهيمية

- OAuth لا يثبت الهوية للتطبيق؛ OIDC يفعل.
- JWT صيغة token وليست بديلًا عن OAuth.
- Client ID ليس secret.
- Scope ليس Role داخليًا بالضرورة.
- Access token لا يذهب إلى صفحة login، وRefresh token لا يذهب إلى API.
- امتلاك token صالح لا يلغي فحص ملكية المورد وقواعد المجال.
