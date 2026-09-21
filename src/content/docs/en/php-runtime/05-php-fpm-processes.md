---
title: 5. PHP-FPM and process management
description: FastCGI, master and workers, pools, static/dynamic/ondemand modes, capacity, and monitoring.
sidebar:
  order: 5
---

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

## Process-manager modes

```ini
; Fixed workers, predictable memory
pm = static
pm.max_children = 20

; Or elastic capacity with warm spare workers
pm = dynamic
pm.max_children = 40
pm.start_servers = 8
pm.min_spare_servers = 4
pm.max_spare_servers = 12

; Or spawn only when requested
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
request_slowlog_timeout = 3s
slowlog = /var/log/php-fpm/app-slow.log
catch_workers_output = yes
ping.path = /fpm-ping
pm.status_path = /fpm-status
```

Monitor active/idle processes, listen queue, slow traces, and `max children reached`. Keep status endpoints private.

Use graceful reloads during deployment. `fastcgi_finish_request()` can flush the response before brief follow-up work, but it still occupies a worker; durable or heavy tasks belong in a queue worker.
