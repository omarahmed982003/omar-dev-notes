---
title: "How the browser displays a page"
description: Navigation, DOM, CSSOM, render trees, JavaScript execution, and practical DevTools analysis.
sidebar:
  order: 18
prev: {"link":"/en/programming-basics/23-tls-handshake-details/","label":"How peers establish an encrypted connection"}
next: {"link":"/en/programming-basics/29-browser-scheduling/","label":"Load scripts and schedule browser tasks"}
---


## Change text size and measure width

Save as `render.html` or [run it](/examples/first-program/render.html). **CSS** specifies presentation; `font-size` sets size and `px` is a CSS pixel, not necessarily one physical screen dot. `span` groups text; `style` sets presentation. `getBoundingClientRect()` reads the laid-out element box, whose `width` we display.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Measure a visible change</title>
<p><span id="sample" style="font-size:16px;display:inline-block">Hello</span></p>
<button id="grow">Grow text</button>
<p id="output"></p>
<script>
function measure() {
  const width = document.querySelector("#sample").getBoundingClientRect().width;
  document.querySelector("#output").textContent = "Width: " + width + " CSS pixels";
}
function grow() {
  document.querySelector("#sample").style.fontSize = "32px";
  measure();
}
document.querySelector("#grow").addEventListener("click", grow);
measure();
</script>
</html>
```

Record width before clicking. Text grows from16 to32 and measured width increases; exact numbers depend on font/browser. **DOM** represents elements; **layout** computes their geometry; **paint** prepares appearance. Resizing needs updated geometry, unlike merely changing color.

## Before the details

Receiving HTML (Hypertext Markup Language, a language describing page structure) is not the end. The browser builds a DOM (Document Object Model, the page's element tree exposed to programs), resolves CSS (Cascading Style Sheets, rules describing element appearance), constructs what to paint, and runs JavaScript; network and script work can block parts of that path.

## From a response to pixels

```text
HTML bytes -> decode -> tokens -> DOM
CSS bytes  -> parse  -> CSSOM
DOM + CSSOM -> Render Tree -> Layout -> Paint -> Composite
```

- **DOM (Document Object Model)** represents elements and content as a tree, such as a page containing a heading and paragraphs.
- **CSSOM (CSS Object Model)** contains parsed style rules. Parsing reads structured text into a usable representation.
- **Layout** calculates geometry.
- **Paint** draws text, color, and borders.
- **Composite** assembles layers into the final frame.

Render-critical CSS can delay paint. A classic script can pause HTML parsing while it downloads and executes.

## DevTools workflow

1. Use **Network** with cache disabled for controlled tests.
2. Inspect DNS (Domain Name System, a distributed system answering queries about domain names), connection, TLS (Transport Layer Security, rules for establishing an authenticated protected connection), TTFB (Time To First Byte, time until the first response byte according to the measurement tool), and download phases.
3. Check headers, transferred size, and protocol.
4. Use **Performance** for tasks, layout, and paint.
5. Use **Elements** for DOM and computed styles.

:::tip
A high TTFB may come from the network, CDN (Content Delivery Network, distributed servers delivering content closer to users), PHP (a programming language commonly used for server-side web processing), or the database. Correlate browser traces with server logs and profiling.
:::

## Practical problems

<details><summary>Why might a page briefly appear unstyled?</summary><p>HTML may arrive before CSS. The browser can build the DOM but needs the CSSOM to apply styles during rendering.</p></details>

<details><summary>Where do you investigate a JavaScript file returning 404?</summary><p>Start in Network for URL (Uniform Resource Locator, an address identifying a resource and how to access it), status, and initiator, then use Console to inspect the effect of the failed load.</p></details>

<details><summary>Does <code>DOMContentLoaded</code> mean every image finished?</summary><p>No. It means HTML parsing completed and the DOM is ready; images and other resources may still be loading.</p></details>

## Measure visible behavior

**Decoding** reads bytes according to their text encoding; **tokens** are meaningful pieces such as tag boundaries. A **render tree** contains information used to display eligible elements. **Pixels** are small displayed color points. The arrows show responsibilities, not a promise that each happens only once.

**LCP, Largest Contentful Paint**, measures the display time of the largest eligible visible content element. **INP, Interaction to Next Paint**, measures interaction responsiveness over a visit. **CLS, Cumulative Layout Shift**, measures unexpected layout movement. They answer different questions.

The **main thread** handles much page execution. The **event loop** schedules work; **microtasks** run at specified checkpoints after current execution and before a subsequent rendering opportunity. A never-ending microtask chain can delay rendering. Painting need not happen after every task. **Layout thrashing** is repeated geometry reads and writes forcing repeated layout computation. Group reads and writes where appropriate. **Accessibility** includes keyboard and assistive-technology use.

The script snippets reference example files; they demonstrate loading attributes, not standalone programs. Modules form a **dependency graph**, a relationship map showing which files import others. DOMContentLoaded follows HTML parsing and relevant deferred/module execution, not completion of every image.

**Worked check:** A large image appears late although HTML arrived quickly. Inspect when its request starts, its size, and code delaying its display. Change one factor and compare several loads under the same conditions. Faster server response alone does not prove faster image display.

## Next step

After completing this practice, continue with [Load scripts and schedule browser tasks](/en/programming-basics/29-browser-scheduling/).
