---
title: 11. Data Caching وRedis
description: Cache-aside وTTL وinvalidation وstampede وdistributed locks والفرق عن OPcache وHTTP cache.
sidebar:
  order: 11
---

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

## خريطة الدرس

<div class="lesson-diagram" role="img" aria-label="خريطة مفاهيم: Data Caching وRedis">
<p class="lesson-diagram-title">خريطة مفاهيم: Data Caching وRedis</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>أي Cache؟</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Cache-aside</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>المفاتيح وTTL</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Cache stampede</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>الفشل</span></div>
</div>
</div>

## تأكد من فهمك

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>اشرح «أي Cache؟» كأنك تراجع تطبيقًا حقيقيًا: ما الهدف وما أهم قيد يجب الانتباه له؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> OPcache: PHP bytecode. HTTP cache: responses حسب HTTP semantics. Application/Data cache: نتائج queries أو حسابات. Local in-process: سريع لكنه غير مشترك وقد يختلف بين workers. Redis أداة شائعة للبيانات المشتركة، لكنه ليس مصدر الحقيقة تلقائيًا. عمليًا، لا يكفي تنفيذ المسار الناجح؛ يجب توثيق الافتراضات والتحقق من القيم والحالات التي قد تكسر هذا السلوك.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>قارن بين «أي Cache؟» و«Cache-aside». لماذا لا يغني أحدهما عن الآخر داخل موضوع «Data Caching وRedis»؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> في «أي Cache؟»: OPcache: PHP bytecode. HTTP cache: responses حسب HTTP semantics. Application/Data cache: نتائج queries أو حسابات. Local in-process: سريع لكنه غير مشترك وقد يختلف بين workers. Redis أداة شائعة للبيانات المشتركة، لكنه ليس مصدر الحقيقة تلقائيًا. أما «Cache-aside»: عند الكتابة حدّث database أولًا ثم احذف/حدّث cache وفق استراتيجية واضحة. توقع stale data خلال نافذة محددة. العلاقة بينهما أن الأول يحدد جانبًا من الحل، والثاني يكمل السلوك أو القيود اللازمة لتطبيقه بصورة صحيحة.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>افترض أن نظامًا تجاهل «المفاتيح وTTL». ما العطل أو الخطر المتوقع، وكيف تصمم اختبارًا يكشفه؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> ضع namespace/version في المفتاح. أضف jitter للـTTL حتى لا تنتهي آلاف المفاتيح معًا. لا تجعل KEYS * جزءًا من request path. حدّد serialization format وحجمه. لا تخزن secret لمجرد أن Redis “داخلية”. لاكتشاف الخلل، اختبر مسارًا صحيحًا، وقيمة عند الحد، ومدخلًا غير صالح، ثم راقب النتيجة والآثار الجانبية والسجل بدل الاكتفاء بعدم ظهور Exception.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>حوّل «Cache stampede» إلى قرار هندسي قابل للمراجعة. ما الذي ستوثقه وما الحالات التي ستختبرها؟</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">اعرض الإجابة</span><span class="quiz-hide">إخفاء الإجابة</span></summary><div class="quiz-answer-body"><strong>الإجابة المشروحة:</strong> عند انتهاء key مشهورة قد تعيد عدة requests بناءها معًا. حلول: lock قصير مع timeout. stale-while-revalidate. probabilistic early refresh. single-flight داخل العملية. الـlock يجب أن تملك token فريدة وتحررها فقط إن كنت ما زلت المالك. لا تعتبر distributed lock حلًا بسيطًا لكل consistency. وثّق سبب الاختيار والبدائل والحدود، واختبر الحالة العادية، والحد الأدنى والأقصى، والفشل الجزئي، وإعادة المحاولة أو التكرار إن كان السلوك يسمح بذلك.</div></details>
</section>
</div>
