---
title: "Remembering users and protecting updates"
description: "Remembering users and protecting updates"
sidebar:
  order: 10
prev: {"link":"/en/programming-basics/05-http-messages-state/","label":"Read an HTTP request and response"}
next: {"link":"/en/programming-basics/06-https-tls-certificates/","label":"Connection encryption and website certificates"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>
How does a server connect two visits from the same browser when HTTP itself does not remember a user? Follow two requests, then optionally run a local PHP session. You need the **request** and **response** model from [HTTP messages](/en/programming-basics/05-http-messages-state/).

## Foundation: the browser stores an identifier; the server stores state

A **cookie** is a small value the browser stores and attaches automatically to requests that match its rules. It need not be a separate visible file, and not every cookie represents a login.

An application **session** connects state across requests. In this example, the server stores the session data; the browser holds only a random identifier, not the visit count or a password.

**Stateless HTTP** means HTTP does not infer that relationship itself. The application builds it from information the client sends. It does not prohibit server-side storage.

## Follow two requests

The value `demo-id` is a readable placeholder, not an identifier to choose in a real application:

~~~http
GET /counter.php HTTP/1.1
Host: 127.0.0.1:8088

HTTP/1.1 200 OK
Set-Cookie: FOUNDATIONSLAB=demo-id; Path=/; HttpOnly; SameSite=Lax
Cache-Control: no-store

{"visits":1}
~~~

**Set-Cookie** is a **response** field asking the browser to store a value under defined rules. The server associates that identifier with state such as `visits = 1`.

~~~http
GET /counter.php HTTP/1.1
Host: 127.0.0.1:8088
Cookie: FOUNDATIONSLAB=demo-id

HTTP/1.1 200 OK
Content-Type: application/json

{"visits":2}
~~~

**Cookie** is a **request** field returning matching stored values. The server retrieves the session and increments its count. It need not send Set-Cookie on every response when no cookie change is needed.

<figure class="teaching-figure">
  <img src="/diagrams/foundations/network/cookie-session-en.svg" alt="A first request without a cookie creates a session; Set-Cookie returns its identifier; a second request sends Cookie and retrieves the same session." loading="lazy" />
  <figcaption>The response supplies an identifier and the next request returns it. Session data remains on the server.</figcaption>
</figure>

Without the identifier, the server may create a new session. Another visitor has a different identifier. A login session identifier is a **credential**: stealing it can enable impersonation, so never publish it in screenshots or public logs.

## Cookie attributes: what each one protects

An **attribute** configures a cookie after its value in Set-Cookie. It is not part of that value; the browser does not copy all the attributes into the Cookie request field.

| Attribute | Purpose and limit |
|---|---|
| `Secure` | Restricts sending to secure connections under browser rules; does not encrypt disk storage or fix a compromised server |
| `HttpOnly` | Prevents ordinary page JavaScript cookie APIs from reading it; the browser may still attach it to requests, so this does not neutralize all XSS effects |
| `SameSite=Lax` or `Strict` | Restricts cross-site sending; Lax permits some safe top-level navigations, while Strict is more restrictive |
| `SameSite=None; Secure` | Allows cross-site contexts when other browser policies permit them; does not override third-party cookie restrictions |
| `Path=/` | Matches paths throughout the site; Path is not an authorization boundary between untrusted applications |
| `Domain` | Broadens eligible hosts when configured; omitting it makes a host-only cookie |
| `Max-Age` or `Expires` | Controls persistence; without them it is a session cookie, which browser session restore may restore |

**Site**, used by SameSite, is different from an **origin**, the scheme/host/port tuple. Two origins can be same-site. Cookies are not isolated by port in the same way as origin-based browser policies.

**CSRF, Cross-Site Request Forgery**, tricks a browser into performing an unwanted operation with its credentials. SameSite mitigates some cases; it does not replace authorization or general protection for state-changing operations.

## Optional PHP lab: retain a local count across two requests

This requires [PHP setup](/en/php/00-lab-setup/), not Node.js. Use PHP 8.3 or later as described there and a new empty practice folder. There are no real accounts or personal data.

Create `public` for HTTP-accessible code and `session-data` **outside** it for stored sessions. In PowerShell in the practice folder:

~~~powershell
New-Item -ItemType Directory -Path public, session-data
~~~

`New-Item` creates directories. If these names already exist, use a fresh practice folder instead of overwriting files. Save this complete file as `public/counter.php`:

~~~php
<?php
declare(strict_types=1);

session_name('FOUNDATIONSLAB');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax',
]);
if (!session_start(['use_strict_mode' => 1])) {
    throw new RuntimeException('Session could not start');
}

$_SESSION['visits'] = ($_SESSION['visits'] ?? 0) + 1;
$visits = $_SESSION['visits'];
session_write_close();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
echo json_encode(['visits' => $visits], JSON_THROW_ON_ERROR);
~~~

`session_name` chooses the cookie name. `session_set_cookie_params` configures attributes **before** starting the session. `session_start` restores or creates a session; strict mode rejects uninitialized identifiers with the normal session store.

`$_SESSION` contains this session's values. `?? 0` supplies zero for a missing counter. `session_write_close` saves and unlocks the session; `json_encode` produces JSON. Headers precede output.

Start the development server from the practice folder, not from `public`:

~~~powershell
php -d session.save_path=./session-data -S 127.0.0.1:8088 -t public
~~~

`-d` sets session storage for this process, `-S` starts the server, and `-t public` limits its web document root. It listens only on this computer and is not a production server. Leave the terminal open.

In a second terminal in the **same practice folder**:

~~~powershell
curl.exe -i -c cookies.txt http://127.0.0.1:8088/counter.php
curl.exe -i -b cookies.txt -c cookies.txt http://127.0.0.1:8088/counter.php
curl.exe -i http://127.0.0.1:8088/counter.php
~~~

`-c` writes or updates the practice cookie jar; `-b` reads it for the next request. Commands with -c overwrite that named file, so use it only in the fresh folder. On Linux/macOS use `curl` instead of `curl.exe`.

Expect `visits:1`, then `visits:2`, then `visits:1` in a fresh run. The third request did not load the jar and starts a separate session. Identifiers are random, not fixed expected output.

In a browser, reload the same address twice and inspect Set-Cookie and Cookie in Network. Do not alternate `localhost` and `127.0.0.1`; the browser and curl also use separate cookie stores.

**Safety limit:** `secure => false` is only for this loopback HTTP lab. A deployed login session requires HTTPS, Secure, appropriate settings, and identifier renewal when authentication privileges change. The counter records demonstration visits; it is not an authentication system or reliable analytics.

Do not commit session-data or cookies.txt; they contain training state or identifiers. Stop the server with Ctrl+C.

## First-pass stopping point

Before moving on, explain who sent Set-Cookie, who sent Cookie, where the counter lives, and why the third command starts at1. The next section covers a separate HTTP concern and may wait until you have built a local application.

## Depth: representations and competing edits

**Content negotiation** selects a representation: Accept for media type, Accept-Language for language, Accept-Encoding for compression. **Vary** tells HTTP caches which request fields distinguish those representations.

An **ETag, Entity Tag**, identifies a representation version. **If-None-Match** supports checking a saved copy; see [HTTP caching](/en/programming-basics/10-http-caching-compression/) for its full treatment.

**If-Match** permits an update only while the version matches, preventing a **lost update**, where one client's old edit overwrites a newer one:

1. Omar reads a product with ETag `"v7"`.
2. Mona updates it; the version becomes `"v8"`.
3. Omar submits his update with `If-Match: "v7"`.
4. The server rejects it with `412 Precondition Failed` instead of erasing Mona's change.

Checking and writing must be **atomic**, indivisible with respect to competing updates. A separate check followed by an unprotected write still allows a race. The client rereads the current representation and chooses how to resolve the conflict.

## A token is not another name for a session

A **token** is a credential the client presents for an authorization decision. Tokens can be random or structured. **JWT, JSON Web Token**, is one claims-carrying format, not the type of every token.

A token may travel in Authorization or in a cookie, depending on design. Transport does not by itself determine state storage or eliminate replay and authorization requirements. Login, logout, and detailed session/token trade-offs belong to the security track; stateless HTTP is not a reason by itself to choose JWT.

## Check your understanding

<details><summary>Does deleting the browser cookie immediately delete the server's session data?</summary>
No. It removes that browser's current identifier. Expiry and invalidation of server-side data follow a separate policy; secure logout requires deliberate application behavior.
</details>

<details><summary>Does HttpOnly stop the browser attaching cookies to a JavaScript-initiated request?</summary>
No. It prevents ordinary JavaScript cookie access, not attachment to an eligible request. XSS effects and authorization still matter.
</details>

<details><summary>Does If-Match authenticate the editor?</summary>
No. It checks a version. The server must also verify identity and authorization.
</details>

HTTP does not construct user sessions automatically. An application links requests using an identifier. Representation preconditions solve a different problem: competing edits.

## References

- [HTTP cookies — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
- [PHP session_set_cookie_params](https://www.php.net/manual/en/function.session-set-cookie-params.php)
- [PHP session security settings](https://www.php.net/manual/en/session.security.ini.php)
- [If-Match — RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-if-match)
