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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: مفاهيم OAuth 2.0 والتوكينات">
<p class="lesson-diagram-title">خريطة مفاهيم: مفاهيم OAuth 2.0 والتوكينات</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>الأدوار الأربعة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Client registration</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Scope وConsent</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Access token</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Refresh token</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «الأدوار الأربعة» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Resource Owner: الجهة القادرة على منح الوصول، وغالبًا المستخدم. Client: التطبيق الذي يطلب الوصول؛ ليس “المستخدم”. Authorization Server: يصادق الأطراف حسب الحاجة ويصدر التوكينات بعد التفويض. Resource Server: الـAPI التي تستقبل access token وتحمي الموارد. قد تكون Authorization Server وResource Server جزءًا من منتج واحد أو خدمتين مختلفتين. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «الأدوار الأربعة» و«Client registration». لماذا لا يغني أحدهما عن الآخر داخل موضوع «مفاهيم OAuth 2.0 والتوكينات»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «الأدوار الأربعة»: Resource Owner: الجهة القادرة على منح الوصول، وغالبًا المستخدم. Client: التطبيق الذي يطلب الوصول؛ ليس “المستخدم”. Authorization Server: يصادق الأطراف حسب الحاجة ويصدر التوكينات بعد التفويض. Resource Server: الـAPI التي تستقبل access token وتحمي الموارد. قد تكون Authorization Server وResource Server جزءًا من منتج واحد أو خدمتين مختلفتين. أما «Client registration»: يسجل العميل عادة: client_id: معرف عام، ليس سرًا. Redirect URIs دقيقة. نوع العميل وطرق authentication المسموحة. scopes/grants المسموحة وسياسات consent. Public وConfidential Public client: لا يستطيع حفظ secret، مثل native app أو JavaScript يعمل في المتصفح. تضمين client_secret في bundle لا يجعله سريًا. Confidential client: backend قادر على حماية credentials ويصادق نفسه عند token endpoint. اسم النوع يصف قدرة حفظ السر،… العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Scope وConsent». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> scope اسم صلاحية يطلبها Client: صمم scopes حول capabilities واضحة وبأقل صلاحية. لا تجعل admin scope عامًا يختصر عشرات العمليات الحساسة بلا سبب. Consent واجهة/قرار يمنح فيه Resource Owner وصولًا. لكنه ليس بديلًا عن سياسة Authorization Server؛ قد ترفض المؤسسة scope حتى لو وافق المستخدم، وقد يكون consent سابقًا أو إداريًا في machine-to-machine. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Access token» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> Credential يقدمها Client إلى Resource Server: قد يكون opaque string أو JWT؛ OAuth لا يفرض صيغة واحدة. يجب تقييده بالمدة والجمهور والموارد والإجراءات. Bearer يعني أن من يحمله يمكنه استخدامه، لذلك خزنه وانقله كسر. API يجب أن تتحقق أنه موجه إليها وأن scope يسمح بالفعل، لا أن signature صحيحة فقط. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
