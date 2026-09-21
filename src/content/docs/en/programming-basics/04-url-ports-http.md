---
title: 4. URLs, ports, and HTTP
description: URL anatomy, ports, sockets, ranges, and the role of HTTP.
sidebar:
  order: 4
---

HTTP is an application protocol defining request/response semantics for resources. It is not the network connection itself; it runs over transports such as TCP or QUIC. HTTP is stateless by default, so applications add cookies, sessions, or tokens for continuity.

```text
https://example.com:443/products/42?currency=EGP#reviews
scheme  host        port path         query        fragment
```

The fragment is normally browser-local and is not sent in the HTTP request. Never place passwords, tokens, or other secrets in URLs because history, logs, analytics, and referrers may expose them.

A port is a 16-bit number from 0 to 65535 identifying a service in the operating system. Common values include FTP 21, SSH 22, SMTP 25, DNS 53, HTTP 80, HTTPS 443, MySQL 3306, and PostgreSQL 5432. A conventional port is configuration, not security.

A socket endpoint can be simplified as protocol + IP + port. A TCP connection is distinguished by client IP/port and server IP/port, allowing many clients to share server port 443.

```bash
php -S localhost:8000
```

In `http://localhost:8000/hello.php`, the scheme is HTTP, host is localhost, port is 8000, and path is `/hello.php`. Omitting a port means the scheme’s default, not “no port”.
