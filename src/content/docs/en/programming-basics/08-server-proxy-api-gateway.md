---
title: "Proxies and request distribution"
description: Practical differences among servers, forward and reverse proxies, load balancers, and API gateways, including trust and failure boundaries.
sidebar:
  order: 22
prev: {"link":"/en/programming-basics/07-server-side-path/","label":"A request's journey inside the server"}
next: {"link":"/en/programming-basics/31-proxy-policies/","label":"Load distribution and proxy policies"}
---


## Try one proxy

In the [local lab](/en/programming-basics/32-local-network-lab/), click Through one proxy. The browser requests `/proxy` on8765; that server requests the product on8766 and returns the response. The **upstream** is8766.

Inspect `/proxy` in Network: `X-Lab-Proxy: forwarded` identifies forwarding; `X-Request-Id` and `X-Upstream-Request-Id` match. Compare the terminal’s two log entries. Understand this single path before distributing requests among copies.

## Before the details

Every layer in front of an application should solve a named problem. Unneeded proxies add failure points; clear boundaries can improve security and scaling.

## Why place layers in front of an application?

Production systems often need TLS (Transport Layer Security, rules for establishing an authenticated protected connection), protection, traffic distribution, routing, observability, and shared policies. One product may perform multiple roles, yet their responsibilities remain different.

```text
Client ⇄ DNS (name lookup only)
Client → CDN/WAF → Load Balancer → Reverse Proxy → API Gateway
                                                        ├─ Identity
                                                        ├─ Orders
                                                        └─ Catalog → Cache/DB/Queue
```

Not every system needs every layer. A small app may use Nginx for TLS and reverse proxying; a multi-service platform may need a gateway.

## Forward and reverse proxies

A **forward proxy** acts for clients. Corporate devices send outbound traffic through it for policy, destination controls, caching, or auditing. It may hide an address from the destination but is not automatically anonymous; the proxy can identify and log the client.

A **reverse proxy** acts for servers. Clients request the app normally and the proxy selects an upstream. It may terminate TLS, route hosts and paths, compress or cache responses, enforce body limits, add request IDs, and hide internal addresses. Nginx, HAProxy, and Envoy can perform these duties. A proxy cannot replace application validation and authorization.

## Role comparison

| Component | Acts for | Primary decision | Typical use |
|---|---|---|---|
| Server | Service | How to process a request | App or database |
| Forward proxy | Client | Whether/where traffic exits | Corporate network |
| Reverse proxy | Servers | Which upstream receives it | TLS and host routing |
| Load balancer | Replicas | Which healthy replica gets load | Worker distribution |
| API gateway | API platform | Which API, identity, and policy apply | Microservice entry |

One product can combine roles. Review the responsibility, trust boundary, and failure mode rather than relying on a product label.

## Practical problems

<details><summary>What is the central difference between forward and reverse proxies?</summary><p>A forward proxy represents clients toward the Internet; a reverse proxy receives client traffic on behalf of servers.</p></details>

<details><summary>Why not trust every <code>X-Forwarded-For</code> value?</summary><p>A client can forge it. Trust only a header rebuilt by a trusted proxy and configure the trusted-proxy list.</p></details>

<details><summary>Does an API gateway replace authorization inside a service?</summary><p>No. It can apply shared policy, but each service remains responsible for access rules specific to its resources.</p></details>


## Next step

After completing this practice, continue with [Load distribution and proxy policies](/en/programming-basics/31-proxy-policies/).
