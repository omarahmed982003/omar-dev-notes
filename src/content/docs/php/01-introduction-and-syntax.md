---
title: 1. مقدمة وصياغة PHP
description: ماهية PHP، آلية تنفيذ الطلب، الصياغة، الدمج مع HTML، التعليقات وحساسية الأحرف.
sidebar:
  order: 1
---

## ما PHP؟

بدأ الاسم تاريخيًا بمعنى **Personal Home Page**، ثم أصبح الاسم الرسمي المتكرر **PHP: Hypertext Preprocessor**. هي لغة مفتوحة المصدر، عامة الاستخدام، ومشهورة خصوصًا في برمجة جانب الخادم.

عند طلب صفحة PHP لا يصل كود PHP إلى المتصفح:

1. يرسل المتصفح طلب HTTP.
2. يستقبل خادم الويب الطلب ويمرر ملف `.php` إلى PHP.
3. تنفّذ PHP الكود وتتواصل عند الحاجة مع قاعدة البيانات أو الملفات والخدمات.
4. تعيد ناتجًا مثل HTML أو JSON.
5. يرسل الخادم الاستجابة إلى المتصفح.

:::caution[تصحيح مهم]
وصف PHP بأنها «تُفسَّر سطرًا بسطر فقط» تبسيط غير دقيق؛ يحوّل المحرك الكود إلى opcodes ثم ينفذها، وتوجد JIT في الإصدارات الحديثة. المهم عمليًا أن المستخدم لا يحتاج خطوة build تقليدية لكل تعديل.
:::

## ماذا تستطيع PHP أن تفعل؟

- معالجة النماذج وطلبات HTTP وبناء صفحات ديناميكية وواجهات API.
- القراءة والكتابة في قواعد البيانات والملفات.
- العمل من سطر الأوامر لتشغيل المهام المجدولة وعمليات المعالجة وإرسال البريد.
- إنشاء صور أو ملفات PDF عند تثبيت المكتبات المناسبة.
- التشفير والتحقق من كلمات المرور والتعامل مع JSON.
- البرمجة الإجرائية والبرمجة كائنية التوجه.

يمكن بناء تطبيق سطح مكتب بأدوات خارجية، لكنه ليس الاستخدام الشائع أو الاختيار الأول لـ PHP.

## بيئة التشغيل

يمكن تثبيت المكونات منفردة أو استخدام حزمة محلية:

- **XAMPP** لأنظمة متعددة.
- **WAMP** لويندوز.
- **MAMP** لماك.
- **LAMP** للينكس.

الحروف تشير عادة إلى نظام التشغيل، وApache، وMySQL/MariaDB، وPHP. ويمكن كذلك تشغيل خادم التطوير المدمج:

```bash
php -S localhost:8000 -t public
```

هذا الخادم للتطوير المحلي، وليس للإنتاج.

## الوسوم والدمج مع HTML

```php
<?php
$title = 'متجري';
?>
<!doctype html>
<html lang="ar" dir="rtl">
<head><title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></title></head>
<body>
    <?php if ($title !== ''): ?>
        <h1 class="page-title"><?= htmlspecialchars($title) ?></h1>
    <?php else: ?>
        <p>لا يوجد عنوان</p>
    <?php endif; ?>
</body>
</html>
```

- يبدأ الكود بـ `<?php`.
- الاختصار `<?= $value ?>` يعني إخراج القيمة.
- الصياغة البديلة `if: ... endif;` مناسبة للقوالب، ومنها أفكار قوالب Blade.
- في ملف PHP خالص يُفضّل حذف وسم الإغلاق `?>` لتجنب إرسال مسافات غير مقصودة.
- تنتهي التعليمات البسيطة بـ `;`، أما كتلة `if { ... }` فلا تحتاج فاصلة بعد `}`.

:::caution[الإخراج وHeaders]
يجب استدعاء `header()` و`setcookie()` و`session_start()` قبل إرسال أي HTML أو نص، وإلا قد يظهر خطأ “headers already sent”.
:::

```php
<?php
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['status' => 'ok'], JSON_UNESCAPED_UNICODE);
```

## التعليقات وحساسية الأحرف

```php
// تعليق سطر واحد
# تعليق سطر واحد أيضًا
/*
  تعليق متعدد الأسطر
*/
$userName = 'Omar';
echo $userName; // صحيح
// echo $username; // متغير مختلف
```

أسماء المتغيرات حساسة لحالة الأحرف. كلمات اللغة مثل `if` ليست حساسة عمليًا، وأسماء الدوال والفئات تُطابق دون حساسية، لكن التزم دائمًا بالحالة المعرّفة ومعايير PSR. الثوابت الحديثة حساسة للحالة.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: مقدمة وصياغة PHP">
<p class="lesson-diagram-title">خريطة مفاهيم: مقدمة وصياغة PHP</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>ما PHP؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>ماذا تستطيع PHP أن تفعل؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>بيئة التشغيل</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>الوسوم والدمج مع HTML</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>التعليقات وحساسية الأحرف</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «ما PHP؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> بدأ الاسم تاريخيًا بمعنى Personal Home Page، ثم أصبح الاسم الرسمي المتكرر PHP: Hypertext Preprocessor. هي لغة مفتوحة المصدر، عامة الاستخدام، ومشهورة خصوصًا في برمجة جانب الخادم. عند طلب صفحة PHP لا يصل كود PHP إلى المتصفح: يرسل المتصفح طلب HTTP. يستقبل خادم الويب الطلب ويمرر ملف .php إلى PHP. تنفّذ PHP الكود وتتواصل عند الحاجة مع قاعدة البيانات أو الملفات والخدمات. تعيد ناتجًا مثل HTML أو JSON. يرسل الخادم الاستجابة… عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «ما PHP؟» و«ماذا تستطيع PHP أن تفعل؟». لماذا لا يغني أحدهما عن الآخر داخل موضوع «مقدمة وصياغة PHP»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «ما PHP؟»: بدأ الاسم تاريخيًا بمعنى Personal Home Page، ثم أصبح الاسم الرسمي المتكرر PHP: Hypertext Preprocessor. هي لغة مفتوحة المصدر، عامة الاستخدام، ومشهورة خصوصًا في برمجة جانب الخادم. عند طلب صفحة PHP لا يصل كود PHP إلى المتصفح: يرسل المتصفح طلب HTTP. يستقبل خادم الويب الطلب ويمرر ملف .php إلى PHP. تنفّذ PHP الكود وتتواصل عند الحاجة مع قاعدة البيانات أو الملفات والخدمات. تعيد ناتجًا مثل HTML أو JSON. يرسل الخادم الاستجابة… أما «ماذا تستطيع PHP أن تفعل؟»: معالجة النماذج وطلبات HTTP وبناء صفحات ديناميكية وواجهات API. القراءة والكتابة في قواعد البيانات والملفات. العمل من سطر الأوامر لتشغيل المهام المجدولة وعمليات المعالجة وإرسال البريد. إنشاء صور أو ملفات PDF عند تثبيت المكتبات المناسبة. التشفير والتحقق من كلمات المرور والتعامل مع JSON. البرمجة الإجرائية والبرمجة كائنية التوجه. يمكن بناء تطبيق سطح مكتب بأدوات خارجية، لكنه ليس الاستخدام الشائع أو الاختيار الأول لـ PHP. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «بيئة التشغيل». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يمكن تثبيت المكونات منفردة أو استخدام حزمة محلية: XAMPP لأنظمة متعددة. WAMP لويندوز. MAMP لماك. LAMP للينكس. الحروف تشير عادة إلى نظام التشغيل، وApache، وMySQL/MariaDB، وPHP. ويمكن كذلك تشغيل خادم التطوير المدمج: هذا الخادم للتطوير المحلي، وليس للإنتاج. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «الوسوم والدمج مع HTML» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> يبدأ الكود بـ يعني إخراج القيمة. الصياغة البديلة if: ... endif; مناسبة للقوالب، ومنها أفكار قوالب Blade. في ملف PHP خالص يُفضّل حذف وسم الإغلاق ?&gt; لتجنب إرسال مسافات غير مقصودة. تنتهي التعليمات البسيطة بـ ;، أما كتلة if فلا تحتاج فاصلة بعد }. :::caution[الإخراج وHeaders] يجب استدعاء header() وsetcookie() وsession_start() قبل إرسال أي HTML أو نص، وإلا قد يظهر خطأ “headers already sent”. ::: وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
