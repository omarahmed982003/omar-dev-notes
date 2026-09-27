---
title: "Web caching and compression"
description: Freshness, validation, Cache-Control, ETag, Vary, CDNs, gzip, and Brotli.
sidebar:
  order: 24
prev: {"link":"/en/programming-basics/31-proxy-policies/","label":"Load distribution and proxy policies"}
next: {"link":"/en/programming-basics/11-same-origin-cors/","label":"Controlling cross-origin data access"}
---


## Three moments for one representation

A **cache** saves a reusable copy. The lab’s `/cache` sends `ETag: "lesson-v1"`, a version identifier, and `Cache-Control: public, max-age=2`, a two-second freshness lifetime.

| Moment | Action | Result |
|---|---|---|
| First request | No copy exists |200 with content |
| Ordinary request while fresh | Browser may reuse its copy if policy allows | No origin body download needed |
| After expiry | Ask whether the version changed |304 if unchanged; reuse saved body |

Start the [lab](/en/programming-basics/32-local-network-lab/) and run:

```powershell
curl.exe -i http://127.0.0.1:8766/cache
Set-Content -LiteralPath cache-headers.txt -Value 'If-None-Match: "lesson-v1"' -Encoding ascii
curl.exe -i -H "@cache-headers.txt" http://127.0.0.1:8766/cache
```

`Set-Content` writes the request header to a practice file; `-H "@cache-headers.txt"` reads it unchanged, preserving quotation marks across PowerShell versions.

Expect200 then304 without a body. `If-None-Match` supplies the stored version tag. curl does not implement a browser cache here: the second command explicitly simulates revalidation. In Network leave Disable cache unchecked; reload can force revalidation and is not always an ordinary request. Understand this sequence before policy and compression details.

## Before the details

A cache reuses an earlier result to reduce latency and work. The safe questions are who may store it, for how long, and how a client validates change.

## Why cache a response?

Caching reduces latency, bandwidth, PHP (a programming language commonly used for server-side web processing) work, and database load. Copies may exist in a browser, proxy/CDN (Content Delivery Network, distributed servers delivering content closer to users), or application, and each layer needs an explicit policy.

## Freshness and validation

```http
Cache-Control: public, max-age=60, s-maxage=300
ETag: "product-42-v7"
Vary: Accept-Encoding, Accept-Language
```

- `max-age` sets freshness lifetime in seconds for private and shared caches unless a more specific policy overrides it.
- `s-maxage` overrides that lifetime for shared caches.
- `private` prevents shared reuse.
- `no-store` asks caches not to store.
- `no-cache` permits storage but requires validation before reuse.
- `Vary` adds selected request fields to the cache key.

An expired response can be revalidated with `If-None-Match`. If unchanged, the server returns `304 Not Modified` without a body. `Last-Modified` and `If-Modified-Since` are another validator pair.

## PHP example

```php
<?php
// Save inside the downloadable php-labs folder.
require __DIR__ . '/http-router.php';
```

Never mark personalized data `public`.

## Compression

gzip and Brotli reduce text assets such as HTML (Hypertext Markup Language, a language describing page structure), CSS (Cascading Style Sheets, rules describing element appearance), and JSON (JavaScript Object Notation, a text format for structured values and lists). Configure them in the web server or CDN, avoid recompressing already compressed images without evidence, and vary cached representations by `Accept-Encoding`.

## Checklist

- Define who can store the response and for how long.
- Use fingerprinted filenames for immutable static assets.
- Test invalidation before choosing a long lifetime.
- Do not publicly cache personal responses or unsafe `Set-Cookie` responses.
- Monitor hit ratio, transferred size, and latency.

## Reference

- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111)

## Practical problems

<details><summary>Why not put an account page in a shared cache?</summary><p>It is user-specific and could leak. Apply an appropriate private or no-store policy and prevent CDN sharing.</p></details>

<details><summary>What does <code>304</code> mean?</summary><p>The cached representation is still valid according to a validator. The server omits the full body and the client uses its copy.</p></details>

<details><summary>When is <code>Vary: Accept-Encoding</code> needed?</summary><p>When content differs for gzip or br so a cache does not serve an encoding that the client cannot decode.</p></details>

## Stale responses and safe cache keys

A **stale** response has passed its direct-reuse lifetime; that does not prove the content changed. **stale-while-revalidate** permits bounded stale reuse during validation. **stale-if-error** can permit a bounded old response when fetching fails. Sensitive decisions need carefully limited policies.

A **cache key** determines which requests share a saved response. Omitting a response-changing input can cause **cache poisoning**, storing inappropriate content for others. A **side channel** reveals information indirectly; compressing secrets beside attacker-controlled text can expose clues through response size.

**Worked check:** A public price page varies by language and supported compression. Distinguish variants using appropriate Vary fields and cache configuration. Do not share a personalized account response. Set-Cookie alone does not automatically forbid every shared cache from storing; choose an explicit policy.

**Freshness** allows direct reuse; **validation** asks whether a stored version remains valid. **ETag** identifies a version, Last-Modified states its modification time, and the corresponding conditional fields request a check. **gzip** and **Brotli** are compression formats. Fingerprinted filenames contain a content identifier so a changed asset can use a different URL (Uniform Resource Locator, an address identifying a resource and how to access it). **Hit ratio** is the fraction of lookups served from the cache.

In the lab below, a **weak entity tag** begins W/ and can indicate equivalent content without promising identical bytes. GET/HEAD If-None-Match uses weak comparison. The downloadable router, rather than the short include snippet alone, supplies the complete runnable example.

## Conditional requests, step by step

Use the [local lab](/en/php/00-lab-setup/), start `php -S 127.0.0.1:8097 http-router.php`, then run `php http-client-lab.php` in a second terminal. Inspect `http-router.php` and `src/Http.php`: the route accepts GET/HEAD only, computes the current representation’s ETag, parses a list of entity tags, and uses weak comparison for If-None-Match. `W/"abc"` can match `"abc"`; `*` matches an existing representation. Splitting on every comma is wrong because a quoted tag may contain a comma. Matching GET/HEAD returns 304 with no body; HEAD without a match returns 200 with headers and no body. This endpoint rejects other methods with 405; a general write endpoint would use 412 for a failed If-None-Match precondition. Malformed fields receive 400 under this application policy.

Exercise: send a nonmatching tag, a matching weak tag in a list, and `*`. Expect 200, 304, and 304. These tags describe the actual selected representation: if compression or language changes its bytes, use an appropriate variant strategy and Vary headers.


[RFC 9110, If-None-Match](https://httpwg.org/specs/rfc9110.html#field.if-none-match)
