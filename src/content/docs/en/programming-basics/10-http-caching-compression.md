---
title: 10. HTTP caching and compression
description: Freshness, validation, Cache-Control, ETag, Vary, CDNs, gzip, and Brotli.
sidebar:
  order: 10
---

## Why cache a response?

Caching reduces latency, bandwidth, PHP work, and database load. Copies may exist in a browser, proxy/CDN, or application, and each layer needs an explicit policy.

## Freshness and validation

```http
Cache-Control: public, max-age=60, s-maxage=300
ETag: "product-42-v7"
Vary: Accept-Encoding, Accept-Language
```

- `max-age` controls client freshness.
- `s-maxage` can target shared caches.
- `private` prevents shared reuse.
- `no-store` asks caches not to store.
- `no-cache` permits storage but requires validation before reuse.
- `Vary` adds selected request fields to the cache key.

An expired response can be revalidated with `If-None-Match`. If unchanged, the server returns `304 Not Modified` without a body. `Last-Modified` and `If-Modified-Since` are another validator pair.

## PHP example

```php
$etag = '"' . hash('sha256', $json) . '"';
header('Cache-Control: public, max-age=60');
header("ETag: {$etag}");

if (trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) {
    http_response_code(304);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
echo $json;
```

Never mark personalized data `public`.

## Compression

gzip and Brotli reduce text assets such as HTML, CSS, and JSON. Configure them in the web server or CDN, avoid recompressing already compressed images without evidence, and vary cached representations by `Accept-Encoding`.

## Checklist

- Define who can store the response and for how long.
- Use fingerprinted filenames for immutable static assets.
- Test invalidation before choosing a long lifetime.
- Do not publicly cache personal responses or unsafe `Set-Cookie` responses.
- Monitor hit ratio, transferred size, and latency.

## Reference

- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111)

