---
title: "Large HTTP transfers: ranges, multipart, and streaming"
description: "Resume downloads, upload fields and files, and understand HTTP/1.1 framing without buffering every body in memory."
sidebar:
  order: 37
prev: {"link":"/en/programming-basics/37-http-content-negotiation/","label":"Content negotiation: one resource, multiple representations"}
next: {"link":"/en/programming-basics/39-http-connections-timeouts/","label":"HTTP connections and timeout budgets"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Large or long-lived bodies should not always become one in-memory value. Each mechanism below solves a different direction.

<figure class="teaching-figure visual-focus">
  <img src="/diagrams/foundations/network/large-http-transfer.svg" alt="Visual comparison of Range for partial downloads, Multipart for multi-part uploads, and Streaming for progressive response production" loading="lazy" />
  <figcaption>Range selects part of a downloaded resource, Multipart separates uploaded request parts, and Streaming describes progressive production while HTTP handles framing.</figcaption>
</figure>

## Range requests

```http
GET /videos/lesson.mp4 HTTP/1.1
Range: bytes=1000000-1999999
```

A supporting server answers `206 Partial Content` with `Content-Range` and the part length. An unsatisfiable range commonly produces `416 Range Not Satisfiable` and `Content-Range: bytes */8000000`. **If-Range** requests a part only while a validator still matches; otherwise the server sends the full current representation, preventing a client from joining bytes from different versions.

## Multipart uploads

`multipart/form-data` divides a request body with a unique **boundary**. Each part has headers and data:

```http
Content-Type: multipart/form-data; boundary=demo-boundary

--demo-boundary
Content-Disposition: form-data; name="photo"; filename="me.png"
Content-Type: image/png

...binary bytes...
--demo-boundary--
```

Do not trust client filenames or MIME claims. Limit size, count, and duration; inspect content; generate storage names; and stream instead of loading an entire file into memory. Direct-to-object-storage uploads can remove application-worker pressure, but signed URLs still need authorization, expiry, size/content restrictions, and completion checks.

:::note[Deep dive: filenames and MIME types do not prove content]
`photo.jpg` and `Content-Type: image/jpeg` are client claims that an attacker can change. **Magic bytes** are signatures near the beginning of many formats and help identify the actual type. Check them with a maintained library, then parse or decode the expected format; a signature is neither antivirus scanning nor proof that a file is safe.

Store the object under a server-generated name outside executable code paths, and enforce limits on size, part count, and read time before and during the upload. When appropriate, re-encode an accepted image instead of serving the original bytes, and never let a client-provided extension or MIME value select an execution path.
:::

:::note[Deep dive: direct upload still needs a verification state]
For a direct-to-object-storage upload, the API issues a short-lived signed URL scoped as tightly as possible to the user, object key, size, and type. A completed client upload is not yet trusted. Record it as `pending`; after a storage event or confirmation request, run a worker that checks size and type, scans for malware, and extracts metadata or a thumbnail in an isolated environment.

Move the object into its final location or mark it `ready` only after validation succeeds. On failure, quarantine or delete it according to a stated policy and log the reason without exposing secrets. This prevents a public link from serving an unscanned object during the gap between upload and processing.
:::

## Chunked framing versus streaming

HTTP/1.1 can use `Transfer-Encoding: chunked` when length is not known up front. Each wire chunk starts with a hexadecimal size and a zero-sized chunk ends the message. This is message **framing**, not proof that every intermediary flushes application output immediately.

HTTP/2 and HTTP/3 use their own frames, not HTTP/1.1 chunked syntax. Do not manually set chunked encoding in Laravel; let the runtime and web server frame the response. Design streaming, buffering policy, deadlines, backpressure, and client-disconnect handling.

