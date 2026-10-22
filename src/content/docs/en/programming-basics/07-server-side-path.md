---
title: "A request's journey inside the server"
description: Load balancers, web servers, virtual hosts, PHP-FPM, applications, and the response path.
sidebar:
  order: 20
prev: {"link":"/en/programming-basics/29-browser-scheduling/","label":"Load scripts and schedule browser tasks"}
next: {"link":"/en/programming-basics/08-server-proxy-api-gateway/","label":"Proxies and request distribution"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## One server makes the flow concrete

Start with this prepared trace without installing Node.js. A **route** maps an address to application work; JSON encodes named values as text. These are explanatory inputs and outputs, not measurements from your computer:

| Input | Server work | Response |
|---|---|---|
| GET `/api/products/1` | Select product 1 and encode JSON | 200 with product data |
| GET `/api/products/2` | Match the route but find no product | 404 describing absence |

The Node.js [local lab](/en/programming-basics/32-local-network-lab/) is optional: if configured, try both paths on 8766. The complete PHP experiment below provides a separate runnable route without Node.

```text
Browser → one server → choose route → build response → Browser
```

Match the terminal log to Network status. The next lesson adds a proxy in front; it is not required for this first request.

## Beginner bridge

Once traffic reaches the backend, several programs may cooperate: a load balancer chooses a target, a web server handles HTTP (Hypertext Transfer Protocol, the rules for web requests and responses) and static files, PHP-FPM (PHP FastCGI Process Manager, managing PHP workers behind a web server) manages PHP (a programming language commonly used for server-side web processing) workers, and the application talks to caches or databases.

These are responsibility boundaries, even when one machine runs several of them.

Debug from the outside inward. First identify which component produced the status, then correlate request IDs and timestamps. A gateway timeout, an application exception, and a database lock can all look like a slow page but require different evidence.

## Before the details

This lesson follows a request after it reaches the backend. The goal is not memorizing products; it is learning responsibility boundaries so you inspect the right failure layer.

## What is a server?

**Server** describes a role rather than one physical shape.

It may mean physical hardware or a virtual machine supplying compute and networking, a program listening on an IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context) address and port such as Nginx or PostgreSQL, or the provider side of one interaction.

The same application is a server to a browser and a client of a database.

A server process normally opens and binds a socket, listens, reads and validates requests, performs work, and returns responses. Running `localhost:8000` means a process on your machine listens locally; it does not imply a separate computer.

Development may combine web, application, and database roles, while production separates them for scaling and isolation.

“The server is down” is incomplete until you identify whether the host, process, network, dependency, or capacity failed.

## From the network to the application

Trace a request for an existing product whose record is stored in a database in this example:

1. The browser sends HTTP. A **CDN, a distributed content-delivery network**, or a load balancer may handle it first; both are optional. A CDN cache hit may answer without contacting the application.
2. At the origin, the web-server role receives HTTP. A static-file request may be answered directly; a dynamic request goes to an application runtime.
3. In a common PHP setup, Nginx forwards work through FastCGI to PHP-FPM. The application selects a route and queries the database **if needed**. Neither every application nor every request needs a database.
4. The database returns its result **to the application**, not directly to the browser. The application builds the response; it returns through the runtime, web server, and any configured intermediaries to the browser.

A web response needs an HTTP-receiving role; dynamic work needs an application-execution role. One program may combine them, as the local PHP server below does. Roles need not be separate hosts or services. A CDN, load balancer, and database are need-based components, not mandatory stages.

A load balancer distributes traffic across healthy backends. Layer 4 works with transport connections; Layer 7 understands HTTP. It may terminate TLS (Transport Layer Security, rules for establishing an authenticated protected connection), perform health checks, and add forwarding headers.

Only trust forwarded client IP headers from configured trusted proxies.

Nginx or Apache selects a virtual host, serves static assets directly, reverse-proxies services, or forwards dynamic PHP through FastCGI. Nginx does not execute PHP inside its own process; PHP-FPM workers run the entry point and return headers/content.

The application routes the request, runs middleware, validates input/authentication/authorization, executes business logic, and may use a database, cache, queue, or external API (Application Programming Interface, a defined contract for requesting data or actions from another component).

### Optional PHP lab: repeatable success and failure

After [PHP setup](/en/php/00-lab-setup/), save this complete file as `product.php` in a new practice folder. Neither Node.js nor Nginx is required. An **exception** signals failure; `try/catch` handles it, `Throwable` represents catchable errors, and `RuntimeException` creates the deliberate teaching failure.

`$_GET` contains URL parameters; `?? ''` supplies a fallback. `fail=1` is a training switch, not authorization or a production setting. `header` sets a response field; `json_encode` converts values to JSON.

```php
<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

try {
    if (($_GET['fail'] ?? '') === '1') {
        throw new RuntimeException('Deliberate local failure for the foundations lab');
    }
    $product = ['id' => 42, 'name' => 'Keyboard'];
    echo json_encode($product, JSON_THROW_ON_ERROR);
} catch (Throwable $e) {
    error_log((string) $e);
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
```

`(string) $e` converts the exception before `error_log`; strict typing can otherwise make logging itself throw TypeError. A **log** here is the server terminal output. `JSON_THROW_ON_ERROR` throws on encoding failure; `http_response_code` sets the response status.

From the practice folder:

~~~powershell
php -S 127.0.0.1:8089
~~~

`-S` starts a loopback-only development server, not a production service. In another terminal:

~~~powershell
curl.exe -i http://127.0.0.1:8089/product.php
curl.exe -i "http://127.0.0.1:8089/product.php?fail=1"
~~~

`-i` includes headers and body; use `curl` instead of `curl.exe` on Linux/macOS. Expect 200 with `{"id":42,"name":"Keyboard"}`, then 500 with only `{"error":"Internal server error"}`. The deliberate reason and **stack trace**, execution locations associated with failure, belong in the server terminal, not the response body. Repeat the first request after failure: expect 200 again.

Stop with Ctrl+C. Do not deploy this failure switch or publish secret-bearing logs. This illustrates public-response/private-log boundaries, not a complete product API.

Do not expose stack traces or secrets. On the return path, layers may add compression, security headers, and caching.

A browser/CDN (Content Delivery Network, distributed servers delivering content closer to users) cache hit skips the app; a static asset can stop at Nginx; a dynamic request reaches PHP-FPM.

A proxy commonly returns 502 for an invalid/unavailable upstream and 504 for an upstream timeout, while 500 generally comes from the processing server/application.

Use request IDs and timing to trace the whole path rather than measuring PHP alone.

## Practical problems

<details><summary>Nginx returns <code>502</code>. Did PHP necessarily run and fail?</summary><p>No. The gateway received no valid upstream response. Inspect PHP-FPM, connectivity, and timeouts before application logic.</p></details>

<details><summary>When can one user reach different application servers?</summary><p>A load balancer may distribute requests without sticky sessions. Important state should therefore not live only in one server process.</p></details>

<details><summary>Who normally serves a static CSS (Cascading Style Sheets, rules describing element appearance) file?</summary><p>A web server or CDN can serve it directly, so a typical setup does not send it through PHP.</p></details>

## Understand the backend terms

A **backend/upstream** is the next service selected by an intermediary. **Layer 4** refers to transport handling; **Layer 7** to application handling in the seven-layer **OSI (Open Systems Interconnection)** teaching model. A **health check** tests whether a service can respond.

**Round robin** takes turns; **least connections** prefers fewer active connections. **Sticky sessions** try to keep a client on one instance, while a **shared session store** makes session data available across instances.

**TLS termination** decrypts the incoming connection at an intermediary. The next connection requires its own protection decision. **PHP-FPM, PHP FastCGI Process Manager**, manages ready PHP worker processes. **FastCGI** carries requests between a web server and an application execution environment.

An **entry point** is the initial application file, a **route** maps a request to a handler, **middleware** performs shared processing around it, and **business logic** defines the application rules.

A **stack trace** lists execution locations associated with a failure; do not disclose it or secrets in public responses.

## Budget time and memory

A **timeout** limits work or waiting. For a two-second client budget, example limits are 0.6 seconds for a database query, 1.3 for application work, and 1.6 for proxy waiting, leaving response-transfer margin. These partly nested deadlines are not simply durations to add.

Client disconnects do not always cancel server work automatically.

Saturated workers create a queue. More workers require a RAM (Random Access Memory, working memory for active program data and instructions) budget and can otherwise cause **OOM, Out Of Memory**.

A **Unix socket** provides local process communication; TCP (Transmission Control Protocol, ordered byte transport with loss recovery; connections can still fail) works locally or across hosts and **containers**, isolated application execution environments.

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


:::note
These steps describe possibilities, not a mandatory fixed route. Browser or CDN cache may answer without reaching PHP, and a small application may have no load balancer or database.
:::

<figure class="request-journey-figure">
  <a href="/diagrams/request-flow-en.svg" target="_blank" rel="noopener" aria-label="Open the request journey at full size"><img src="/diagrams/request-flow-en.svg" alt="Request journey from the browser through name lookup, connection, and networks to the web server and PHP application, including cache and response paths." loading="lazy" /></a>
  <figcaption>A big-picture view of the components explained above, not a mandatory route for every request. Arrows show request and response paths; some layers are optional. <a href="/diagrams/request-flow-en.svg" target="_blank" rel="noopener">Open full size to read the details</a>.</figcaption>
</figure>

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
