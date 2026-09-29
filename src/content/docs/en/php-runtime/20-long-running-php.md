---
title: 20. Long-running PHP and worker runtimes
description: Safely operating FrankenPHP, RoadRunner, Swoole, and Octane with state reset, memory bounds, signals, and deployment.
sidebar:
  order: 20
---

## Before you start

With FPM, a request begins with mostly clean PHP state and most memory disappears when the request ends. FrankenPHP Worker Mode, RoadRunner, Swoole, and Octane keep the process and application alive across requests. Bootstrap becomes cheaper, but the programming contract changes.

### New terms

- **Long-running runtime:** A PHP process handling many requests.
- **State leakage:** Data from one request becoming visible to a later request.
- **Reset hook:** A step returning a service to a clean state after each request.
- **Worker recycling:** Replacing a worker after a configured bound.

## What survives?

Static properties, singletons, globals, connections, and in-memory caches can survive. Do not place a request, user, or locale in a long-lived service. Keep request state in a context created and discarded for every cycle.

~~~php
final class RequestContext
{
    public function __construct(
        public readonly string $requestId,
        public readonly ?int $userId,
    ) {}
}

function handle(ServerRequestInterface $request): ResponseInterface
{
    $context = new RequestContext(bin2hex(random_bytes(8)), null);
    return dispatch($request, $context);
}
~~~

Send request A with sensitive identity and request B anonymously on the same worker. B must never observe A's values. Repeat enough times to exercise worker reuse.

## Memory and resources

A small leak per request becomes permanent growth. Record RSS every N requests and configure max jobs or max memory as a guard while fixing the cause. Close streams and cursors, remove temporary listeners, and detach context and tracing scopes in `finally`.

## Signals and deployment

On SIGTERM, stop accepting work, finish in-flight work within the grace period, flush telemetry, and exit. The platform deadline must exceed the intended drain time. A rolling deployment also requires session schemas, queue payloads, and database changes that work with two releases simultaneously.

## Choosing a model

FPM provides straightforward request isolation. A long-running runtime helps when bootstrap is expensive or the service needs concurrency or WebSockets, but requires reset support and leak tests. A hello-world benchmark is not enough evidence.

~~~text
FPM: request -> fresh execution -> response -> cleanup
Worker runtime: boot once -> request -> reset -> request -> reset -> recycle
~~~

Check whether extensions and clients are safe with threads or coroutines. Blocking I/O inside an event loop can stall many requests, and a connection does not become concurrency-safe because its API looks asynchronous.

## Local leakage exercise

~~~bash
php memory-lab.php
php resilience-lab.php
php long-running-state-lab.php
~~~

Then run the same application on a long-running runtime, send 1000 requests with changing identities, and watch RSS and static state. Acceptance requires no identity leak, stable memory after warm-up, and correct SIGTERM behavior.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><details><summary>Why is a singleton more dangerous here?</summary><p>It survives requests and may retain a previous user's data or request configuration.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>Does recycling fix a memory leak?</summary><p>It limits impact but does not remove the cause; measurement and repair remain necessary.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>What does a reset hook do?</summary><p>It clears request-specific state before the next request uses the service.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>When is FPM preferable?</summary><p>When isolation simplicity matters more than bootstrap cost or the application lacks a reliable reset lifecycle.</p></details></section>
</div>

#### Practice cycle

Write your prediction before running the example and record the output. Introduce one controlled failure, collect evidence from logs or metrics, repair the cause, and rerun the check to prove the fix handles the fault instead of hiding it.


### Try it yourself

Create a deliberate static-array leak, prove RSS growth or cross-request state, then add a reset, a regression test, and a worker recycling limit.
