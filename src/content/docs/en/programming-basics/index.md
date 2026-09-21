---
title: Web and networking basics
description: "A corrected, expanded track for pages 1–11, from entering a URL to PHP and the response."
sidebar:
  order: 0
---

# Web and networking basics for programmers

This section turns pages **1–11** of the notes into a structured learning path. It retains every readable concept, corrects oversimplifications, and adds practical examples.

## Learning path

1. [The Web and request flow](./01-web-and-request-flow/)
2. [DNS and IP addresses](./02-dns-and-ip/)
3. [TCP, UDP, and packets](./03-tcp-udp-packets/)
4. [URLs, ports, and HTTP](./04-url-ports-http/)
5. [HTTP messages and state](./05-http-messages-state/)
6. [HTTPS, TLS, and certificates](./06-https-tls-certificates/)
7. [Inside the server](./07-server-side-path/)
8. [Problem solving and algorithms](./08-problem-solving-algorithms/)
9. [How browsers render a page](./09-browser-rendering-devtools/)
10. [HTTP caching and compression](./10-http-caching-compression/)
11. [Same-origin policy and CORS](./11-same-origin-cors/)
12. [Real-time communication and webhooks](./12-realtime-webhooks/)
13. [API design](./13-api-design/)

```text
URL → DNS → IP + Port → TCP/QUIC + TLS → HTTP Request
    → CDN/WAF/Load Balancer → Web Server → PHP → Database
    → HTTP Response → Browser
```

This is a teaching map. Caches, reused connections, and application architecture can skip optional stages.
