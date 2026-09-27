---
title: "A request's journey inside the server"
description: Load balancers, web servers, virtual hosts, PHP-FPM, applications, and the response path.
sidebar:
  order: 21
prev: {"link":"/en/programming-basics/32-local-network-lab/","label":"Set up a local request-and-response lab"}
next: {"link":"/en/programming-basics/08-server-proxy-api-gateway/","label":"Proxies and request distribution"}
---


## One server makes the flow concrete

Set up the [local lab](/en/programming-basics/32-local-network-lab/). Visit `/api/products/1` on8766: read path, choose product, construct JSON, return200 and body. Product2 returns404. A **route** maps an address to application work.

```text
Browser → one server → choose route → build response → Browser
```

Match the terminal log to Network status. The next lesson adds a proxy in front; it is not required for this first request.

## Beginner bridge

Once traffic reaches the backend, several programs may cooperate: a load balancer chooses a target, a web server handles HTTP (Hypertext Transfer Protocol, the rules for web requests and responses) and static files, PHP-FPM (PHP FastCGI Process Manager, managing PHP workers behind a web server) manages PHP (a programming language commonly used for server-side web processing) workers, and the application talks to caches or databases. These are responsibility boundaries, even when one machine runs several of them.

Debug from the outside inward. First identify which component produced the status, then correlate request IDs and timestamps. A gateway timeout, an application exception, and a database lock can all look like a slow page but require different evidence.

## Before the details

This lesson follows a request after it reaches the backend. The goal is not memorizing products; it is learning responsibility boundaries so you inspect the right failure layer.

## What is a server?

**Server** describes a role rather than one physical shape. It may mean physical hardware or a virtual machine supplying compute and networking, a program listening on an IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context) address and port such as Nginx or PostgreSQL, or the provider side of one interaction. The same application is a server to a browser and a client of a database.

A server process normally opens and binds a socket, listens, reads and validates requests, performs work, and returns responses. Running `localhost:8000` means a process on your machine listens locally; it does not imply a separate computer. Development may combine web, application, and database roles, while production separates them for scaling and isolation.

“The server is down” is incomplete until you identify whether the host, process, network, dependency, or capacity failed.

```text
Network → Load Balancer → Web Server
                           ├─ Static file → Response
                           └─ PHP-FPM → App → Database/Cache/API → Response
```

A load balancer distributes traffic across healthy backends. Layer 4 works with transport connections; Layer 7 understands HTTP. It may terminate TLS (Transport Layer Security, rules for establishing an authenticated protected connection), perform health checks, and add forwarding headers. Only trust forwarded client IP headers from configured trusted proxies.

Nginx or Apache selects a virtual host, serves static assets directly, reverse-proxies services, or forwards dynamic PHP through FastCGI. Nginx does not execute PHP inside its own process; PHP-FPM workers run the entry point and return headers/content.

The application routes the request, runs middleware, validates input/authentication/authorization, executes business logic, and may use a database, cache, queue, or external API (Application Programming Interface, a defined contract for requesting data or actions from another component).

```php
<?php
header('Content-Type: application/json; charset=utf-8');

try {
    echo json_encode(['id' => 42, 'name' => 'Keyboard'], JSON_THROW_ON_ERROR);
} catch (Throwable $e) {
    error_log($e);
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
```

Do not expose stack traces or secrets. On the return path, layers may add compression, security headers, and caching. A browser/CDN (Content Delivery Network, distributed servers delivering content closer to users) cache hit skips the app; a static asset can stop at Nginx; a dynamic request reaches PHP-FPM. A proxy commonly returns 502 for an invalid/unavailable upstream and 504 for an upstream timeout, while 500 generally comes from the processing server/application.

Use request IDs and timing to trace the whole path rather than measuring PHP alone.

## Practical problems

<details><summary>Nginx returns <code>502</code>. Did PHP necessarily run and fail?</summary><p>No. The gateway received no valid upstream response. Inspect PHP-FPM, connectivity, and timeouts before application logic.</p></details>

<details><summary>When can one user reach different application servers?</summary><p>A load balancer may distribute requests without sticky sessions. Important state should therefore not live only in one server process.</p></details>

<details><summary>Who normally serves a static CSS (Cascading Style Sheets, rules describing element appearance) file?</summary><p>A web server or CDN can serve it directly, so a typical setup does not send it through PHP.</p></details>

## Understand the backend terms

A **backend/upstream** is the next service selected by an intermediary. **Layer 4** refers to transport handling; **Layer 7** to application handling in the seven-layer **OSI (Open Systems Interconnection)** teaching model. A **health check** tests whether a service can respond. **Round robin** takes turns; **least connections** prefers fewer active connections. **Sticky sessions** try to keep a client on one instance, while a **shared session store** makes session data available across instances.

**TLS termination** decrypts the incoming connection at an intermediary. The next connection requires its own protection decision. **PHP-FPM, PHP FastCGI Process Manager**, manages ready PHP worker processes. **FastCGI** carries requests between a web server and an application execution environment. An **entry point** is the initial application file, a **route** maps a request to a handler, **middleware** performs shared processing around it, and **business logic** defines the application rules. A **stack trace** lists execution locations associated with a failure; do not disclose it or secrets in public responses.

## Budget time and memory

A **timeout** limits work or waiting. For a two-second client budget, example limits are 0.6 seconds for a database query, 1.3 for application work, and 1.6 for proxy waiting, leaving response-transfer margin. These partly nested deadlines are not simply durations to add. Client disconnects do not always cancel server work automatically.

Saturated workers create a queue. More workers require a RAM (Random Access Memory, working memory for active program data and instructions) budget and can otherwise cause **OOM, Out Of Memory**. A **Unix socket** provides local process communication; TCP (Transmission Control Protocol, ordered byte transport with loss recovery; connections can still fail) works locally or across hosts and **containers**, isolated application execution environments.

**Worked check:** A proxy times out after one second while processing takes 1.5 seconds. Check whether work is slow relative to the intended contract or the deadline is too short. Increasing every limit blindly can hide faults and increase queued work.

For practice, inspect request method, status, content type, and cache indicators in Network. Compare a static CSS file with a dynamic endpoint, propagate a request ID in a test service, and draw the actual path rather than assuming every optional layer exists.

## What happens after Enter?

1. The browser parses the URL and checks local cache and policies.
2. DNS turns the host name into an IP address if no valid answer is cached.
3. The operating system chooses a network interface and route; data crosses Wi-Fi or Ethernet, a router, an ISP (Internet Service Provider, an organization providing internet connectivity), and other networks.
4. The client establishes TCP for HTTP/1.1 or HTTP/2, or QUIC (a UDP-based transport protocol adding reliable streams and protected communication) over UDP (User Datagram Protocol, independent messages without built-in delivery or ordering guarantees) for HTTP/3.
5. With HTTPS, a TLS handshake authenticates the server and creates an encrypted channel.
6. The browser sends an HTTP request containing a method, path, headers, and sometimes a body.
7. A CDN (Content Delivery Network, distributed servers delivering content closer to users), WAF (Web Application Firewall, a system applying security rules to web requests), or load balancer may receive it before the origin server.
8. A web server returns a static file or forwards dynamic work to an application, such as PHP through PHP-FPM (PHP FastCGI Process Manager, managing PHP workers behind a web server).
9. The application validates input, identity, and permissions and may read a cache or database.
10. An HTTP response returns with a status code, headers, and body. The browser interprets and renders it.

![A browser request traveling through DNS and the network to PHP and back](/diagrams/request-flow-en.svg)

[Open the diagram full size](/diagrams/request-flow-en.svg)

:::note
This is a comprehensive map, not a mandatory fixed route. Browser or CDN cache may answer without reaching PHP, and a small application may have no load balancer or database.
:::

## Responsibility boundaries

| Component | Main responsibility |
|---|---|
| Browser or client | Build the request, manage cache/cookies, interpret the response |
| DNS | Resolve a name to suitable addresses |
| TCP or QUIC | Carry data and provide connection behavior |
| TLS | Encryption, integrity, and server authentication |
| HTTP | Define request and response meaning |
| Web server | Receive HTTP, serve static files, forward dynamic work |
| PHP | Run application logic and build a response |
| Database | Store and retrieve data |
