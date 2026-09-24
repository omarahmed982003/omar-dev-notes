---
title: 9. HTTP caching and compression
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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: HTTP caching and compression">
<p class="lesson-diagram-title">Concept map: HTTP caching and compression</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Why cache a response?</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Freshness and validation</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>PHP example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Compression</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Checklist</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Why cache a response?” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Caching reduces latency, bandwidth, PHP work, and database load. Copies may exist in a browser, proxy/CDN, or application, and each layer needs an explicit policy. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Why cache a response?” with “Freshness and validation”. Why does neither replace the other in “HTTP caching and compression”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Why cache a response?”: Caching reduces latency, bandwidth, PHP work, and database load. Copies may exist in a browser, proxy/CDN, or application, and each layer needs an explicit policy. For “Freshness and validation”: max-age controls client freshness. s-maxage can target shared caches. private prevents shared reuse. no-store asks caches not to store. no-cache permits storage but requires validation before reuse. Vary adds selected request fields to the cache key. An expired response can be revalidated with If-None-Match. If unchanged, the server returns 304 Not Modified without a body. Last-Modified and If-Modified-Since are… The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “PHP example”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Never mark personalized data public. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Compression” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> gzip and Brotli reduce text assets such as HTML, CSS, and JSON. Configure them in the web server or CDN, avoid recompressing already compressed images without evidence, and vary cached representations by Accept-Encoding. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
