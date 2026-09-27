---
title: 3. OPcache وPreloading
description: تخزين PHP bytecode وضبط OPcache ومراقبته والفرق بينه وبين cache البيانات وحدود Preloading.
sidebar:
  order: 3
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **API:** واجهة محددة تسمح لبرنامج يطلب بيانات أو ينفّذ عملية عند برنامج آخر.
- **Cache:** نسخة مؤقتة من البيانات هدفها تقليل وقت الانتظار والعمل المتكرر.
- **CLI:** واجهة تتعامل معها بكتابة أوامر نصية بدل الضغط على أزرار.


- **Composer:** مدير حزم PHP يثبت المكتبات ويجهز التحميل التلقائي.
- **OPcache:** ذاكرة تحفظ نتيجة ترجمة PHP لتجنب تكرار العمل مع كل طلب.
- **Redis:** مخزن سريع في الذاكرة يُستخدم للكاش والجلسات والطوابير.

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

## مسألة تشغيلية

<details><summary>هل OPcache يخزن نتيجة الـrequest؟</summary><p>لا؛ يخزن bytecode المترجم لتجنب parsing/compilation المتكرر، أما data cache فيخزن بيانات التطبيق.</p></details>

## شغّل وتحقق

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php -d opcache.enable_cli=1 -r "var_export(opcache_get_status(false) !== false);"
~~~

**معيار النجاح:** الناتج <code>true</code>. بعد ذلك قارن hits وmisses قبل وبعد حمل متكرر، ولا تعتبر تفعيل OPcache وحده دليل تحسن.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

قس memory_consumption وinterned strings وhit/miss وwasted percentage لتحديد sizing بدل نسخ إعداد. Invalidation وtimestamp policy يجب أن تتوافق مع atomic deployment. JIT لا يسرع كل workload ويبقى منفصلًا عن فائدة OPcache الأساسية. Preloading يثبت classes داخل عمر العملية ويتطلب restart عند التغيير.

### جرّب بنفسك

اجمع metrics قبل وبعد حمل مكرر وفسر eviction أو restart.
