---
title: PHP Runtime & Production
description: Composer, HTTP clients, OPcache, memory, PHP-FPM, web servers, and environment configuration.
sidebar:
  order: 0
---

# Running PHP from development to production

This section turns pages **78–86** into a complete guide to the layers around PHP application code. It updates the notes for the modern Zend Engine and separates dependency management, HTTP clients, web serving, and FastCGI process management.

## Why a separate section?

These subjects are neither OOP nor PHP syntax. They form the **runtime and production** layer: reproducible dependencies, autoloading, efficient execution, outbound HTTP, process capacity, and safe configuration.

## Learning path

1. [Composer and dependency management](./01-composer-dependencies/)
2. [cURL and HTTP clients](./02-curl-http-clients/)
3. [OPcache and preloading](./03-opcache-preloading/)
4. [PHP memory and garbage collection](./04-memory-garbage-collection/)
5. [PHP-FPM and process management](./05-php-fpm-processes/)
6. [Apache, Nginx, and FastCGI](./06-web-servers-fastcgi/)
7. [Environment variables and configuration](./07-environment-configuration/)
8. [PHP CLI, php.ini, and extensions](./08-cli-ini-extensions/)
9. [Logging and observability](./09-logging-observability/)
10. [Testing and code quality](./10-testing-quality/)
11. [Data caching and Redis](./11-data-caching-redis/)
12. [Queues, workers, and scheduling](./12-queues-workers-scheduling/)
13. [Deployment, CI/CD, and containers](./13-deployment-cicd-containers/)
14. [Dependency and supply-chain security](./14-dependency-supply-chain-security/)
15. [Profiling, SLI/SLO, and OpenTelemetry](./15-profiling-slo-opentelemetry/) — Flame graphs, percentiles, objectives, and trace propagation.
16. [Resilience and worker management](./16-resilience-workers/) — Circuit breakers, bulkheads, backpressure, signals, and systemd.
17. [Disaster recovery and restore testing](./17-disaster-recovery/) — RPO, RTO, backups, restores, and game days.

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
