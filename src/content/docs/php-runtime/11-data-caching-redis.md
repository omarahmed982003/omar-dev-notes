---
title: 11. Data Caching وRedis
description: Cache-aside وTTL وinvalidation وstampede وdistributed locks والفرق عن OPcache وHTTP cache.
sidebar:
  order: 11
---

## قبل ما تبدأ

ذاكر الدرس على 3 خطوات: افهم المشكلة الأول، تابع المثال، وبعدها جرّب الجزء العملي بنفسك. المصطلحات الجديدة الموجودة تحت متشرحة قبل ما ندخل في التفاصيل.

### كلمات جديدة في الدرس

- **HTTP:** قواعد تبادل الطلبات والردود بين المتصفح والخادم.
- **Cache:** نسخة مؤقتة من البيانات هدفها تقليل وقت الانتظار والعمل المتكرر.
- **Session:** بيانات مؤقتة تساعد الخادم يميّز المستخدم بين أكثر من طلب.
- **Token:** قيمة تمثل هوية أو صلاحية محددة بدل إرسال كلمة السر كل مرة.


## أي Cache؟

- **OPcache:** PHP bytecode.
- **HTTP cache:** responses حسب HTTP semantics.
- **Application/Data cache:** نتائج queries أو حسابات.
- **Local in-process:** سريع لكنه غير مشترك وقد يختلف بين workers.

Redis أداة شائعة للبيانات المشتركة، لكنه ليس مصدر الحقيقة تلقائيًا.

## Cache-aside

```php
$key = "product:{$id}:v1";
$json = $redis->get($key);

if ($json === false) {
    $product = $repository->find($id);
    $json = json_encode($product, JSON_THROW_ON_ERROR);
    $redis->setex($key, 300, $json);
}

return json_decode($json, true, flags: JSON_THROW_ON_ERROR);
```

عند الكتابة حدّث database أولًا ثم احذف/حدّث cache وفق استراتيجية واضحة. توقع stale data خلال نافذة محددة.

## المفاتيح وTTL

- ضع namespace/version في المفتاح.
- أضف jitter للـTTL حتى لا تنتهي آلاف المفاتيح معًا.
- لا تجعل `KEYS *` جزءًا من request path.
- حدّد serialization format وحجمه.
- لا تخزن secret لمجرد أن Redis “داخلية”.

## Cache stampede

عند انتهاء key مشهورة قد تعيد عدة requests بناءها معًا. حلول:

- lock قصير مع timeout.
- stale-while-revalidate.
- probabilistic early refresh.
- single-flight داخل العملية.

الـlock يجب أن تملك token فريدة وتحررها فقط إن كنت ما زلت المالك. لا تعتبر distributed lock حلًا بسيطًا لكل consistency.

## الفشل

حدد هل cache **optimization** يمكن تجاوزها أم dependency أساسية مثل session store. ضع timeouts قصيرة وراقب hit ratio وevictions وmemory وlatency. لا تجعل سقوط Redis يحول كل traffic فجأة إلى database بلا load protection.

## Invalidation

“هناك شيئان صعبان” ليست خطة. اكتب لكل key:

- من ينشئها؟
- ما source of truth؟
- متى تحذف أو تتغير؟
- ما أقصى stale time؟
- ماذا يحدث عند failure؟

## مسألة تشغيلية

<details><summary>إيه أصعب مشكلة في cache؟</summary><p>الإبطال والاتساق: لازم تحدد المفتاح والـTTL ومتى تحذف أو تحدث النسخة بعد تغيير المصدر.</p></details>

## شغّل وتحقق

الناتج المحلي database=11 stale_cache=10 ثم obsolete_refill=rejected يوضح السباق. ده نموذج ترتيب أحداث؛ فحص TTL والانقطاع والحمل يحتاج Redis حقيقيًا.

استخدم [المختبر القابل للتنزيل](/php/00-lab-setup/) للسكربتات المرفقة. أوامر Composer وFPM وDocker والخادم الحقيقي تُنفذ داخل المشروع المُجهز للخدمة، مش مجلد فاضي.

نفّذ نقطة التحقق التالية داخل بيئة الدرس:

~~~bash
php cache-lab.php
~~~

**هدف تجربة التكامل الموسعة:** القراءة الأولى <code>source=db</code> والثانية <code>source=cache</code>، وفي الاختبار التسلسلي بعد التحديث تقرأ القيمة الجديدة وتتأكد من TTL؛ ده لا يثبت غياب القراءات القديمة أثناء التزامن.

دوّن كود الخروج والدليل الفعلي. إذا اختلف الناتج، فسر البيئة أو الفرضية التي اختلفت بدل تعديل «المتوقع» حتى يطابق الخطأ.

## اربط النقاط ببعض

اختر Redis structure حسب العقد: string وhash وset وsorted set وstream ليست متبادلة. افهم eviction policy والحد الأقصى للذاكرة، وحدد أثر replication lag وfailover. Cache ليست مصدر الحقيقة؛ صمم stale tolerance وinvalidations وstampede lock وfallback عند غياب Redis.

### جرّب بنفسك

اقطع Redis أثناء الحمل وأثبت صحة البيانات حتى لو انخفض الأداء.


## إعادة ملء الـcache ممكن تتسابق مع الحذف

تتبّع الترتيب ده: القارئ A مايلقيش المفتاح ويقرأ 10 من قاعدة البيانات؛ الكاتب B يحفظ 11 ويحذف المفتاح؛ A يكمل ويحفظ 10 في cache. حذف المفتاح بعد commit إذن مش ضمان لقراءة حديثة. TTL بيحد بقاء القيمة بعد إدخالها، لكن مش بالضرورة عمرها كله لو قراءة قديمة اتأخرت قبل التخزين.

لقرارات المخزون والدفع، اقرأ وطبّق القيود في قاعدة البيانات. للعرض، حدد مدة قدم مقبولة وحدًا لعمر القارئ؛ ممكن تستخدم مفاتيح بإصدار ومصدر موثوق للإصدار الحالي، أو فحص إصدارات منسق قبل نشر القيمة. القفل اللي انتهت مهلة ملكيته محتاج حماية بإصدار كمان. تدريب: أعد ترتيب الأحداث بعميلين توقفهما مؤقتًا؛ المتوقع إن النسخة الساذجة تعرض 10، وبعد الإصلاح تثبت منع نشر الإصدار القديم.
