---
title: 20. Threat Modeling واختبار الصلاحيات
description: نمذجة تهديد تدفق الدخول وبناء Authorization Test Matrix للأدوار والملكية وعزل المستأجرين.
sidebar:
  order: 20
---

## ابدأ بالأصول وحدود الثقة

Threat Model ليست قائمة ثغرات عامة. ارسم النظام وحدد الأصول: Credentials وSessions وTokens وبيانات المستخدم وسجلات التدقيق. ثم حدد الجهات: مستخدم، Admin، خدمة داخلية، مزود هوية ومهاجم. كل انتقال بين Browser وAPI وIdentity Provider وDatabase هو Trust Boundary يحتاج تحققًا مستقلًا.

```text
Browser -- credentials --> Login endpoint
Browser <-- session ---- Application
Application -- code ----> Identity Provider
Application -- query ---> User / tenant database
```

## حلل تدفق تسجيل الدخول

لكل خطوة اسأل:

- هل يمكن Spoofing للهوية أو إعادة استخدام الطلب؟
- هل يمكن تعديل `return_to` أو `tenant_id` أو Role في الطريق؟
- هل Logs تحفظ Password أوCode أوToken؟
- هل المهاجم يستطيع إنكار عملية حساسة لغياب Audit trail؟
- هل Error Message أوTiming يكشف وجود الحساب؟
- هل Rate Limit وMFA وRecovery تقاوم Credential Stuffing؟

حول كل تهديد إلى Control واختبار وTelemetry. مثال: Session Fixation يقابله `session_regenerate_id(true)` بعد نجاح الدخول، واختبار يثبت تغير المعرّف، وLog يسجل حدث التجديد دون قيمة Session ID.

## Authorization Test Matrix

لا تختبر “Admin ينجح” فقط. المحاور الأساسية:

| Subject | Resource | Tenant | Action | المتوقع |
|---|---|---|---|---|
| Owner | Own invoice | Same | read | Allow |
| User | Other invoice | Same | read | Deny |
| Admin | Invoice | Same | refund | Allow حسب Policy |
| Admin | Invoice | Other | read | Deny |
| Suspended user | Own invoice | Same | read | Deny أوRead-only وفق السياسة |

أضف صفوفًا للهوية الغائبة والـRole القديمة والـResource المحذوفة وID عشوائي. اختبر القرار في Service/Policy، ثم Integration Test عبر Endpoint حتى تتأكد أن Routing وMiddleware لا تتجاوزانه.

## Deny by default وعدم تسريب الوجود

أي Action بلا Policy صريحة مرفوضة. عند محاولة الوصول إلى Resource خارج Tenant قد تستخدم `404` بدل `403` حتى لا تكشف وجوده، مع تسجيل السبب داخليًا. لا تعتمد على إخفاء زر في الواجهة؛ الخادم يعيد القرار من Subject وAction وResource وContext موثوق.

## مراجعة التهديد عند التغيير

أعد المراجعة عند إضافة Login Provider أوWebhook أوRole أوTenant Boundary أوطريقة Recovery. اربط كل تهديد بمالك وموعد ومخاطرة متبقية؛ الرسم الذي لا ينتج قرارًا أو اختبارًا لا يحمي النظام.

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>ما الفرق بين Asset وTrust Boundary؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> الأصل شيء نحميه، أما حد الثقة فهو نقطة انتقال تتغير عندها افتراضات الثقة ويجب إعادة التحقق.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>لماذا اختبار Admin وحده غير كافٍ؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> أخطر الأخطاء تظهر في الملكية وعبور Tenant والحالات الموقوفة أو القديمة، لا في المسار المسموح الواضح.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>متى قد نعيد 404 بدل 403؟</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> عندما كشف وجود المورد لمستخدم غير مصرح له يعد تسريبًا، مع الاحتفاظ بسبب الرفض في السجل الداخلي.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل Session Fixation إلى Control واختبار.</p></div><details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة:</strong> جدد Session ID بعد الدخول وأبطل القديم، ثم اختبر أن القديم لا يعمل والجديد يحمل الصلاحية الصحيحة.</div></details></section>
</div>
