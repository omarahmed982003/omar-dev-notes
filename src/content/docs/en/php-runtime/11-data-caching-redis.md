---
title: 11. Data caching and Redis
description: Cache-aside, TTL, invalidation, stampede protection, distributed locks, and failure policy.
sidebar:
  order: 11
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **Cache:** A temporary copy that reduces waiting and repeated work.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **Token:** A value representing identity or permission without resending a password.


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

## Operational problem

<details><summary>What is the hardest cache problem?</summary><p>Invalidation and consistency: define keys, TTL, and how cached values change when the source changes.</p></details>

## Run and verify

Local output database=11 stale_cache=10 followed by obsolete_refill=rejected demonstrates the race. This is an event-order model; TTL, outages, and load need real Redis.

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php cache-lab.php
~~~

**Extended integration exercise target:** The first read reports <code>source=db</code>, the second <code>source=cache</code>, and a sequential read after update returns the new value; assert TTL separately. This does not establish freshness under concurrent refill.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Choose Redis structures by contract: strings, hashes, sets, sorted sets, and streams are not interchangeable. Understand eviction policy, memory limits, replication lag, and failover. Cache is not the source of truth; define stale tolerance, invalidation, stampede control, and fallback.

### Try it yourself

Disable Redis under load and prove data remains correct even if performance drops.


## Refill can race with invalidation

Trace this schedule: reader A misses cache and reads database value 10; writer B commits 11 and deletes the cache key; A resumes and caches 10. Deleting after commit therefore does not guarantee fresh reads. TTL bounds how long a stored entry survives after insertion; it does not automatically bound total age if an old read is delayed before insertion.

For stock/payment decisions, read and enforce constraints in the database. For a display cache, declare an acceptable stale window and bound reader lifetime; consider versioned keys with a trustworthy current-version source or coordinated version checks before publishing a refill. A lock with an expired lease needs fencing/version checks too. Exercise: reproduce the schedule with two paused clients; expect the naive cache to show 10, then verify the chosen fix prevents publishing an obsolete version.
