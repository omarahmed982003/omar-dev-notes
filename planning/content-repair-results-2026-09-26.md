# تنفيذ إصلاحات المحتوى — 26 سبتمبر 2026

المرجع التحريري: [دليل كتابة الدروس](content-writing-guide.md). هذا سجل التنفيذ اللاحق لـ[التدقيق الأصلي](content-forensic-review-2026-09-26.md)، وليس إعادة استخدام أرقام أسطره بعد التعديل.

## الإصلاحات المرتبطة بالتدقيق

| رقم | الموضوع | ما تغير ودليل التحقق | موضع الشرح العربي |
|---|---|---|---|
| 1 | تعريفات Markdown داخل PHP | نُقلت التعريفات خارج كتل الكود؛ فحص الصياغة يشمل النسختين. | [الدرس](../src/content/docs/php/01-introduction-and-syntax.md) |
| 2 | بادئة PSR-4 | تصحيح escaping وفحص قيمة App\ بعد تحليل JSON في سكربت التحقق. | [الدرس](../src/content/docs/php/10-namespaces-autoloading.md) |
| 3 | هدف Attribute | TARGET_FUNCTION مع newInstance وقراءة admin في اللغتين، واختبار تنفيذ. | [الدرس](../src/content/docs/php/16-modern-php-features.md) |
| 4 | نهاية نص المبلغ | استخدام \A و\z ورفض السطر الجديد بدل تحويله لمبلغ آخر. | [الدرس](../src/content/docs/php/17-integrated-programs-debugging.md) |
| 5 | تجاوز مدى الأموال | فحص النص قبل التحويل وفحص الجمع والضرب قبل تنفيذهما. | [الدرس](../src/content/docs/php/17-integrated-programs-debugging.md) |
| 6 | تحويل IDs بلا تحقق | قائمة محدودة وأعداد موجبة بصيغة صريحة؛ رفض المصفوفة المتداخلة و12x. | [الدرس](../src/content/docs/php/02-variables-scope-superglobals.md) |
| 7 | trim على مصفوفة GET | التحقق من is_string قبل trim مع قيمة افتراضية. | [الدرس](../src/content/docs/php/01-introduction-and-syntax.md) |
| 8 | تكرار jobs | معاملة واحدة وقيد فريد وoutbox وربط مفتاح التكرار بالمدخلات. | [الدرس](../src/content/docs/php-runtime/12-queues-workers-scheduling.md) |
| 9 | إعادة استخدام TOTP | جعل المنع إلزاميًا وشرح الاستهلاك الذري للخطوة المطابقة. | [الدرس](../src/content/docs/auth/14-mfa-passkeys.md) |
| 10 | غياب exp | سياسة claims صريحة بعد التحقق من التوقيع؛ اختبار غياب الحقول وأنواع aud. | [الدرس](../src/content/docs/auth/08-jwt-security.md) |
| 11 | CSRF ومصدر الطلب | فحص Origin فعلي مع token وتوثيق سياسة رفض غياب المصدر. | [الدرس](../src/content/docs/auth/03-csrf.md) |
| 12 | AAD في secretbox | الإبقاء على شرح secretbox وإضافة AEAD كامل واختبار تغيير السياق. | [الدرس](../src/content/docs/auth/06-encryption-http-auth.md) |
| 13 | Basic عبر HTTP | منع إرسال الاعتماد قبل TLS وتوضيح أن redirect لا يصلح التسريب السابق. | [الدرس](../src/content/docs/auth/06-encryption-http-auth.md) |
| 14 | اختلاف سياسة rehash | سياسة واحدة للخوارزمية والإعدادات عند الإنشاء وإعادة الـhash. | [الدرس](../src/content/docs/auth/05-password-hashing.md) |
| 15 | password_hash يرجع false | توضيح أخطاء PHP 8 بدل فرع سلوك PHP 7 القديم. | [الدرس](../src/content/docs/auth/05-password-hashing.md) |
| 16 | CSV في PHP 8.4 | escape فارغ صريح واختبار كتابة/قراءة للتنصيص والفواصل والعربي. | [الدرس](../src/content/docs/php/08-files-streams-data.md) |
| 17 | قائمة C++ وEOF | قراءة سطر كامل ورفض الباقي والتعامل مع EOF خارج شرط اختيار قديم. لم يتوفر مترجم للتنفيذ المحلي. | [الدرس](../src/content/docs/cpp/loops-competitive/04-loops-counters-accumulators.md) |
| 18 | If-None-Match | تحليل القائمة وW/ والنجمة والفواصل داخل الوسم؛ مسار GET/HEAD واختبار HTTP فعلي. | [الدرس](../src/content/docs/programming-basics/10-http-caching-compression.md) |
| 19 | Scope وSanitizer | تعريف Scope كتفويض داخل auth، وSanitizer كتنقية HTML في XSS. | [الدرس](../src/content/docs/auth/04-xss.md) |
| 20 | اتجاه المعاملات | تقييد قاعدة اليسار بالعمليات المناسبة والتنبيه لاختلاف الارتباط. | [الدرس](../src/content/docs/programming-basics/math-problem-solving/01-arithmetic-foundations.md) |
| 21 | زيادة المجموع بمقدار N | تمييز تكرار N عن إضافة N+1 مع مثال N=3. | [الدرس](../src/content/docs/programming-basics/math-problem-solving/06-flowcharts-loops-debugging.md) |
| 22 | Unicode وترميز البايتات | تمييز معيار code points عن UTF-8 وتمثيل البايتات. | [الدرس](../src/content/docs/programming-basics/computer-fundamentals/03-binary-languages-algorithms.md) |
| 23 | customer_id مقابل user_id | توحيد عمود التمرين مع المخطط. | [الدرس](../src/content/docs/database/05-schema-indexes-migrations.md) |
| 24 | وعد حداثة cache | حصر معيار التسلسل وشرح سباق refill ونموذج محلي يعيد المشكلة. | [الدرس](../src/content/docs/php-runtime/11-data-caching-redis.md) |
| 25 | الاختبار مع قاعدة بيانات | الفصل بين unit test واختبارات integration الضرورية. | [الدرس](../src/content/docs/oop/08-review-checklist.md) |
| 26 | ترقيم الويب | عناوين 9 إلى 16 مطابقة للملفات وترتيب المسار. | [الدرس](../src/content/docs/programming-basics/09-browser-rendering-devtools.md) |
| 27 | تكافؤ الأمثلة | توحيد أمثلة الإصلاح والإضافات باللغتين، ومنها Argon2 وAttribute وCSV والمختبرات. لا يُستنتج من هذا تدقيق لغوي شامل لكل فقرة قديمة. | [الدرس](../src/content/docs/en/auth/05-password-hashing.md) |

## تغطية تعليمية أضيفت

- تمهيد SQL قبل PDO/ORM: الجداول والعلاقات والقيود وNULL وJOIN وGROUP BY وHAVING والتعديل، مع برنامج SQLite ونتيجة معلومة.
- مجموعات واحتمالات بأمثلة حسابية، وتتبع BFS، ومثال مضاد للجشع ثم حل بالبرمجة الديناميكية وحالات غير قابلة للتحقيق.
- درسان بعد حلقات C++ للدوال والحاويات والمراجع ثم الكائنات وSTL وRAII، مع برامج كاملة وحدود إدخال وإخراج وتحديث روابط المسار.
- حل Checkout قابل للتشغيل: Money وعملات وحدود، انتقال حالة Order، بوابة ومستودع وساعة وإشعارات قابلة للاستبدال، واختبارات حالة وعدد نداءات.
- رحلة حساب محلية: دخول وجلسة عشوائية وانتهاء وملكية طلب وتكرار آمن واسترجاع أحادي الاستخدام وإلغاء جلسات وسجل تدقيق بلا أسرار.
- مختبرات فعلية في `examples/php-labs`، وfixtures وschema وbootstrap، ودليل تجهيز عربي وإنجليزي وأرشيف تنزيل.
- نقاط التحقق تفرق بين ناتج البرنامج المرفق وهدف تجربة التكامل الموسعة. إزالة اسم ملف غير موجود لا تعني تحويل محاكاة إلى اختبار خدمة حقيقية.

## إعادة التحقق

النتيجة النهائية: **154 صفحة تغيرت، منها 8 صفحات جديدة؛ 38 ملف PHP للمختبرات؛ 76 أمر تحقق ناجح على PHP 8.4 و76 على PHP 8.5؛ 467 كتلة PHP فُحصت (4 مقتطفات صنف معلنة، ولا خطأ صياغة غير مفسر)، و21 كتلة JSON صحيحة؛ صفر روابط Markdown داخلية مكسورة؛ بناء 272 صفحة نجح.**

```text
python scripts/verify-lesson-labs.py --php /path/to/php
python scripts/package-lesson-labs.py
npm run build
```

نتائج التشغيل التفصيلية المحلية موجودة في `tmp/content-repair/verified-8.4.json` و`verified-8.5.json`، وفحص الصياغة في `final-content-checks.json`، وسجل البناء في `build-final.log`.

- تشغيل PHP 8.4 و8.5 يتضمن الاختبارات الأساسية والبرامج التطبيقية والحالات المرفوضة، وخادم HTTP محليًا، وعمليتين حقيقيتين تتنافسان على المخزون.
- اختبارات المخزون تثبت معاملة SQLite والتكرار وrollback؛ لا تثبت خصائص MySQL أو PostgreSQL تلقائيًا.
- فحص PHP syntax لا يُعامل طرق الصنف المعروضة كمقتطفات على أنها ملفات مستقلة. ونجاح syntax وحده لا يثبت صحة runtime أو فهم القارئ.
- فحص روابط Markdown الداخلية شمل وجود الصفحات والملفات المشار إليها؛ البناء يولد 272 صفحة.

## حدود لا يصح إخفاؤها

لم يتوفر مترجم C++، ولذلك أمثلته خضعت لمراجعة منطقية لا تشغيل مترجم محلي. لم تُشغّل خدمات Redis أو FPM أو Docker أو مزود هوية/دفع خارجي أو محركات قواعد بيانات أخرى؛ الدروس تشرح متطلبات اختبارها ولا تنسب نتائج المختبر المحلي إليها. رحلة الحساب محلية وليست خدمة جاهزة للنشر: حدود HTTP والبريد والقيود التشغيلية موضحة بجوار المثال.

المعالجة تحل الأخطاء المحددة وتضيف تطبيقات للمناطق الناقصة المذكورة في التدقيق. لا تعني عبارة «الملاحظات عولجت» إثبات خلو كل جملة قديمة من أي خطأ ممكن أو اكتمال كل فروع علوم الحاسب. قياس الجودة هو العقود والأمثلة والشرح والنتائج الفعلية، وليس طول الصفحات.
