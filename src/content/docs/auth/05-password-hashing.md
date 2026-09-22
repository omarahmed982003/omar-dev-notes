---
title: 5. كلمات المرور وHashing
description: تخزين كلمات المرور باستخدام password_hash وpassword_verify وArgon2id وbcrypt وإعادة الـhash.
sidebar:
  order: 5
---

## Hashing ليس Encryption

كلمة المرور لا نحتاج استعادتها؛ نحتاج التحقق منها. لذلك نخزن **password hash بطيئًا ومملحًا**، لا تشفيرًا قابلًا للفك ولا SHA-256 سريعًا وحده.

دوال PHP تدير salt والصيغة والمعاملات داخل hash:

```php
$hash = password_hash($password, PASSWORD_DEFAULT);
if ($hash === false) {
    throw new RuntimeException('Password hashing failed');
}
```

اجعل عمود قاعدة البيانات `VARCHAR(255)` لأن `PASSWORD_DEFAULT` قد تتغير خوارزميته وطول ناتجه.

إذا كان Argon2id متاحًا في البناء:

```php
$hash = password_hash($password, PASSWORD_ARGON2ID, [
    'memory_cost' => 64 * 1024,
    'time_cost' => 3,
    'threads' => 2,
]);
```

القيم مثال وليست وصفة عالمية؛ benchmark على خادم الإنتاج واختر تكلفة تؤخر المهاجم دون تعطيل المستخدمين.

## التحقق وإعادة الـhash

```php
if (!password_verify($password, $user['password_hash'])) {
    // رسالة عامة لا تكشف هل البريد موجود
    throw new AuthenticationException('Invalid credentials');
}

if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
    $newHash = password_hash($password, PASSWORD_DEFAULT);
    $users->updatePasswordHash($user['id'], $newHash);
}
```

`password_verify()` يستخرج salt/options من hash. لا تقارن hashes يدويًا، ولا تنشئ salt بنفسك.

## سياسة صحيحة

- اسمح بعبارات مرور طويلة، ولا تفرض قواعد تركيب مزعجة بلا سبب.
- لا تقص كلمة المرور بصمت. راعِ حد الخوارزمية؛ bcrypt يتعامل تاريخيًا مع أول 72 bytes.
- لا تغيّر case أو trim لكلمة مرور المستخدم دون سياسة معلنة.
- افحص كلمات المرور المسربة إن كانت لديك خدمة مناسبة تحفظ الخصوصية.
- أضف Rate Limiting وتأخيرًا تدريجيًا ومراقبة، وMFA للحسابات الحساسة.
- لا تسجل كلمة المرور أو تضعها في URL.

## Pepper اختياري

يمكن إضافة secret server-side منفصل عن قاعدة البيانات باستخدام HMAC قبل `password_hash`، لكنه يزيد تعقيد التدوير والاسترجاع. احفظه في secret manager لا في Git، وخطط لتغيير المفاتيح. Salt ليس سرًا وموجود داخل hash؛ Pepper سر مختلف.

## تغيير واسترجاع كلمة المرور

- اطلب إعادة المصادقة للتغيير الحساس.
- Reset token عشوائي، قصير العمر، single-use، وخزّن hash له لا قيمته الخام.
- بعد التغيير ألغِ الجلسات/refresh tokens الأخرى حسب سياسة المنتج.
- لا ترسل كلمة المرور القديمة أو الجديدة عبر البريد.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: كلمات المرور وHashing">
<p class="lesson-diagram-title">خريطة مفاهيم: كلمات المرور وHashing</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Hashing ليس Encryption</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>التحقق وإعادة الـhash</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>سياسة صحيحة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Pepper اختياري</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>تغيير واسترجاع كلمة المرور</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «Hashing ليس Encryption» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> كلمة المرور لا نحتاج استعادتها؛ نحتاج التحقق منها. لذلك نخزن password hash بطيئًا ومملحًا، لا تشفيرًا قابلًا للفك ولا SHA-256 سريعًا وحده. دوال PHP تدير salt والصيغة والمعاملات داخل hash: اجعل عمود قاعدة البيانات VARCHAR(255) لأن PASSWORD_DEFAULT قد تتغير خوارزميته وطول ناتجه. إذا كان Argon2id متاحًا في البناء: القيم مثال وليست وصفة عالمية؛ benchmark على خادم الإنتاج واختر تكلفة تؤخر المهاجم دون تعطيل المستخدمين. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «Hashing ليس Encryption» و«التحقق وإعادة الـhash». لماذا لا يغني أحدهما عن الآخر داخل موضوع «كلمات المرور وHashing»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «Hashing ليس Encryption»: كلمة المرور لا نحتاج استعادتها؛ نحتاج التحقق منها. لذلك نخزن password hash بطيئًا ومملحًا، لا تشفيرًا قابلًا للفك ولا SHA-256 سريعًا وحده. دوال PHP تدير salt والصيغة والمعاملات داخل hash: اجعل عمود قاعدة البيانات VARCHAR(255) لأن PASSWORD_DEFAULT قد تتغير خوارزميته وطول ناتجه. إذا كان Argon2id متاحًا في البناء: القيم مثال وليست وصفة عالمية؛ benchmark على خادم الإنتاج واختر تكلفة تؤخر المهاجم دون تعطيل المستخدمين. أما «التحقق وإعادة الـhash»: password_verify() يستخرج salt/options من hash. لا تقارن hashes يدويًا، ولا تنشئ salt بنفسك. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «سياسة صحيحة». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> اسمح بعبارات مرور طويلة، ولا تفرض قواعد تركيب مزعجة بلا سبب. لا تقص كلمة المرور بصمت. راعِ حد الخوارزمية؛ bcrypt يتعامل تاريخيًا مع أول 72 bytes. لا تغيّر case أو trim لكلمة مرور المستخدم دون سياسة معلنة. افحص كلمات المرور المسربة إن كانت لديك خدمة مناسبة تحفظ الخصوصية. أضف Rate Limiting وتأخيرًا تدريجيًا ومراقبة، وMFA للحسابات الحساسة. لا تسجل كلمة المرور أو تضعها في URL. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Pepper اختياري» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يمكن إضافة secret server-side منفصل عن قاعدة البيانات باستخدام HMAC قبل password_hash، لكنه يزيد تعقيد التدوير والاسترجاع. احفظه في secret manager لا في Git، وخطط لتغيير المفاتيح. Salt ليس سرًا وموجود داخل hash؛ Pepper سر مختلف. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
