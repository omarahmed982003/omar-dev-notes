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

