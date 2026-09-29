---
title: 18. Sessions and shared state at scale
description: Session storage, locking, horizontal scaling, expiration, garbage collection, and failure behavior.
sidebar:
  order: 18
---

## Before you start

A session connects a user's requests. File storage can appear sufficient on one host, but storage location, locking, and expiration become operational decisions as soon as the application has multiple replicas.

### New terms

- **Session handler:** The component that reads and writes session data.
- **Horizontal scaling:** Running more than one application replica.
- **Sticky session:** Routing a user to the same replica using a cookie or address.
- **Lock contention:** A request waiting because another request holds the same lock.

## Why file sessions fail across replicas

The default `files` handler writes to local disk. A later request routed to another replica cannot see that file unless you add shared storage or sticky routing. Shared disks add latency and a failure dependency. Sticky routing restricts load distribution and does not preserve state when a replica disappears.

A shared store such as Redis lets every replica see the same session. It also becomes critical infrastructure: an outage may block login or checkout, so use short timeouts, monitoring, and an explicit failure policy.

## Locking and parallel requests

The file handler locks a user's session from `session_start()` until request shutdown or `session_write_close()`. A slow AJAX request can therefore block that user's later requests even while other FPM workers are idle.

~~~php
session_start();
$userId = $_SESSION['user_id'] ?? null;
session_write_close();

$report = buildSlowReport($userId);
~~~

Close the session after its final required mutation. Check the locking semantics of the selected Redis handler; disabling locks can produce lost updates.

## Safe configuration

~~~ini
session.use_strict_mode=1
session.use_only_cookies=1
session.cookie_httponly=1
session.cookie_secure=1
session.cookie_samesite=Lax
session.gc_maxlifetime=1800
~~~

Align store TTL with cookie lifetime and logout policy. Use native key expiry for a central store instead of probabilistic request-time garbage collection. Regenerate the ID after login or privilege change, and avoid serialized object graphs tied to one code release.

## Deployment compatibility

During a rolling deployment, new code can read a session written by old code. Use a small versioned schema and accept both versions during migration. Test logout, expiry, and key rotation rather than accidentally logging out every user during deployment.

## Lab

Start the complete environment:

~~~bash
docker compose -f production/compose.yaml -f production/compose.full.yaml up --build -d
curl -c cookies.txt -b cookies.txt http://127.0.0.1:8080/session
curl -c cookies.txt -b cookies.txt http://127.0.0.1:8080/session
docker compose -f production/compose.yaml -f production/compose.full.yaml exec redis redis-cli -n 1 scan 0
~~~

The `visits` value should rise from 1 to 2 and a session key should appear in Redis. Add a temporary delay, issue two parallel requests, then close the session early and compare wait time.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><details><summary>Why do file sessions fail with two replicas?</summary><p>The file is local, so the next request may reach a replica that does not have it.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>When should session_write_close run?</summary><p>After the final session read or write and before slow work that does not need the session.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>Are sticky sessions a complete shared-store replacement?</summary><p>No. They reduce scheduling freedom and do not preserve state when a replica disappears.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>What should be monitored?</summary><p>Read and write latency, errors, lock wait, key count, expirations, and memory use.</p></details></section>
</div>

#### Practice cycle

Write your prediction before running the example and record the output. Introduce one controlled failure, collect evidence from logs or metrics, repair the cause, and rerun the check to prove the fix handles the fault instead of hiding it.


### Try it yourself

Predict the result, run both requests, stop Redis and observe the HTTP status, then restore it and prove the application does not silently fall back to local state.
