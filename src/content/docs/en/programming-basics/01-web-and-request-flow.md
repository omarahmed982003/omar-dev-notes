---
title: "The internet, the web, and a request's journey"
description: Understand the Internet, the Web, client/server roles, and the request-response journey from URL to page.
sidebar:
  order: 1
prev: false
next: {"link":"/en/programming-basics/14-network-layers-lan-ethernet-arp/","label":"How devices communicate on a local network"}
---


When you enter a URL (Uniform Resource Locator, an address identifying a resource and how to access it), a page seems to appear in one step. It actually takes a chain of steps. This lesson gives you the map that connects DNS (Domain Name System, a distributed system answering queries about domain names), TCP (Transmission Control Protocol, ordered byte transport with loss recovery; connections can still fail), TLS (Transport Layer Security, rules for establishing an authenticated protected connection), HTTP (Hypertext Transfer Protocol, the rules for web requests and responses), and PHP (a programming language commonly used for server-side web processing) in the lessons ahead.

## Four steps before details

Enter a site name; **DNS** answers questions about the name, including its address. The browser establishes an appropriate connection, sends a page **request**, and displays a **response**.

```text
Browser ── name question ──> DNS
Browser <─ address answer ── DNS
Browser ── connection + HTTP request ──> Server
Browser <──────── HTTP response ────── Server
```

DNS supplies an address; page content does not flow through it. Proxy and encryption details come in their lessons. **Predict:** a nonexistent name fails before a page request; a reachable server can return404 for a missing resource.

## Begin with the mental model

Think of the Internet as a worldwide road system and the Web as one delivery service that uses those roads. The roads can carry other services too, so **the Internet is not the Web**:

- The **Internet** is the infrastructure that connects devices and networks with protocols such as IP (Internet Protocol, the addressing and routing protocol; an IP address identifies a network interface in context).
- The **Web** is a service that uses that infrastructure to retrieve URL-addressed resources over HTTP or HTTPS (HTTP carried over a TLS-protected connection).
- Email, Internet calls, and online games also use the Internet without being Web pages.

This distinction helps with debugging: having an Internet connection does not prove that a particular site or its HTTP service works.

## Client and server are roles

A **client** starts a request. It may be a browser, a mobile app, or a tool such as `curl`. A **server** program waits for requests and returns responses. Both can run on your computer during development, while a production request may pass through several servers.

```text
User → Client → HTTP Request → Server
                               ↓
                        Application ↔ its data
                               ↓
User ← Rendered page ← HTTP Response
```

“Server” can mean the machine or the program, depending on context. Here, the useful meaning is the role: a program listening for requests at an address and port.

## Read the URL before following it

```text
https://shop.example/products/42?currency=EGP#reviews
```

- `https` is the scheme or requested protocol.
- `shop.example` is the host name that DNS must resolve.
- `/products/42` is the path sent to the server.
- `currency=EGP` is the query string and is normally sent to the server.
- `#reviews` is a fragment used by the browser and is normally absent from the HTTP request.

## Make a real request

```bash
curl -i "https://example.com/"
```

You should see output resembling this; individual headers may differ:

```text
HTTP/2 200
content-type: text/html

<!doctype html>
...
```

- `curl` is the client in place of a browser.
- `-i` includes response headers with the body.
- `HTTP/2 200` says the HTTP request succeeded; it does not prove every business rule is correct.
- `content-type` tells the client how to interpret the body.
- Content after the blank line is the response body.

To inspect more of the connection:

```bash
curl -v "https://example.com/" -o NUL
```

Use `/dev/null` instead of `NUL` on Linux and macOS. `-v` prints connection, TLS, and request details; `-o` hides the page body so you can focus on the journey.

## Common mistakes

- **“DNS opens the page.”** DNS returns an address; HTTP requests the resource.
- **“Nginx executes PHP itself.”** It commonly forwards the request to PHP-FPM.
- **“A `200` response means everything is correct.”** A successful response may still contain incorrect business output.
- **“Every visit reaches the database.”** A cache or static file may answer earlier.
- **“A server must be a large machine.”** It is a role that a small program on your computer can perform.

## Apply the model

<details><summary>A site shows a DNS error. Which later stages have not started?</summary><p>The client has no suitable IP, so it normally cannot begin TCP or QUIC, TLS, or HTTP with that server. Inspect the name and DNS before PHP code.</p></details>

<details><summary><code>curl</code> returns correct HTML (Hypertext Markup Language, a language describing page structure), but the browser page is broken. What does that tell you?</summary><p>The basic DNS, connection, and HTTP path works from the <code>curl</code> environment. Investigate JavaScript, dependent resources, CORS (Cross-Origin Resource Sharing, browser rules for permitted cross-origin response access), cookies, and cache. This narrows the search but does not prove both environments are identical.</p></details>

<details><summary>Does <code>#reviews</code> reach PHP?</summary><p>Normally no. The browser uses the fragment locally. The path and query string, such as <code>/products/42?currency=EGP</code>, do reach the server.</p></details>

## Check your understanding

1. What is the practical difference between the Internet and the Web?
   - **Answer:** The Internet is general transport infrastructure; the Web is one service using it through HTTP/HTTPS. Internet access can work while a particular Web service fails.
2. How can one computer be both client and server?
   - **Answer:** They are program roles. A browser can start the request while a local development server receives it on the same machine.
3. Where should you look if DNS and TLS succeed but the server returns `403`?
   - **Answer:** The request reached HTTP, and `403` says the server understood it but denied access. Inspect identity, permissions, and web-server or WAF rules.
