---
title: "Content negotiation: one resource, multiple representations"
description: "Use Accept, Content-Type, language preferences, encoding, and Vary without corrupting caches."
sidebar:
  order: 36
prev: {"link":"/en/programming-basics/36-network-troubleshooting/","label":"Troubleshoot from DNS through HTTP"}
next: {"link":"/en/programming-basics/38-http-large-transfers/","label":"Large HTTP transfers: ranges, multipart, and streaming"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A **representation** is bytes plus metadata describing resource state in one response. The same product may be represented as JSON or HTML and in different languages. **Content negotiation** selects among server capabilities and client preferences.

```http
GET /products/42 HTTP/1.1
Host: api.example.test
Accept: application/json
Accept-Language: ar, en;q=0.8
Accept-Encoding: br, gzip
```

`Accept` lists acceptable media types. A `q` weight ranges from zero to one; higher is preferred and zero means unacceptable. The response's `Content-Type` declares the representation actually sent, while `Content-Encoding` declares a transfer coding such as gzip.

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Language: ar
Content-Encoding: gzip
Vary: Accept, Accept-Language, Accept-Encoding
```

| Header | Direction | Meaning |
|---|---|---|
| `Accept` | Request | Preferred response media types |
| `Content-Type` | Either | Type of the body actually present |
| `Accept-Language` | Request | Acceptable languages and preferences |
| `Content-Language` | Response | Language of this representation |
| `Vary` | Response | Request fields that alter the cache key |

Missing `Vary` can make a cache serve the wrong language or coding. `406 Not Acceptable` concerns unavailable output preferences; `415 Unsupported Media Type` concerns an input body type the endpoint cannot consume.

```php
Route::get('/products/{id}', function (int $id, Request $request) {
    abort_unless($request->acceptsJson(), 406);
    return response()->json(['id' => $id, 'name' => 'Keyboard'])
        ->header('Vary', 'Accept, Accept-Language');
});
```

