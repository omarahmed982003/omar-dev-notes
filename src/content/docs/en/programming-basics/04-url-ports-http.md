---
title: "Web addresses, ports, and HTTP"
description: URL anatomy, ports, sockets, ranges, and the role of HTTP.
sidebar:
  order: 12
prev: {"link":"/en/programming-basics/20-transport-diagnostics/","label":"Closing connections and diagnosing packet size"}
next: {"link":"/en/programming-basics/21-url-encoding/","label":"Characters and encoding in web addresses"}
---


## Beginner bridge

A URL (Uniform Resource Locator, an address identifying a resource and how to access it) identifies a resource and tells a client how to reach it. The scheme selects a protocol policy, the host selects a destination name, the port selects a listening service, and the path plus query identify the requested resource.

Keep URL parsing separate from DNS (Domain Name System, a distributed system answering queries about domain names) and connection establishment. A syntactically valid URL may resolve to no address, connect to no service, or receive an HTTP (Hypertext Transfer Protocol, the rules for web requests and responses) error. Each stage has its own evidence and debugging tools.

## Before the details

Before the details: a URL says **what** you want and **where** to request it, a port selects the receiving program on that host, and HTTP defines the conversation.

HTTP is an application protocol defining request/response semantics for resources. It is not the network connection itself; it runs over transports such as TCP (Transmission Control Protocol, ordered byte transport with loss recovery; connections can still fail) or QUIC (a UDP-based transport protocol adding reliable streams and protected communication). HTTP is stateless by default, so applications add cookies, sessions, or tokens for continuity.

```text
https://example.com:443/products/42?currency=EGP#reviews
scheme  host        port path         query        fragment
```

The fragment is normally browser-local and is not sent in the HTTP request. Never place passwords, tokens, or other secrets in URLs because history, logs, analytics, and referrers may expose them.

A TCP or UDP (User Datagram Protocol, independent messages without built-in delivery or ordering guarantees) port is a 16-bit number from 0 to 65535 identifying a service in the operating system. Common values include FTP (File Transfer Protocol) 21, SSH (Secure Shell, a protocol for secure remote access) 22, SMTP (Simple Mail Transfer Protocol, used for sending email between systems) 25, DNS 53, HTTP 80, HTTPS (HTTP carried over a TLS-protected connection) 443, MySQL 3306, and PostgreSQL 5432. A conventional port is configuration, not security.

A socket endpoint can be simplified as protocol + IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context) + port. A TCP connection is distinguished by client IP/port and server IP/port, allowing many clients to share server port 443.

For this optional practice, [install PHP](/en/php/00-lab-setup/), create a new practice folder, and save hello.php containing `<?php echo 'Hello';`. The opening tag starts PHP and echo displays text. Open a terminal in that folder and run:

```bash
php -S localhost:8000
```

In `http://localhost:8000/hello.php`, the scheme is HTTP, host is localhost, port is 8000, and path is `/hello.php`. Omitting a port means the scheme’s default, not “no port”.

The browser should display Hello. localhost refers to your own computer; -S starts a development server. Keep its terminal open while testing and stop it with Ctrl+C afterward.

## Practical problems

<details><summary>Does the browser send <code>#section</code> to the server?</summary><p>No. The fragment is normally browser-local, while the path and query string are sent.</p></details>

<details><summary>A service works at <code>localhost:8080</code>, but a URL without a port fails. Why?</summary><p>HTTP defaults to 80 and HTTPS to 443. The URL must include <code>:8080</code> while the service listens there.</p></details>

<details><summary>Does port 443 guarantee encryption?</summary><p>No. It is a convention; an actual TLS (Transport Layer Security, rules for establishing an authenticated protected connection) handshake creates encryption. A misconfigured plain service can listen on 443.</p></details>


## Next step

After completing this practice, continue with [Characters and encoding in web addresses](/en/programming-basics/21-url-encoding/).
