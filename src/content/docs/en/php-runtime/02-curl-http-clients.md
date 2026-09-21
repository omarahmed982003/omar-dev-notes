---
title: 2. cURL and HTTP clients
description: libcurl, PHP's extension, Guzzle, timeouts, TLS, JSON requests, and error handling.
sidebar:
  order: 2
---

# From cURL to a reliable HTTP client

The cURL project produces the `curl` command-line tool and the `libcurl` transfer library. PHP's `ext-curl` binds PHP to libcurl. It is an outbound client, not a web server or a socket server.

## A complete request

```php
<?php
declare(strict_types=1);

$handle = curl_init('https://api.example.com/v1/users/42');
curl_setopt_array($handle, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'User-Agent: OmarDevNotes/1.0',
    ],
    CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_FOLLOWLOCATION => false,
]);

$body = curl_exec($handle);
if ($body === false) {
    $message = curl_error($handle);
    $code = curl_errno($handle);
    curl_close($handle);
    throw new RuntimeException("Network error {$code}: {$message}");
}

$status = curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
curl_close($handle);

if ($status < 200 || $status >= 300) {
    throw new RuntimeException("Unexpected HTTP status: {$status}");
}

$data = json_decode($body, true, flags: JSON_THROW_ON_ERROR);
```

Keep three failure classes separate: transport failure, non-successful HTTP response, and invalid response content.

## Sending JSON

```php
$payload = json_encode(
    ['email' => 'user@example.com', 'active' => true],
    JSON_THROW_ON_ERROR
);

$handle = curl_init('https://api.example.com/v1/users');
curl_setopt_array($handle, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $token,
    ],
    CURLOPT_CONNECTTIMEOUT_MS => 1000,
    CURLOPT_TIMEOUT_MS => 5000,
]);
```

Never log authorization headers, cookies, or sensitive bodies.

## TLS, redirects, and SSRF

Never disable peer or hostname verification in production. Repair the CA trust configuration instead. Redirects can move a request to a different destination, so set a maximum and validate destinations.

Do not accept an arbitrary user-controlled URL in server-side fetching. Validate scheme and host and block internal, loopback, and metadata endpoints as required by the environment.

## Guzzle and standards

Guzzle offers middleware, promises, and pooling. It is not permanently tied to cURL; its handler can use cURL or PHP streams.

```php
use GuzzleHttp\Client;

$client = new Client([
    'base_uri' => 'https://api.example.com/',
    'connect_timeout' => 3,
    'timeout' => 10,
]);

$response = $client->get('v1/users/42', [
    'headers' => ['Accept' => 'application/json'],
]);
```

PSR-7 models HTTP messages and PSR-18 defines a client interface. Depending on an interface improves replacement and testing.

## Production rules

- Set both connection and total timeouts so a slow dependency does not occupy an FPM worker indefinitely.
- Retry only transient failures, with exponential backoff and jitter.
- Retry non-idempotent writes only with a server-supported idempotency key.
- Respect `Retry-After` for 429/503.
- Limit response sizes and stream large bodies.
- Use `curl_multi_*` or a client pool for bounded concurrency, never unbounded fan-out.
