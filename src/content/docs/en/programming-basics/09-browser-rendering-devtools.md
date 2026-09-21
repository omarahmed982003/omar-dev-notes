---
title: 9. How browsers render a page
description: Navigation, DOM, CSSOM, render trees, JavaScript execution, and practical DevTools analysis.
sidebar:
  order: 9
---

## From a response to pixels

```text
HTML bytes -> decode -> tokens -> DOM
CSS bytes  -> parse  -> CSSOM
DOM + CSSOM -> Render Tree -> Layout -> Paint -> Composite
```

- **DOM** represents elements and content.
- **CSSOM** contains parsed style rules.
- **Layout** calculates geometry.
- **Paint** draws text, color, and borders.
- **Composite** assembles layers into the final frame.

Render-critical CSS can delay paint. A classic script can pause HTML parsing while it downloads and executes.

## JavaScript loading

```html
<script src="/app.js" defer></script>
<script type="module" src="/main.js"></script>
```

`defer` preserves order and runs after DOM parsing. Modules are deferred by default. `async` runs as soon as it is ready and does not preserve ordering between independent scripts.

Repeated layout reads and writes can cause layout thrashing. Batch reads and writes, and prefer compositor-friendly properties such as `transform` where appropriate.

## Event loop and responsiveness

Long JavaScript tasks block input and rendering. Inspect Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift, and main-thread long tasks.

## DevTools workflow

1. Use **Network** with cache disabled for controlled tests.
2. Inspect DNS, connection, TLS, TTFB, and download phases.
3. Check headers, transferred size, and protocol.
4. Use **Performance** for tasks, layout, and paint.
5. Use **Elements** for DOM and computed styles.

:::tip
A high TTFB may come from the network, CDN, PHP, or the database. Correlate browser traces with server logs and profiling.
:::

