---
title: "Runtime & Production Section — PHP"
prev: {"link":"/en/php/","label":"PHP guide"}
next: {"link":"/en/php-runtime/08-cli-ini-extensions/","label":"PHP CLI, php.ini, and extensions"}
description: From Composer, OPcache, and PHP-FPM to testing, Redis, queues, deployment, observability, resilience, and recovery.
sidebar:
  order: 0
---

# Running PHP from development to production

This path explains the tools and layers around PHP after the application code is written. It gradually separates dependency management, HTTP clients, web serving, and PHP-FPM so the role of each part stays clear.

## Its place in the PHP track

This is the second section of [PHP: Language, Applications & Production](/en/php/), not a separate homepage card. Runtime means the execution environment; production means a service used by real users. Keeping these concerns in a section distinguishes language learning from operating the application.

## Choose an entry point

Begin after a small PHP application and an understanding of functions, Composer, and HTTP. Read8,7,1,10 for environment, configuration, dependencies, and tests. After Linux basics, read6,5,3,9,13 for web servers, FPM, OPcache, logs, and deployment. Use2 when integrating an outbound HTTP service, and14 for deeper dependency security before approving a release.

Lessons4,11,12,15–20 deepen memory, caching, queues, measurement, resilience, recovery, and scaling. Database experiments need SQL and transactions. FPM, systemd, and pcntl labs need Linux or an isolated Linux environment, not native Windows commands. Existing numbers remain reference labels rather than a strict prerequisite order.

Composer here deepens production after language lesson10, and quality testing expands the earlier tests rather than restarting them. Keep each experiment's evidence and limits explicit: a local model does not demonstrate a real Redis or FPM service.

## Learning path

1. [Composer and dependency management](/en/php-runtime/01-composer-dependencies/)
2. [cURL and HTTP clients](/en/php-runtime/02-curl-http-clients/)
3. [OPcache and preloading](/en/php-runtime/03-opcache-preloading/)
4. [PHP memory and garbage collection](/en/php-runtime/04-memory-garbage-collection/)
5. [PHP-FPM and process management](/en/php-runtime/05-php-fpm-processes/)
6. [Apache, Nginx, and FastCGI](/en/php-runtime/06-web-servers-fastcgi/)
7. [Environment variables and configuration](/en/php-runtime/07-environment-configuration/)
8. [PHP CLI, php.ini, and extensions](/en/php-runtime/08-cli-ini-extensions/)
9. [Logging and observability](/en/php-runtime/09-logging-observability/)
10. [Testing and code quality](/en/php-runtime/10-testing-quality/)
11. [Data caching and Redis](/en/php-runtime/11-data-caching-redis/)
12. [Queues, workers, and scheduling](/en/php-runtime/12-queues-workers-scheduling/)
13. [Deployment, CI/CD, and containers](/en/php-runtime/13-deployment-cicd-containers/)
14. [Dependency and supply-chain security](/en/php-runtime/14-dependency-supply-chain-security/)
15. [Profiling, SLI/SLO, and OpenTelemetry](/en/php-runtime/15-profiling-slo-opentelemetry/) — Flame graphs, percentiles, objectives, and trace propagation.
16. [Resilience and worker management](/en/php-runtime/16-resilience-workers/) — Circuit breakers, bulkheads, backpressure, signals, and systemd.
17. [Disaster recovery and restore testing](/en/php-runtime/17-disaster-recovery/) — RPO, RTO, backups, restores, and game days.
18. [Sessions and shared state at scale](/en/php-runtime/18-sessions-shared-state/) — shared storage, locking, TTL, and release compatibility.
19. [Database connections and runtime operations](/en/php-runtime/19-database-runtime-operations/) — connection budgets, timeouts, pooling, and replicas.
20. [Long-running PHP and worker runtimes](/en/php-runtime/20-long-running-php/) — FrankenPHP, RoadRunner, Swoole, state leakage, and reset.

## The practice protocol

Every exercise follows five steps: predict the result, run it, introduce a controlled failure, collect evidence from output, logs, or metrics, then repair the cause and repeat. A successful command without reviewable acceptance evidence is insufficient.

```text
Client
  -> Nginx / Apache (TLS, static files, routing)
  -> FastCGI
  -> PHP-FPM pool
  -> Composer autoloader + OPcache
  -> Application / Database / External API
  <- HTTP response
```

> Examples target PHP 8.x. Server snippets are educational baselines; adapt users, paths, and capacity to the actual operating system and workload.

## Official references

- [Composer basic usage](https://getcomposer.org/doc/01-basic-usage.md) and [autoloader optimization](https://getcomposer.org/doc/articles/autoloader-optimization.md)
- [cURL and libcurl documentation](https://curl.se/docs/)
- [OPcache](https://www.php.net/manual/en/book.opcache.php) and [preloading](https://www.php.net/opcache.preloading.php)
- [PHP garbage collection](https://www.php.net/manual/en/features.gc.php)
- [PHP-FPM](https://www.php.net/manual/en/install.fpm.php)
- [Session configuration](https://www.php.net/manual/en/session.configuration.php) and [PDO connection management](https://www.php.net/manual/en/pdo.connections.php)
- [FrankenPHP worker mode](https://frankenphp.dev/docs/worker/)
- [Nginx FastCGI](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html) and [Apache MPMs](https://httpd.apache.org/docs/2.4/mpm.html)
- [getenv()](https://www.php.net/getenv) and [`$_ENV`](https://www.php.net/manual/en/reserved.variables.environment.php)
