---
title: 22. PAR وJAR وRAR وحوادث التوكينات
description: حماية طلبات OAuth المتقدمة والاستجابة العملية لتسريب Access Token أوRefresh Token أوSecret.
sidebar:
  order: 22
---

## المشكلة التي تعالجها الإضافات

Authorization Request عادي يمر عبر Browser ويحتوي `client_id` و`redirect_uri` و`scope` و`state` وربما تفاصيل حساسة. التوقيع أوالدفع المباشر إلى Authorization Server يقلل العبث والتسريب، لكنه لا يلغي PKCE وState وNonce والتحقق من Redirect URI.

## PAR — Pushed Authorization Requests

يرسل Client تفاصيل الطلب مباشرة إلى Authorization Server عبر Back Channel موثق. يحصل على `request_uri` قصير العمر، ثم يرسل Browser إلى Authorization Endpoint بهذا المرجع. هذا يقلل طول URL ويمنع المتصفح من تعديل المعاملات المدفوعة.

```text
Client -- authenticated POST --> PAR endpoint
Client <-- request_uri ---------- Authorization Server
Browser --> /authorize?client_id=...&request_uri=...
```

اجعل `request_uri` أحادي الاستخدام أو قصير العمر حسب الخادم، واربطه بالـClient الذي أنشأه.

## JAR — JWT-Secured Authorization Request

يضع Parameters داخل JWT موقع يسمى Request Object. التوقيع يثبت سلامة المعاملات ومصدرها وفق سياسة المفاتيح. تحقق من `iss` و`aud` و`exp` والتوقيع وعدم التعارض بين قيم JWT وQuery. التشفير اختياري ومختلف عن التوقيع؛ التوقيع لا يخفي المحتوى.

## RAR — Rich Authorization Requests

بدل Scope عام مثل `payments`، يرسل Client تفاصيل منظمة في `authorization_details`: نوع العملية والمبلغ والعملة والمستفيد مثلًا. هذا يسمح Consent أدق، لكنه يتطلب Schema وPolicy ومنع أن يطلب Client صلاحية أوسع مما هو مسجل له.

```json
{
  "type": "payment_initiation",
  "amount": {"currency": "EGP", "value": "250.00"},
  "creditor": {"name": "Example Store"}
}
```

PAR وJAR وRAR أدوات مختلفة ويمكن جمعها: RAR يصف الصلاحية الغنية، JAR يحمي Request Object، وPAR يدفع الطلب عبر قناة خلفية.

## سيناريو Incident: Access Token مسرب

1. فعّل Incident Command وحدد النطاق: Token واحد أمClient أمSigning Key.
2. ابطل Token عند دعم Revocation أوعطل Session/Grant المرتبط.
3. أوقف Logs أوTelemetry التي تواصل تسريب القيمة، واحفظ Evidence بصلاحيات محدودة.
4. دوّر Secret أوKey إذا كان مصدر التسريب أوسع من Token واحد.
5. ابحث عن استخدام غير طبيعي حسب `jti` أوClient أوSubject دون تسجيل Token الخام.
6. أخطر الأطراف المتأثرة وفق السياسة والقانون.
7. أصلح المصدر وأضف Regression Test وDetection.

إذا تسرب Refresh Token فالأثر أطول؛ أبطل Token family واستخدم Rotation مع Reuse Detection. إذا تسرب Signing Key فقد يلزم رفض كل Tokens الموقعة بالمفتاح، نشر JWKS جديد، وتسريع انتهاء القديم بتنسيق حذر.

## Runbook يمنع القرارات المرتجلة

وثق Contacts، صلاحيات الإبطال، أوامر آمنة، مصادر Logs، قوالب الاتصال، ومعايير إغلاق الحادث. اختبر Tabletop Exercise: ماذا يحدث لو ظهر Token في Git commit أوError trace أوFrontend bundle؟ قيّم زمن الاكتشاف والاحتواء لا زمن كتابة التقرير فقط.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين PAR وJAR؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> PAR يدفع الطلب عبر Back Channel ويعيد مرجعًا؛ JAR يضع المعاملات في Request Object موقع.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>هل توقيع JAR يخفي البيانات؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> لا؛ التوقيع يحمي السلامة والأصالة. السرية تحتاج تشفيرًا مناسبًا وسياسة مفاتيح منفصلة.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>ماذا يضيف RAR فوق Scope عام؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> تفاصيل منظمة للعملية تسمح بقرار وConsent أدق من اسم Scope واسع.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>ماذا تفعل إذا تسرب Refresh Token؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> ابطل العائلة أوGrant، افحص Reuse، احتوِ مصدر التسريب، دوّر الأسرار عند الحاجة، وحقق في الاستخدام غير الطبيعي.</div></details></section>
</div>
