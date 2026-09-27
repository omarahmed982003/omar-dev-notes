---
title: "Remembering users and protecting updates"
description: "Remembering users and protecting updates"
sidebar:
  order: 15
prev: {"link":"/en/programming-basics/05-http-messages-state/","label":"Read an HTTP request and response"}
next: {"link":"/en/programming-basics/06-https-tls-certificates/","label":"Connection encryption and website certificates"}
---

After reading one request and response, connect a user’s requests and prevent an older edit from overwriting a newer one.

## Methods, fields, and concurrent changes

| Method | Intended use | Safe? | Idempotent? |
|---|---|---|---|
| GET | Retrieve a representation | Yes | Yes |
| HEAD | GET metadata without response content | Yes | Yes |
| POST | Resource-specific processing, often creation | No | Not inherently |
| PUT | Replace resource state | No | Yes |
| PATCH | Partial modification | No | Depends on operation |
| DELETE | Remove the resource | No | Yes |
| OPTIONS | Describe communication options | Yes | Yes |

Host selects the website name; Accept states response formats; Content-Type identifies the sent body; Authorization supplies credentials; Cookie sends matching stored values; User-Agent describes the client; Cache-Control sets caching policy. **Virtual hosting** serves several website names on one server. **JWT (JSON Web Token)** is one token format; a token need not use it or a server-side session store.

HTTP/2 and HTTP/3 use binary message representations rather than HTTP/1.1 text lines. Binary representation itself is not encryption. A 401 response requires valid authentication and its appropriate challenge; a 403 refusal does not prove that the user's identity is known.

**Content negotiation** selects a representation using fields such as Accept-Language and Accept-Encoding. **Vary** tells caches which request fields distinguish variants. An **ETag (Entity Tag)** identifies a representation version. **If-None-Match** supports checking a saved copy; **If-Match** permits modification only if the version still matches, preventing a **lost update**.

**Worked check:** A client read "v7", but another client saved "v8". An update with If-Match: "v7" must fail with **412 Precondition Failed** when the condition does not match. Checking the condition and updating must be atomic with respect to competing writes. The client should reread the latest version and handle the conflict.


## Follow state and run a response

HTTP does not automatically remember an earlier request. Cookies are browser-stored values sent by matching rules; sessions are server-side state commonly linked by a cookie ID; tokens are client-sent credentials. Not every token is a JWT (JSON Web Token, a token format carrying claims; not all tokens use it), and JWT does not automatically replace session design.

This optional example requires [PHP lab setup](/en/php/00-lab-setup/). Save it as hello.php in a new practice folder and run `php -S localhost:8000` there. Open `http://localhost:8000/hello.php?name=Omar`; the expected body is `{"message":"Hello Omar"}`.

```php
<?php
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$rawName = $_GET['name'] ?? 'Guest';
if (!is_string($rawName)) {
    http_response_code(400);
    echo json_encode(['error' => 'name must be text']);
    exit;
}
$name = trim($rawName);
echo json_encode(['message' => "Hello {$name}"], JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR);
```

The request method is read from `$_SERVER`; `$_GET` supplies URL parameters. The `??` operator supplies a fallback, `is_string` checks that the name is text, and `trim` removes surrounding whitespace. `header` sets a response field, `http_response_code` sets the status, and `json_encode` builds JSON. Its flags replace invalid UTF-8 bytes and raise an exception for other encoding failures.

Test `?name[]=Omar`: the array input is rejected with400. POST is rejected with405 and Allow: GET. No name returns Guest. Stop the local server with Ctrl+C.
