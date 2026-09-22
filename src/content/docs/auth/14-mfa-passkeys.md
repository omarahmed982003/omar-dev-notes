---
title: 14. MFA وTOTP وPasskeys
description: عوامل المصادقة وTOTP وRecovery Codes وWebAuthn/Passkeys وStep-up والاسترجاع الآمن.
sidebar:
  order: 14
---

## العامل ليس مجرد خطوة ثانية

- شيء تعرفه: password/PIN.
- شيء تملكه: authenticator أو security key.
- شيء تكونه: biometric محلي يفتح credential.

عاملان من الفئة نفسها ليسا MFA قوية. SMS أفضل أحيانًا من password وحدها لكنه معرض لـSIM swap وphishing.

## TOTP

عند التسجيل أنشئ secret عشوائية، اعرض QR عبر قناة authenticated، واطلب code لإثبات الإعداد قبل التفعيل. خزّن السر مشفرًا بمفتاح مُدار، لا hashed فقط لأن الخادم يحتاجه للتحقق.

- نافذة زمنية صغيرة مع clock متزامن.
- امنع replay لنفس time step إن أمكن.
- rate limit للتحقق.
- لا تسجل secret أو code.

## Recovery Codes

أنشئ codes عشوائية أحادية الاستخدام، اعرضها مرة، وخزّن hashes قوية لها. عند استخدام code علّمها مستخدمة وأخبر المستخدم، واسمح بتجديد المجموعة بعد re-authentication.

## WebAuthn وPasskeys

```text
server challenge -> browser/authenticator -> public-key credential
server stores credential ID + public key + metadata
```

في الدخول يتحقق الخادم من signature وchallenge وorigin وRP ID وuser verification وسياسة counter. الخادم لا يخزن private key. Passkeys مقاومة للتصيد لأنها مرتبطة بالـRP/origin.

## Step-up

اطلب assurance أعلى عند تغيير وسائل الاسترجاع، دفع كبير، عرض سر، أو سلوك عالي المخاطر. اربط النتيجة بالعملية ومدة قصيرة.

## Recovery هي أضعف حلقة

- عدة قنوات/إثباتات حسب المخاطر.
- تأخير وإشعارات للتغيير الحساس.
- مراجعة دعم بشري بإجراءات وتدقيق.
- إلغاء credentials المفقودة وتسجيل الحدث.

## مرجع

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: MFA وTOTP وPasskeys">
<p class="lesson-diagram-title">خريطة مفاهيم: MFA وTOTP وPasskeys</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>العامل ليس مجرد خطوة ثانية</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>TOTP</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Recovery Codes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>WebAuthn وPasskeys</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Step-up</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «العامل ليس مجرد خطوة ثانية» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> شيء تعرفه: password/PIN. شيء تملكه: authenticator أو security key. شيء تكونه: biometric محلي يفتح credential. عاملان من الفئة نفسها ليسا MFA قوية. SMS أفضل أحيانًا من password وحدها لكنه معرض لـSIM swap وphishing. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «العامل ليس مجرد خطوة ثانية» و«TOTP». لماذا لا يغني أحدهما عن الآخر داخل موضوع «MFA وTOTP وPasskeys»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «العامل ليس مجرد خطوة ثانية»: شيء تعرفه: password/PIN. شيء تملكه: authenticator أو security key. شيء تكونه: biometric محلي يفتح credential. عاملان من الفئة نفسها ليسا MFA قوية. SMS أفضل أحيانًا من password وحدها لكنه معرض لـSIM swap وphishing. أما «TOTP»: عند التسجيل أنشئ secret عشوائية، اعرض QR عبر قناة authenticated، واطلب code لإثبات الإعداد قبل التفعيل. خزّن السر مشفرًا بمفتاح مُدار، لا hashed فقط لأن الخادم يحتاجه للتحقق. نافذة زمنية صغيرة مع clock متزامن. امنع replay لنفس time step إن أمكن. rate limit للتحقق. لا تسجل secret أو code. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Recovery Codes». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> أنشئ codes عشوائية أحادية الاستخدام، اعرضها مرة، وخزّن hashes قوية لها. عند استخدام code علّمها مستخدمة وأخبر المستخدم، واسمح بتجديد المجموعة بعد re-authentication. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «WebAuthn وPasskeys» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في الدخول يتحقق الخادم من signature وchallenge وorigin وRP ID وuser verification وسياسة counter. الخادم لا يخزن private key. Passkeys مقاومة للتصيد لأنها مرتبطة بالـRP/origin. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
