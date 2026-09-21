---
title: 1. The Web and request flow
description: Internet vs Web, client/server, and the complete request-response journey.
sidebar:
  order: 1
---

The **Internet** is the global network infrastructure. The **Web** is one service on top of it, using HTTP/HTTPS and URLs. Email, file transfer, calls, and games also use the Internet.

A client requests a service; a server receives and processes requests. These are roles, so both may run on one development machine.

When a browser opens a URL it checks local cache, resolves DNS, connects through the NIC/router/ISP, establishes TCP or QUIC and TLS, sends HTTP, and may pass through a CDN, WAF, or load balancer. A web server serves static content or forwards dynamic work to PHP-FPM. The application may use cache/database services and returns an HTTP response.

![A colored diagram of a browser request traveling through DNS and the network to PHP and back](/diagrams/request-flow-en.svg)

[Open the diagram full size](/diagrams/request-flow-en.svg)

```bash
curl -i "https://example.com/"
curl -v "https://example.com/" -o NUL
```

The second command exposes DNS, connection, and TLS details. Use `/dev/null` instead of `NUL` on Linux/macOS.

This is a comprehensive teaching route, not a mandatory fixed path: browser/CDN cache can answer early, and a small app may have no load balancer or database.
