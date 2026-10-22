---
title: "Networking and the web"
description: "Follow a request from the local network through addressing and transport to a protected web connection. Study server application topics after the core route."
sidebar:
  order: 0
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

This section has two reading paths. **First pass** means the minimum ideas and observations needed to explain an ordinary request; **depth** means details you revisit after building a small program. They live in the same topic-owned lessons, not in disconnected continuation pages.

## 1. First pass — follow one request

Start with the basic section of each lesson below. When a lesson marks a first-pass stopping point, skip its depth section for now. In particular, port and socket foundations come before TCP; subnet calculations and MTU diagnosis do not block your first web page.

1. [The internet, the web, and a request's journey](/en/programming-basics/01-web-and-request-flow/)
2. [How devices communicate on a local network](/en/programming-basics/14-network-layers-lan-ethernet-arp/)
3. [Device addresses and connection settings](/en/programming-basics/15-addressing-dhcp-nat-routing-ipv6/)
4. [How a domain name becomes an address](/en/programming-basics/02-dns-and-ip/)
5. [Web addresses, ports, and HTTP](/en/programming-basics/04-url-ports-http/)
6. [Characters and encoding in web addresses](/en/programming-basics/21-url-encoding/)
7. [TCP: from establishment to closure](/en/programming-basics/03-tcp-udp-packets/)
8. [UDP: independent messages](/en/programming-basics/udp/)
9. [Read an HTTP request and response](/en/programming-basics/05-http-messages-state/)
10. [Remembering users and protecting updates](/en/programming-basics/22-http-state-and-updates/)
11. [Connection encryption and website certificates](/en/programming-basics/06-https-tls-certificates/)
12. [How the browser displays a page](/en/programming-basics/09-browser-rendering-devtools/)
13. [Set up a local request-and-response lab](/en/programming-basics/32-local-network-lab/)

## Stop here and apply the foundations

You are ready to move on when you can explain these observations without copying definitions:

- A name lookup fails before HTTP can return a status.
- A closed listening port differs from a reachable server returning404.
- TCP carries ordered bytes; HTTP gives the request and response their meaning.
- A certificate error is not a missing web route.
- A response can set a Cookie identifier; a later request returns it to recover server-side session data.

Use a local experiment or the prepared traces. Then begin a small HTML page and continue language fundamentals in [PHP](/en/php/) when appropriate. You do **not** need to finish every lesson below first. Reading this page does not record study progress or a passing score.

## 2. Return after practice — depth and diagnosis

Return after understanding variables, conditions, loops, and functions and after running a local application. Read each topic's basic recap, then its depth section. This path introduces extra network layouts, packet-size diagnosis, browser scheduling, proxies, caching, security boundaries, delivery, and measurements.

1. [Segment networks and prevent frame loops](/en/programming-basics/28-lan-segmentation/)
2. [Connect to Wi-Fi and diagnose problems](/en/programming-basics/18-wifi-practical-basics/)
3. [Calculate a subnet from its address](/en/programming-basics/26-subnet-calculations/)
4. [Choose a route and read IPv6 addresses](/en/programming-basics/27-routing-and-ipv6/)
5. [MTU: packet size and path diagnosis](/en/programming-basics/20-transport-diagnostics/)
6. [Load scripts and schedule browser tasks](/en/programming-basics/29-browser-scheduling/)
7. [A request's journey inside the server](/en/programming-basics/07-server-side-path/)
8. [Proxies and request distribution](/en/programming-basics/08-server-proxy-api-gateway/)
9. [Load distribution and proxy policies](/en/programming-basics/31-proxy-policies/)
10. [Web caching and compression](/en/programming-basics/10-http-caching-compression/)
11. [Controlling cross-origin data access](/en/programming-basics/11-same-origin-cors/)
12. [Resource loading and window isolation](/en/programming-basics/33-browser-isolation/)
13. [Poll or receive a server stream](/en/programming-basics/12-realtime-webhooks/)
14. [Receive a webhook and handle repeated delivery](/en/programming-basics/30-webhook-delivery/)
15. [Designing data interfaces](/en/programming-basics/13-api-design/)
16. [How HTTP/2 and HTTP/3 differ](/en/programming-basics/16-http2-http3-quic/)
17. [Deliver content and understand the origin server](/en/programming-basics/17-proxies-cdn-waf-observability/)
18. [Protecting requests and limiting their rate](/en/programming-basics/24-request-protection/)
19. [Trace requests and interpret measurements](/en/programming-basics/25-request-observation/)

## Choose a lab without changing your learning language

**Node.js** is a runtime for JavaScript. The prepared Node lab is one optional observation tool, not a requirement to learn another language before PHP. Dependent lessons provide a written request/response trace you can follow without it. Some lessons also provide self-contained PHP labs with their own prerequisites.

If you choose the Node lab, use the complete supplied file and the stated local addresses. Do not treat browser screenshots as proof that you understand the sequence; predict the status and cause, then compare the observation.
