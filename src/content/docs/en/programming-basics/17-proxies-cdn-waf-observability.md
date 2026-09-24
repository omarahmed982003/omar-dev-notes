---
title: 16. Proxies, CDNs, WAFs, and observability
description: Intermediaries, edge caching, request filtering, and tracing slow or failing requests.
---

## Forward and reverse proxies

A forward proxy acts for clients and may enforce outbound policy. A reverse proxy receives traffic for servers and selects a backend. It may terminate TLS, compress responses, apply limits, and add headers. Trust forwarded client-address headers only from explicitly trusted proxies.

## CDN and WAF

A CDN caches content at edge locations to reduce latency and origin load. Cache keys, `Cache-Control`, `Vary`, cookies, and authorization must be correct so private content is not shared.

A WAF filters known malicious request patterns, but it cannot replace application validation and authorization. Rate limiting controls requests by an identity such as IP, account, API key, or resource and should return a clear `429` policy.

## Logs, metrics, and traces

A log records an event, a metric aggregates measurements, and a distributed trace follows one request through services using trace IDs and spans. A correlation ID helps connect application logs to one response.

Break latency into DNS, connection, TLS, time to first byte, and download time. Inside the server, measure database and external-service spans. “The site is slow” is not actionable until the slow stage is identified.

## Check your understanding

A WAF operates at the edge and does not know every domain rule. The application must still validate input and enforce permissions.
