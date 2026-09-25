---
title: 21. الأجهزة والجلسات وكلمات المرور المسربة وSCIM
description: إدارة جلسات الأجهزة وفحص كلمات المرور المسربة وProvisioning مؤسسي آمن عبر SCIM.
sidebar:
  order: 21
---

## سجل جلسات قابل للإدارة

لكل Session خزّن Server-side معرفًا Hash، ووقت الإنشاء وآخر استخدام ووقت الانتهاء وDevice label تقريبيًا وعنوان IP مختصرًا عند الحاجة القانونية والتشغيلية. لا تدّعِ أن User-Agent يحدد جهازًا بهوية مؤكدة؛ هو Metadata قابلة للتغيير.

صفحة “أجهزتك” تعرض الجلسات النشطة وتسمح بإبطال واحدة أو الجميع. عند “تسجيل الخروج من كل الأجهزة” غيّر Session version أو أبطل كل Refresh Tokens والجلسات ما عدا الحالية إذا اختار المستخدم ذلك. العمليات الحساسة تحتاج Re-authentication، لا مجرد Session قديمة.

```php
function revokeAllSessions(PDO $pdo, int $userId): void
{
    $statement = $pdo->prepare(
        'UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP
         WHERE user_id = :user_id AND revoked_at IS NULL'
    );
    $statement->execute(['user_id' => $userId]);
}
```

أرسل Notification بعد Password change أوجلسة جديدة غير معتادة، لكن لا تضع Token الإبطال نفسه في Email أوLogs.

## فحص كلمات المرور المسربة

سياسة الطول و`password_hash` لا تكشف أن المستخدم اختار Password ظهرت في تسريب. افحصها عند التسجيل والتغيير ضد خدمة أوDataset موثوقة. لا ترسل Password الخام؛ استخدم بروتوكول خصوصية مثل k-anonymity إن توفر، مع Timeout وفشل آمن حسب سياسة المنتج.

لا تحفظ نتيجة الفحص بجانب Password، ولا تمنع المستخدم بسبب Service outage بلا قرار موثق. اسمح Password Manager وPaste، ولا تفرض تغييرات دورية بلا دليل اختراق.

## SCIM: Provisioning وليس Login

SCIM بروتوكول HTTP لإدارة Users وGroups بين Identity System وApplication. لا يستبدل SAML أوOIDC لتسجيل الدخول. أهم العمليات: إنشاء مستخدم، تعديل Attributes، تعطيل `active`, وإدارة Group membership.

```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "userName": "omar@example.com",
  "active": true,
  "name": {"givenName": "Omar", "familyName": "Ahmed"}
}
```

اربط كل SCIM Client بـTenant واحد، طبق OAuth scope أوCredential مخصصة، تحقق من `Content-Type` وSchema، واستخدم ETag/Version لتجنب الكتابة فوق تعديل متزامن.

## Deprovisioning أهم من Provisioning

عندما يصبح `active=false`:

1. امنع Login جديدًا.
2. أبطل Sessions وRefresh Tokens وAPI Keys المرتبطة حسب السياسة.
3. أزل Group-derived privileges.
4. احتفظ بالبيانات أوانقل الملكية وفق Retention policy.
5. سجل Actor وSource وCorrelation ID.

اختبر Replay وDuplicate events وOut-of-order updates. اجعل العمليات Idempotent، ولا تحذف بيانات المستخدم فورًا لمجرد وصول طلب Disable.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>لماذا اسم الجهاز ليس إثبات هوية؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> غالبًا مشتق من User-Agent وIP وهما قابلان للتغيير والتشارك؛ استخدمهما للعرض والمخاطر لا كعامل مصادقة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>ماذا يجب أن يحدث عند Logout all devices؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> إبطال الجلسات وRefresh Tokens المناسبة، تسجيل الحدث، وإعلام المستخدم دون تسريب قيم الاعتماد.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>لماذا SCIM لا يستبدل OIDC؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> SCIM يدير دورة حياة الحسابات والمجموعات؛ OIDC يثبت هوية المستخدم عند تسجيل الدخول.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>لماذا يجب أن يكون Deprovision idempotent؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لأن المزود قد يعيد الطلب؛ التكرار يجب ألا يعيد حذفًا أوTransfer أوSide effect خطيرًا.</div></details></section>
</div>
