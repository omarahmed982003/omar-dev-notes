---
title: 13. دورة حياة الحساب
description: التسجيل وتأكيد البريد واسترجاع كلمة المرور وتغيير الهوية وإعادة المصادقة وإلغاء الجلسات.
sidebar:
  order: 13
---

## التسجيل

عامل التسجيل كعملية هوية لا مجرد `INSERT`:

1. طبّع البريد وفق سياسة موثقة دون تغيير عشوائي.
2. تحقق من الشكل والنطاق وقواعد المنتج.
3. طبّق rate limit ومراقبة الإساءة.
4. خزّن password بـ`password_hash()`.
5. لا تمنح صلاحيات حساسة قبل إثبات البريد/الهاتف المطلوب.

لتقليل account enumeration استخدم رسالة متقاربة مثل “إن كان العنوان صالحًا فستصل رسالة”، مع logging داخلي.

## Token التأكيد

```php
$token = bin2hex(random_bytes(32));
$tokenHash = hash('sha256', $token);
// خزّن hash + user_id + expires_at + used_at
// أرسل token الخام في رابط HTTPS مرة واحدة
```

عند الاستخدام: hash القيمة، افحص expiry وused_at، ثم علّمها مستخدمة داخل transaction. لا تخزن token الخام.

## Password reset

- رسالة عامة سواء الحساب موجودًا أم لا.
- token عشوائية قصيرة العمر وأحادية الاستخدام.
- لا تغير password قبل إثبات token.
- بعد النجاح دوّر session ID وألغِ جلسات/refresh tokens حسب السياسة.
- أرسل إشعارًا أمنيًا.

لا تستخدم أسئلة أمان قابلة للتخمين.

## العمليات الحساسة

اطلب re-authentication أو MFA قبل تغيير البريد أو password أو وسائل MFA أو تنفيذ تحويل مالي. لا تعتبر session قديمة دليلًا كافيًا؛ سجل `auth_time` وحدد max age.

## تغيير البريد والحذف

تحقق من البريد الجديد، وأبلغ القديم، وتعامل مع uniqueness race داخل database. عرّف الفرق بين suspension وdeactivation وdeletion، وألغِ credentials والجلسات وسجل actor/reason/time.

## حالات السباق

استخدم transaction وunique constraints، وامنَع استخدام token نفسها مرتين. اختبر click مزدوج وطلب reset متزامن وتغيير البريد أثناء وجود جلسات أخرى.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: دورة حياة الحساب">
<p class="lesson-diagram-title">خريطة مفاهيم: دورة حياة الحساب</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>التسجيل</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Token التأكيد</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Password reset</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>العمليات الحساسة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>تغيير البريد والحذف</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «التسجيل» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عامل التسجيل كعملية هوية لا مجرد INSERT: طبّع البريد وفق سياسة موثقة دون تغيير عشوائي. تحقق من الشكل والنطاق وقواعد المنتج. طبّق rate limit ومراقبة الإساءة. خزّن password بـpassword_hash(). لا تمنح صلاحيات حساسة قبل إثبات البريد/الهاتف المطلوب. لتقليل account enumeration استخدم رسالة متقاربة مثل “إن كان العنوان صالحًا فستصل رسالة”، مع logging داخلي. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «التسجيل» و«Token التأكيد». لماذا لا يغني أحدهما عن الآخر داخل موضوع «دورة حياة الحساب»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «التسجيل»: عامل التسجيل كعملية هوية لا مجرد INSERT: طبّع البريد وفق سياسة موثقة دون تغيير عشوائي. تحقق من الشكل والنطاق وقواعد المنتج. طبّق rate limit ومراقبة الإساءة. خزّن password بـpassword_hash(). لا تمنح صلاحيات حساسة قبل إثبات البريد/الهاتف المطلوب. لتقليل account enumeration استخدم رسالة متقاربة مثل “إن كان العنوان صالحًا فستصل رسالة”، مع logging داخلي. أما «Token التأكيد»: عند الاستخدام: hash القيمة، افحص expiry وused_at، ثم علّمها مستخدمة داخل transaction. لا تخزن token الخام. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Password reset». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> رسالة عامة سواء الحساب موجودًا أم لا. token عشوائية قصيرة العمر وأحادية الاستخدام. لا تغير password قبل إثبات token. بعد النجاح دوّر session ID وألغِ جلسات/refresh tokens حسب السياسة. أرسل إشعارًا أمنيًا. لا تستخدم أسئلة أمان قابلة للتخمين. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «العمليات الحساسة» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اطلب re-authentication أو MFA قبل تغيير البريد أو password أو وسائل MFA أو تنفيذ تحويل مالي. لا تعتبر session قديمة دليلًا كافيًا؛ سجل auth_time وحدد max age. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
