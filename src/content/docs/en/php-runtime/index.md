---
title: PHP Runtime & Production
description: Composer, HTTP clients, OPcache, memory, PHP-FPM, web servers, and environment configuration.
sidebar:
  order: 0
---

# Running PHP from development to production

This path explains the tools and layers around PHP after the application code is written. It gradually separates dependency management, HTTP clients, web serving, and PHP-FPM so the role of each part stays clear.

## Why a separate section?

These subjects are neither OOP nor PHP syntax. They form the **runtime and production** layer: reproducible dependencies, autoloading, efficient execution, outbound HTTP, process capacity, and safe configuration.

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
- [Nginx FastCGI](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html) and [Apache MPMs](https://httpd.apache.org/docs/2.4/mpm.html)
- [getenv()](https://www.php.net/getenv) and [`$_ENV`](https://www.php.net/manual/en/reserved.variables.environment.php)
