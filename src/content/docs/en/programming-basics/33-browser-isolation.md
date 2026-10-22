---
title: "Resource loading and window isolation"
description: "Resource loading and window isolation"
sidebar:
  order: 25
prev: {"link":"/en/programming-basics/11-same-origin-cors/","label":"Controlling cross-origin data access"}
next: {"link":"/en/programming-basics/12-realtime-webhooks/","label":"Poll or receive a server stream"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>
An image appears from another site, yet JavaScript cannot read its response. After adding a security policy, even the image disappears. **Reading a response**, **embedding a resource**, and **relating two windows** are different decisions.

This is optional depth after [CORS](/en/programming-basics/11-same-origin-cors/) and basic HTML/JavaScript, not a prerequisite for a first web application. Start with the prepared traces without code and return to the lab after [PHP setup](/en/php/00-lab-setup/).

## Start with three different operations

An **origin** combines scheme, host, and port. `http://127.0.0.1:8775` and `http://127.0.0.1:8776` are different origins despite sharing one computer.

**Embedding** loads a resource into a page, such as an `img` element. **Reading** gives page code access to response contents. Displaying an image does not authorize arbitrary code to read its bytes.

**no-cors** is a mode for certain resource requests. It does not request normal CORS response access; a JavaScript fetch normally receives an **opaque response**, hiding status and body. It does not disable browser security.

| Decision | Related policy | Who sends it? |
|---|---|---|
| May another origin's script read the response? | CORS | Response owner |
| May a resource be used through relevant no-cors loads? | CORP | Resource owner |
| Does a document require permission for embedded resources? | COEP | Document owner |
| Does an opener-window relationship remain? | COOP | Top-level document owner |

## CORP: the resource limits its use

**CORP, Cross-Origin Resource Policy**, restricts relevant no-cors resource use. An image server might return:

~~~http
Cross-Origin-Resource-Policy: same-origin
~~~

That prevents this image being embedded through no-cors by another origin. `same-site` permits a wider site-based scope; `cross-origin` allows other origins in this context.

**Prepared trace:** page 8775 embeds an image from 8776. The image returns 200 with `same-origin`. The browser may receive the HTTP response but block its use under the policy. Status 200 alone does not prove the image may appear.

CORP is not **authentication**, identity verification, or **authorization**, resource permission. Non-browser clients are not denied access simply because this field exists. The server must protect its data.

## COEP: the document requires permission for resources

**COEP, Cross-Origin Embedder Policy**, belongs to the embedding document. This setting requires a cross-origin no-cors resource to supply suitable CORP permission:

~~~http
Cross-Origin-Embedder-Policy: require-corp
~~~

For the image in this example, two possible paths are:

- A no-cors load with `Cross-Origin-Resource-Policy: cross-origin` in the resource response.
- A CORS request, for example an image using `crossorigin="anonymous"`, with a response permitting the document's origin through CORS.

COEP does not override explicit CORP denial or manufacture CORS permission. If you do not own the resource server, review whether it supports your application's policy instead of blindly changing production headers.

The `credentialless` value permits certain cross-origin no-cors loads without credentials such as cookies, subject to support. It differs from require-corp and must be checked against authentication requirements.

## COOP: the relationship between windows

**COOP, Cross-Origin Opener Policy**, controls whether top-level documents share a **browsing context group**, a set of windows or tabs retaining specified scripting relationships.

~~~http
Cross-Origin-Opener-Policy: same-origin
~~~

In a typical example, a same-origin-policy document opens a cross-origin document with nonmatching policy. The browser separates their contexts; `window.opener`, the reference to the opening window, may no longer be available.

This is not API reading permission or an image-loading rule. It can affect login/payment integrations that use another origin's popup to return results. Test policy matching and the integration contract; not every popup failure is CORS.

## Why combine COOP and COEP?

**Cross-origin isolation** enables sensitive capabilities under stronger conditions, including `SharedArrayBuffer`, shared byte storage between permitted execution agents.

A common combination is:

~~~http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
~~~

These headers alone are not a universal guarantee. The context must be secure, the browser must support the capability, and Permissions-Policy or containing documents must not prevent it. **Permissions-Policy** controls availability of browser features.

`window.crossOriginIsolated` reports the actual boolean state. Check it rather than assuming success from a header list. Modern browsers treat loopback as potentially trustworthy for local development; that does not replace HTTPS for deployment.

## Optional PHP lab: a blocked image becomes permitted

Use two files in a new practice folder, PHP, and a modern browser. Node.js is unnecessary. Addresses are loopback-only, with no real login or secrets.

Save `page.php` below. `header` sends a response field, `img` embeds an image, and `alt` supplies alternative text. `document.querySelector` selects an element and `textContent` writes its text. JavaScript only displays the isolation check:

~~~php
<?php
header('Content-Type: text/html; charset=utf-8');
header('Cross-Origin-Opener-Policy: same-origin');
header('Cross-Origin-Embedder-Policy: require-corp');
?>
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Local isolation lab</title>
<p id="state"></p>
<img src="http://127.0.0.1:8776/resource.php" alt="Lab image was blocked" width="180" height="80">
<script>
document.querySelector('#state').textContent =
    'crossOriginIsolated: ' + window.crossOriginIsolated;
</script>
</html>
~~~

Save `resource.php` alongside it. **SVG, Scalable Vector Graphics**, describes vector shapes as text; this draws a rectangle labelled Allowed:

~~~php
<?php
header('Content-Type: image/svg+xml');
header('Cross-Origin-Resource-Policy: same-origin');
header('Cache-Control: no-store');
echo '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="80">'
    . '<rect width="180" height="80" fill="#165dca"/>'
    . '<text x="90" y="48" text-anchor="middle" fill="white" font-size="24">Allowed</text>'
    . '</svg>';
~~~

Start separate terminals in the practice folder:

~~~powershell
php -S 127.0.0.1:8775
~~~

~~~powershell
php -S 127.0.0.1:8776
~~~

Open `http://127.0.0.1:8775/page.php` with Network and Console visible. Expect CORP to block the image; diagnostic wording varies. Isolation may report true when the environment meets its conditions.

Change **only the CORP line in resource.php** to:

~~~php
header('Cross-Origin-Resource-Policy: cross-origin');
~~~

Reload, disabling cache in developer tools for the comparison. Expect the rectangle to appear. Successful embedding does not allow a page's `fetch` to read its response without suitable CORS.

**Third comparison:** remove the CORP line in the training copy. With document require-corp still enabled, a cross-origin image without suitable permission is blocked too. Restore the line after observing. Do not apply these experiments blindly to production.

Stop both servers with Ctrl+C. Two ports model two origins; they are not a requirement for every website.

## Diagnose using evidence

| Observation | Appropriate check |
|---|---|
| HTTP 200 but image blocked | Request mode, resource CORP, document COEP, browser diagnostic |
| Image displays but fetch cannot read | CORS; embedding is not reading permission |
| Payment popup cannot return its result | COOP, opener relationship, integration contract |
| Both headers present but isolation false | Secure context, support, permissions, containing context |

**Exercise:** A colleague adds all three headers to every response “for security.” Design separate checks for an external image and a login popup, explaining why one policy cannot answer both questions.

<details><summary>Guided answer</summary>
Inspect resource embedding with its request mode and response headers. Inspect opener relationships separately. CORP/COEP govern relevant resource loading; COOP governs window-context separation. Choose policies for known requirements rather than copying a header bundle.
</details>

## References

- [CORP — MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CORP)
- [COEP — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy)
- [COOP — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Opener-Policy)
- [crossOriginIsolated — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated)
