---
title: 11. Data caching and Redis
description: Cache-aside, TTL, invalidation, stampede protection, distributed locks, and failure policy.
sidebar:
  order: 11
---

## Know the cache layer

OPcache stores PHP bytecode, HTTP caches store responses, application caches store computed/query data, and local in-process caches are fast but not shared. Redis is a common shared data cache, not automatically the source of truth.

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

After a write, update the database first and then invalidate or refresh the cache according to an explicit consistency policy.

## Keys, TTL, and stampedes

Version key names, add TTL jitter, avoid `KEYS *` in request paths, define serialization, and never treat an internal cache as a safe secret store. Popular expired keys can trigger a rebuild stampede; consider a short lock, stale-while-revalidate, early refresh, or single-flight.

A lock needs a unique ownership token and safe release. Distributed locking is not a universal consistency solution.

## Failure policy

Decide whether the cache is an optional optimization or a required dependency such as a session store. Use short timeouts and monitor hit ratio, evictions, memory, and latency. Prevent cache failure from instantly flooding the database.

For each key document its writer, source of truth, invalidation event, maximum stale time, and failure behavior.

