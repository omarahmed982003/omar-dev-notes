---
title: 15. From HTTP request to router and response
description: Front controllers, JSON bodies, routing, middleware, and correct HTTP responses without a framework.
sidebar:
  order: 15
---

## Front controller

Route dynamic requests to `public/index.php` and start from one entry point:

```php
<?php
declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
```

Keep the project root outside the document root so clients cannot fetch `vendor/`, `.env`, or source files.

## Read a JSON body

```php
$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));

if ($contentType !== 'application/json') {
    respond(['error' => 'Unsupported media type'], 415);
}

try {
    $payload = json_decode(
        file_get_contents('php://input'),
        true,
        64,
        JSON_THROW_ON_ERROR,
    );
} catch (JsonException) {
    respond(['error' => 'Invalid JSON'], 400);
}
```

Enforce body size in both web server and application. Parsing is not validation.

## Minimal router

```php
$handler = match ([$method, $path]) {
    ['GET', '/health'] => static fn () => respond(['status' => 'ok']),
    ['POST', '/api/orders'] => $createOrder,
    default => null,
};

if ($handler === null) {
    respond(['error' => 'Not found'], 404);
}

$handler();
```

A production router also handles parameters, method mismatch, and decoding.

## Response and middleware

Send status and headers before the body. Keep output in one response abstraction.

```text
request ID -> trusted proxy -> body limit -> routing
-> authentication -> authorization -> validation
-> handler -> error mapping -> response
```

Each middleware should have one clear responsibility. Error mapping, logging, and CORS may need to wrap the whole pipeline.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: From HTTP request to router and response">
<p class="lesson-diagram-title">Concept map: From HTTP request to router and response</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Front controller</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Read a JSON body</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Minimal router</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Response and middleware</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Front controller” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Route dynamic requests to public/index.php and start from one entry point: Keep the project root outside the document root so clients cannot fetch vendor/, .env, or source files. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Front controller” with “Read a JSON body”. Why does neither replace the other in “From HTTP request to router and response”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Front controller”: Route dynamic requests to public/index.php and start from one entry point: Keep the project root outside the document root so clients cannot fetch vendor/, .env, or source files. For “Read a JSON body”: Enforce body size in both web server and application. Parsing is not validation. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Minimal router”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A production router also handles parameters, method mismatch, and decoding. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Response and middleware” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Send status and headers before the body. Keep output in one response abstraction. Each middleware should have one clear responsibility. Error mapping, logging, and CORS may need to wrap the whole pipeline. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
