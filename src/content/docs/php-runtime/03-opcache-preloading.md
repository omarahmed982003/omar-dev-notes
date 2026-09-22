---
title: 3. OPcache وPreloading
description: تخزين PHP bytecode وضبط OPcache ومراقبته والفرق بينه وبين cache البيانات وحدود Preloading.
sidebar:
  order: 3
---

# لماذا يعيد PHP العمل؟

بدون OPcache يقرأ PHP الملف ويحلله ويحوّله إلى Opcodes عند التنفيذ. OPcache يحتفظ بالـbytecode المترجم في ذاكرة مشتركة لتستفيد منه الطلبات التالية، فيقل وقت parsing وcompilation.

```text
PHP source -> tokenize/parse -> compile to opcodes -> execute
                                |
                                +-> OPcache shared memory
```

:::note[ما لا يفعله OPcache]
OPcache لا يخزّن HTML النهائي أو نتائج SQL أو استجابة API. هذه مسؤولية HTTP cache أو application cache مثل Redis. كما أنه لا يجعل الخوارزمية البطيئة سريعة بعد بدء التنفيذ.
:::

## إعداد إنتاجي مبدئي

```ini
; php.ini / conf.d/opcache.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
```

القيم ليست وصفة ثابتة. راقب عدد الملفات والذاكرة وhit rate وrestarts قبل تعديلها.

- مع `validate_timestamps=1` يفحص OPcache تغيّر الملفات حسب `revalidate_freq`.
- مع `validate_timestamps=0` لا يرى النشر الجديد حتى تعيد تشغيل FPM أو تستدعي reset بطريقة منضبطة.
- CLI له إعداد مستقل عادة عبر `opcache.enable_cli`، وتشغيله لسكربت قصير قد يضيف تكلفة بلا فائدة.

## المراقبة

```php
$status = opcache_get_status(false);

if ($status !== false) {
    printf(
        "hit-rate=%.2f%% used=%d free=%d\n",
        $status['opcache_statistics']['opcache_hit_rate'],
        $status['memory_usage']['used_memory'],
        $status['memory_usage']['free_memory'],
    );
}
```

لا تعرض endpoint يحوي `opcache_get_status()` للعامة؛ قد يكشف paths ومعلومات تشغيلية. اجعله داخليًا ومحميًا.

مؤشرات تحتاج انتباهًا:

- `cache_full` أو امتلاء الذاكرة.
- `oom_restarts` و`hash_restarts`.
- انخفاض hit rate بعد warm-up.
- عدد scripts قريب من `max_cached_keys`.

## Preloading

من PHP 7.4 يمكن تشغيل ملف مرة عند بدء عملية الخادم لتحميل functions/classes/interfaces/traits في ذاكرة دائمة:

```ini
opcache.preload=/var/www/app/config/preload.php
opcache.preload_user=www-data
```

```php
<?php
declare(strict_types=1);

$files = [
    __DIR__ . '/../src/Domain/Money.php',
    __DIR__ . '/../src/Domain/Order.php',
];

foreach ($files as $file) {
    opcache_compile_file($file);
}
```

التكلفة والمخاطر:

- يرفع الذاكرة الأساسية لكل بيئة تشغيل.
- أي تغيير في الكود المحمّل يحتاج restart؛ لا يكفي invalidation عادي.
- ترتيب الاعتماديات قد يهم إذا استخدمت `require` بدل `opcache_compile_file()`.
- لا يفيد تلقائيًا كل تطبيق؛ قِس قبل وبعد.
- Preloading غير مدعوم على Windows وفق دليل PHP، ومناسب أساسًا للعمليات المستمرة مثل FPM.

## النشر الصحيح

1. انشر ملفات release جديدة في directory منفصل.
2. ثبّت الاعتماديات بـComposer وولّد autoloader محسّنًا.
3. شغّل الاختبارات وhealth checks.
4. بدّل symlink/release atomically.
5. أعد تحميل FPM gracefully حتى ترى workers الكود وpreload الجديد.

لا تخلط بين OPcache وComposer class map: الأول يخزّن bytecode، والثاني يسرّع **العثور على الملف** الذي يحتوي الصنف. استخدامهما معًا يعالج مرحلتين مختلفتين.

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: OPcache وPreloading">
<p class="lesson-diagram-title">خريطة مفاهيم: OPcache وPreloading</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>إعداد إنتاجي مبدئي</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>المراقبة</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Preloading</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>النشر الصحيح</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «إعداد إنتاجي مبدئي» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> القيم ليست وصفة ثابتة. راقب عدد الملفات والذاكرة وhit rate وrestarts قبل تعديلها. مع validate_timestamps=1 يفحص OPcache تغيّر الملفات حسب revalidate_freq. مع validate_timestamps=0 لا يرى النشر الجديد حتى تعيد تشغيل FPM أو تستدعي reset بطريقة منضبطة. CLI له إعداد مستقل عادة عبر opcache.enable_cli، وتشغيله لسكربت قصير قد يضيف تكلفة بلا فائدة. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «إعداد إنتاجي مبدئي» و«المراقبة». لماذا لا يغني أحدهما عن الآخر داخل موضوع «OPcache وPreloading»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «إعداد إنتاجي مبدئي»: القيم ليست وصفة ثابتة. راقب عدد الملفات والذاكرة وhit rate وrestarts قبل تعديلها. مع validate_timestamps=1 يفحص OPcache تغيّر الملفات حسب revalidate_freq. مع validate_timestamps=0 لا يرى النشر الجديد حتى تعيد تشغيل FPM أو تستدعي reset بطريقة منضبطة. CLI له إعداد مستقل عادة عبر opcache.enable_cli، وتشغيله لسكربت قصير قد يضيف تكلفة بلا فائدة. أما «المراقبة»: لا تعرض endpoint يحوي opcache_get_status() للعامة؛ قد يكشف paths ومعلومات تشغيلية. اجعله داخليًا ومحميًا. مؤشرات تحتاج انتباهًا: cache_full أو امتلاء الذاكرة. oom_restarts وhash_restarts. انخفاض hit rate بعد warm-up. عدد scripts قريب من max_cached_keys. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «Preloading». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> من PHP 7.4 يمكن تشغيل ملف مرة عند بدء عملية الخادم لتحميل functions/classes/interfaces/traits في ذاكرة دائمة: التكلفة والمخاطر: يرفع الذاكرة الأساسية لكل بيئة تشغيل. أي تغيير في الكود المحمّل يحتاج restart؛ لا يكفي invalidation عادي. ترتيب الاعتماديات قد يهم إذا استخدمت require بدل opcache_compile_file(). لا يفيد تلقائيًا كل تطبيق؛ قِس قبل وبعد. Preloading غير مدعوم على Windows وفق دليل PHP، ومناسب أساسًا للعمليات… لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «النشر الصحيح» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> انشر ملفات release جديدة في directory منفصل. ثبّت الاعتماديات بـComposer وولّد autoloader محسّنًا. شغّل الاختبارات وhealth checks. بدّل symlink/release atomically. أعد تحميل FPM gracefully حتى ترى workers الكود وpreload الجديد. لا تخلط بين OPcache وComposer class map: الأول يخزّن bytecode، والثاني يسرّع العثور على الملف الذي يحتوي الصنف. استخدامهما معًا يعالج مرحلتين مختلفتين. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
