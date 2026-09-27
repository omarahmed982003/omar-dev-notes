---
title: "Deliver content and understand the origin server"
description: "Deliver content and understand the origin server"
sidebar:
  order: 31
prev: {"link":"/en/programming-basics/16-http2-http3-quic/","label":"How HTTP/2 and HTTP/3 differ"}
next: {"link":"/en/programming-basics/24-request-protection/","label":"Protecting requests and limiting their rate"}
---


## CDN, origin, and points of presence

A **CDN (Content Delivery Network, distributed servers delivering content closer to users)** runs points of presence near users. An edge returns a cached representation when its key is valid; otherwise it fetches the **origin** and may store the result. This reduces latency and origin load.

The key usually includes host and path plus selected query or `Vary` dimensions. Including every cookie destroys cache efficiency, while ignoring identity dimensions for personalized content can expose one user's response to another.

Use `public` only for shareable content, `private` for browser-only caches, `s-maxage` for shared caches, and content-hashed asset names for long lifetimes. Plan invalidation and protect the origin from direct bypass.

## Next step


After completing this practice, continue with [Protecting requests and limiting their rate](/en/programming-basics/24-request-protection/).



After completing this practice, continue with [Trace requests and interpret measurements](/en/programming-basics/25-request-observation/).
