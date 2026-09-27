---
title: "Load scripts and schedule browser tasks"
description: "Load scripts and schedule browser tasks"
sidebar:
  order: 19
prev: {"link":"/en/programming-basics/09-browser-rendering-devtools/","label":"How the browser displays a page"}
next: {"link":"/en/programming-basics/32-local-network-lab/","label":"Set up a local request-and-response lab"}
---

First change a page and measure its size. A **module** declares provided code and imports. A **dependency graph** connects files to what they need; if A imports B, B must be prepared according to loading rules before dependent execution. Relate scheduling to responsiveness.


## JavaScript loading

```html
<script src="/app.js" defer></script>
<script type="module" src="/main.js"></script>
```

`defer` preserves order and runs after DOM parsing. Modules are deferred by default. `async` runs as soon as it is ready and does not preserve ordering between independent scripts.

Repeated layout reads and writes can cause layout thrashing. Batch reads and writes, and prefer compositor-friendly properties such as `transform` where appropriate.

## Event loop and responsiveness

Long JavaScript tasks block input and rendering. Inspect Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift, and main-thread long tasks.

## Why the second load can differ

A **redirect** asks the browser to request another address. **Connection reuse** sends another request over an existing connection instead of repeating setup. A **Service Worker** is a website-registered browser program that can handle selected requests, including serving saved local responses.

Open browser **DevTools**, the developer inspection tools, and choose **Network** before loading. The **waterfall** displays each request's timing. A **cookie** is a browser-stored value sent with matching requests; **CORS** controls whether page scripts may read selected cross-origin responses, covered later.

**Worked check:** The second request has no new connection phase. Does that prove a cache hit? No. It may reuse an existing connection and still reach the server. Inspect explicit cache indicators and response headers rather than inferring the source from speed alone.
