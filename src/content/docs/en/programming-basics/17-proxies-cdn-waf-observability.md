---
title: "Deliver content and understand the origin server"
description: "Deliver content and understand the origin server"
sidebar:
  order: 30
prev: {"link":"/en/programming-basics/16-http2-http3-quic/","label":"How HTTP/2 and HTTP/3 differ"}
next: {"link":"/en/programming-basics/24-request-protection/","label":"Protecting requests and limiting their rate"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Many people request the same JavaScript file. Must every request reach your application server? Follow a nearby cached copy and see when it helps, becomes outdated, or risks exposing private content.

Start after [cache freshness and validation](/en/programming-basics/10-http-caching-compression/). **Fresh** means reusable directly under policy; **stale** means its direct-use lifetime has expired. This lesson applies those rules across a delivery network rather than redefining every HTTP header.

## CDN, origin, and points of presence

A **CDN, Content Delivery Network**, delivers content from distributed locations. A **PoP, point of presence**, is a site containing network servers; the **edge** is the nearby receiving layer in this context.

The **origin server** supplies the original content. It is not the same meaning as a web page's origin tuple of scheme, host, and port.

A **HIT** means the relevant cache layer served an appropriate stored copy. A **MISS** needs a fetch from a following layer. It need not reach the origin directly: real networks may have shared upper cache layers.

Our model has two independent PoPs, A and B. Each MISS goes directly to the origin. No purge or upper cache operates during this trace.

## First request, HIT, and update

The public resource is `/guide?lang=ar`. Our **cache key** includes host, path, and lang. The origin initially returns v1:

~~~http
Cache-Control: public, max-age=60, s-maxage=300
ETag: "guide-v1"
~~~

`max-age=60` sets the ordinary freshness lifetime; `s-maxage=300` selects 300 seconds for shared caches. `ETag` identifies a version for validation, not a lifetime. Ignore transfer time and store A's first copy at time zero.

Every row is a request that **actually reaches the edge**; a browser cache is not preventing its transmission:

| Time, seconds | Event | Edge action | Outcome |
|---|---|---|---|
| 0 | First Arabic request at A | MISS; fetch and store v1 | 200, v1 body |
| 20 | Another Arabic request at A | HIT; age 20 is below 300 | 200, v1 without origin fetch |
| 30 | First Arabic request at B | MISS at B despite A's copy | 200, v1; B starts its own age |
| 50 | Origin changes to v2 | No automatic notice reaches A in this model | A still stores v1 |
| 80 | Arabic request at A | HIT under the remaining freshness lifetime | 200, v1 despite a newer origin |
| 310 | Arabic request at A | Stale; validate using v1's tag | Origin returns 200, v2; A stores and serves it |

**Fresh does not mean identical to the origin's newest version at every instant.** It permits reuse within policy. If the representation had not changed at validation, the origin might return 304 to update the cached response's metadata. That does not force a 304 to the edge's client; the edge can serve a 200 with its stored body.

A HIT often reduces latency and origin load. A MISS can add a hop. Measure rather than promising that adding a CDN makes every request faster.

## Same path, different content

If lang selects Arabic or English, ignoring it in the key can serve the first cached language to everyone. Our model uses distinct keys. Deciding that a query parameter does not affect content requires application knowledge.

`Vary` identifies request **header** dimensions, such as language or compression. It does not automatically configure every CDN's query-parameter key. Edge configuration must implement the policy you expect.

For `/account`, ignoring identity while sharing a Cookie- or Authorization-dependent body can expose A's data to B. Our sensitive example instead requires:

~~~http
Cache-Control: private, no-store
~~~

It is not shared-cache content; no-store also requests no storage by compliant caches. Adding every cookie blindly is not a privacy proof and can lower HIT efficiency. Decide what may be stored before optimizing reuse. Changing a new response's headers alone does not prove that previously shared incorrect copies have been withdrawn.

## Changing assets and origin failure

**Purge/invalidation** deletes a stored copy or makes it unusable according to the product. Changes may not reach every PoP instantly; define the rollout instead of assuming immediate global replacement.

A **content hash** in an asset name, such as `app.a1b2.js`, gives changed bytes a new URL. An old page may still reference the old URL; page freshness is part of the update plan.

An origin outage may leave a fresh edge copy usable under policy. Serving stale content during failure needs suitable permission, such as `stale-if-error`, plus implementation support and configuration. Do not assume an automatic fallback or reuse private old data without a decision.

Protect the origin from direct bypass as well. A **WAF, web application firewall**, at the edge cannot enforce a path that traffic bypasses. [Request protection](/en/programming-basics/24-request-protection/) owns those controls; no real service configuration is changed here.

## Observe rather than guess

The **Age** header describes a stored response's age under HTTP accounting; it does not name a CDN vendor. Cache-status headers vary by product, and their absence does not prove a MISS.

Combine headers, response policy, key, and available edge/origin logs. Speed alone does not prove a HIT; missing connection setup may simply reflect connection reuse.

This is a prepared explanatory trace, not real network measurements or a promise about a vendor. No CDN account or deployment is needed.

## Independent practice

Return to the initial state: A stores v1 at time 0 with lifetime 300; the origin changes at 50; no invalidation occurs.

1. At200, what does A serve? Must it ask the origin?
2. At301, is expiry proof the content changed?
3. At100, what happens for the first English request with a lang-aware key? What if lang is ignored?
4. Two users request account at the same path. Is public caching while ignoring Cookie safe?
5. Must a 304 from origin to edge become a 304 to the browser?

<details>
<summary>Solution and acceptance checks</summary>

1. v1; it remains fresh in this model, so origin validation is unnecessary.
2. No. Stale indicates expiry, not different bytes. Validation determines whether the version changed.
3. MISS for a new English key; ignoring lang can return the wrong Arabic body.
4. No; private data could be shared. The example requires private/no-store, then verification.
5. No. Edge-to-origin validation and client-to-edge requests are distinct exchanges. Success identifies the cache layer, key, and age rather than merely naming HIT.

</details>

## Next step

[Protecting requests and limiting their rate](/en/programming-basics/24-request-protection/).

## References

- [RFC 9111: stored-response reuse and validation](https://www.rfc-editor.org/rfc/rfc9111.html#section-4)
- [MDN: HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
