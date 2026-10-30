---
title: 5. PHP-FPM and process management
prev: {"link":"/en/php-runtime/06-web-servers-fastcgi/","label":"Apache, Nginx, and FastCGI"}
next: {"link":"/en/php-runtime/03-opcache-preloading/","label":"OPcache and preloading"}
description: FastCGI, master and workers, pools, static/dynamic/ondemand modes, capacity, and monitoring.
sidebar:
  order: 5
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **Worker:** An execution unit assigned work. Here it is a PHP process handling a request, not a queue consumer. A process is a running program instance with its own identity and resources.


- **OPcache:** Memory that keeps compiled PHP instructions for later requests.
- **PHP-FPM:** A process manager that runs PHP workers for a web server.
- **FastCGI:** A protocol used to send execution work to PHP-FPM.
- **Nginx:** A web server that serves files or forwards PHP requests.
- **Log:** A timestamped record of an application event.

# PHP-FPM is not an HTTP server

PHP-FPM is PHP's primary **FastCGI Process Manager**. A trusted web server sends it FastCGI requests; FPM manages PHP processes and returns responses.

```text
Nginx/Apache -> FastCGI socket -> FPM master -> worker -> PHP response
```

Never expose FPM to an untrusted network. Bind a Unix socket or an internal interface and configure socket permissions and `listen.allowed_clients` where applicable.

## Master, workers, and pools

- The master reads pool configuration and controls lifecycle.
- A worker normally executes one PHP request at a time.
- A pool groups workers under a user/group, listener, limits, and PHP settings.

Separate applications into pools and OS identities where isolation matters.

The **listener** accepts FastCGI connections for a pool. When all workers are busy, connections not yet accepted may wait in the **listen queue**, a bounded queue of pending connections. The following snapshot uses two workers to explain capacity, not to recommend a configuration.

<figure class="concept-visual" aria-labelledby="fpm-workers-visual-en">
<div class="visual-heading" id="fpm-workers-visual-en">Who manages workers, and who executes a request?</div>
<div class="visual-panel"><p class="visual-label">FPM master — management</p><p>Reads configuration and manages worker creation and shutdown; it is not a PHP execution stage for every request.</p></div>
<div class="visual-arrow" aria-hidden="true">↓</div>
<div class="visual-panel"><p class="visual-label">Pool — workers grouped under the same service settings</p><div class="visual-grid"><div class="visual-step"><span class="visual-tag">Worker 1</span><p>Executing request A now.</p></div><div class="visual-step"><span class="visual-tag">Worker 2</span><p>Executing request B now.</p></div></div></div>
<div class="visual-panel"><p class="visual-label">Request path — separate from management</p><div class="visual-row" dir="ltr"><div class="visual-step">Nginx / Apache</div><span class="visual-arrow" data-arrow="forward" aria-hidden="true"></span><div class="visual-step">FastCGI listener</div><span class="visual-arrow" data-arrow="forward" aria-hidden="true"></span><div class="visual-step">Available worker</div></div></div>
<p class="visual-note">Request C still needs an available worker. With both busy, its connection may wait in the bounded listen queue, or fail/time out according to listener and web-server limits. Size workers against memory, CPU, and downstream services.</p>
<figcaption>The arrow from the master to the pool denotes lifecycle management. FastCGI goes through the listener to a worker; including the master in the simplified text line above does not mean it executes or relays every request itself.</figcaption>
</figure>

See the [official FPM configuration reference](https://www.php.net/manual/en/install.fpm.configuration.php) for `pm.max_children`, `listen`, and `listen.backlog`. The [PHP source](https://github.com/php/php-src/blob/master/sapi/fpm/fpm/fpm_main.c) separates worker request acceptance from master management.

## Process-manager modes

```ini
pm = static
pm.max_children = 20
```

```ini
pm = dynamic
pm.max_children = 40
pm.start_servers = 8
pm.min_spare_servers = 4
pm.max_spare_servers = 12
```

```ini
pm = ondemand
pm.max_children = 20
pm.process_idle_timeout = 10s
```

`static` avoids spawn latency but reserves memory. `dynamic` is a common balance. `ondemand` helps low-traffic pools at the cost of cold starts.

## Capacity from measurements

Estimate:

```text
RAM budget for FPM / realistic high-percentile worker RSS
```

Leave headroom for the operating system, web server, OPcache, and other services. Do not divide RAM by `memory_limit`; that limit is not the worker's typical resident set.

Arrival rate also matters. At 100 requests/s and a 200 ms average service time, average concurrency is roughly 20 workers. Peaks and tail latency need additional headroom, while excessive workers can overload the database.

## Operational settings

```ini
pm.max_requests = 500
request_terminate_timeout = 30s
request_terminate_timeout_track_finished = yes
request_slowlog_timeout = 3s
slowlog = /var/log/php-fpm/app-slow.log
catch_workers_output = yes
ping.path = /fpm-ping
pm.status_path = /fpm-status
```

```text
concurrency = throughput × latency = 100 × 0.2 = 20 workers
```

Monitor active/idle processes, listen queue, slow traces, and `max children reached`. Keep status endpoints private.

Use graceful reloads during deployment. `fastcgi_finish_request()` can flush the response before brief follow-up work, but it still occupies a worker; durable or heavy tasks belong in a queue worker. By default FPM does not apply `request_terminate_timeout` after request completion or `fastcgi_finish_request()`; `request_terminate_timeout_track_finished` extends the limit to that phase.

## Operational problem

<details><summary>Why not raise FPM workers without calculation?</summary><p>They can exhaust memory and overload CPU or databases; size from process memory, workload, and downstream limits.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Start the `examples/php-labs/production` environment as described in its README, then run:

~~~bash
curl -sS -o /dev/null -w "status=%{http_code} total=%{time_total}
" http://127.0.0.1:8080/health
~~~

**Success criterion:** The health check returns 200 and `docker compose ps` reports both services healthy. Under controlled load the worker count stays bounded; correlate delay with the FPM queue rather than guessing. In Windows PowerShell, replace `/dev/null` with `NUL`.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Expose the FPM status page and slowlog only on a protected internal path to inspect active/idle workers, listen queue, and slow requests. Measure memory per child under load and reserve headroom. In containers, do not let autoscaling hide bad max_children, and align graceful termination with platform deadlines.

#### Practice cycle

Write your prediction before running the example and record the output. Introduce one controlled failure, collect evidence from logs or metrics, repair the cause, and rerun the check to prove the fix handles the fault instead of hiding it.


### Try it yourself

Correlate queue growth with slowlog and RSS before changing worker count.
