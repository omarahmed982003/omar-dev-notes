---
title: 19. إدارة الأسرار ومفاتيح التشفير
description: Secret managers وenvelope encryption وrotation وrevocation وaccess policy وbreak-glass والاستجابة للتسريب.
sidebar:
  order: 19
---

## ما السر؟

كلمات مرور قواعد البيانات وAPI keys وprivate keys وencryption keys وsigning secrets أسرار. اسم البيئة وURL عامة ليست أسرارًا. التصنيف يحدد التخزين والوصول والدوران.

ملف `.env` وسيلة تحميل في التطوير وليس secret manager، وBase64 ليست تشفيرًا.

## دورة الحياة

```text
generate -> store -> distribute -> use -> rotate -> revoke -> destroy
```

لكل سر owner وpurpose وconsumers وcreated/expiry وrotation policy. لا تشارك سرًا واحدًا بين خدمات كثيرة؛ يصعب معرفة المتسبب وإلغاؤه.

## Secret Manager

التطبيق يحصل على السر بهوية workload وبأقل صلاحية. فضّل secrets قصيرة العمر أوdynamic credentials. Cache في الذاكرة مدة محدودة وتوقع renewal/failure دون كتابتها إلى disk أوlogs.

## Envelope Encryption

```text
KMS/HSM master key encrypts a data-encryption key (DEK)
DEK encrypts application data
store ciphertext + encrypted DEK + algorithm/version metadata
```

لا تستخدم master key مباشرة لكل record. استخدم authenticated encryption مثل Sodium AEAD، مع nonce صحيحة وassociated data تربط ciphertext بالسياق.

## Rotation

احفظ key ID/version مع البيانات أوtoken. أثناء الدوران:

1. أنشئ key جديدة.
2. ابدأ الكتابة بها.
3. استمر في قراءة النسخ القديمة.
4. أعد التشفير/التوقيع حسب الحاجة.
5. ألغِ القديمة بعد نافذة آمنة.

تدوير signing key يختلف عن encryption key؛ حذف مفتاح تشفير قد يجعل البيانات غير قابلة للقراءة.

## الوصول والتدقيق

- least privilege وفصل admin عن runtime.
- audit لكل قراءة/تغيير وإلغاء.
- approval أوbreak-glass للعمليات شديدة الحساسية.
- تنبيه على access غير معتاد.
- backups مشفرة واختبار recovery للمفاتيح المطلوبة.

## عند التسريب

أوقف/قيّد الاستخدام، دوّر السر، حدّد النطاق من audit logs، أصلح المصدر، وافحص history وartifacts وlogs. حذف السر من Git لا يلغيه. لا تطبع قيم secrets في رسائل CI.

## مرجع

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: إدارة الأسرار ومفاتيح التشفير">
<p class="lesson-diagram-title">خريطة مفاهيم: إدارة الأسرار ومفاتيح التشفير</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>ما السر؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>دورة الحياة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Secret Manager</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Envelope Encryption</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Rotation</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «ما السر؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> كلمات مرور قواعد البيانات وAPI keys وprivate keys وencryption keys وsigning secrets أسرار. اسم البيئة وURL عامة ليست أسرارًا. التصنيف يحدد التخزين والوصول والدوران. ملف .env وسيلة تحميل في التطوير وليس secret manager، وBase64 ليست تشفيرًا. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «ما السر؟» و«دورة الحياة». لماذا لا يغني أحدهما عن الآخر داخل موضوع «إدارة الأسرار ومفاتيح التشفير»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «ما السر؟»: كلمات مرور قواعد البيانات وAPI keys وprivate keys وencryption keys وsigning secrets أسرار. اسم البيئة وURL عامة ليست أسرارًا. التصنيف يحدد التخزين والوصول والدوران. ملف .env وسيلة تحميل في التطوير وليس secret manager، وBase64 ليست تشفيرًا. أما «دورة الحياة»: لكل سر owner وpurpose وconsumers وcreated/expiry وrotation policy. لا تشارك سرًا واحدًا بين خدمات كثيرة؛ يصعب معرفة المتسبب وإلغاؤه. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Secret Manager». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> التطبيق يحصل على السر بهوية workload وبأقل صلاحية. فضّل secrets قصيرة العمر أوdynamic credentials. Cache في الذاكرة مدة محدودة وتوقع renewal/failure دون كتابتها إلى disk أوlogs. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Envelope Encryption» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> لا تستخدم master key مباشرة لكل record. استخدم authenticated encryption مثل Sodium AEAD، مع nonce صحيحة وassociated data تربط ciphertext بالسياق. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
