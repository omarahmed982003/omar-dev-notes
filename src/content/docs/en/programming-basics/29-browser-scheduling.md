---
title: "Load scripts and schedule browser tasks"
description: "Load scripts and schedule browser tasks"
sidebar:
  order: 19
prev: {"link":"/en/programming-basics/20-transport-diagnostics/","label":"MTU: why small exchanges work while large transfers stall"}
next: {"link":"/en/programming-basics/07-server-side-path/","label":"A request's journey inside the server"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

Two files arrived, but the code needing configuration executed first. A click was delayed even though network data had arrived. Downloading, executing, and painting are different stages; trace each one.

This is depth after introductory HTML and JavaScript, not a prerequisite for a first page. **HTML** describes document elements; the **DOM, document object model**, represents them in memory for scripts. If functions are new, follow the tables and return to the code after language basics.

## JavaScript loading

**Parsing HTML** builds the document model from text. A **script** is a JavaScript program. A **module** declares exports and imports; its **dependency graph** relates it to the modules it needs.

Downloading obtains bytes; executing runs instructions. A download finishing first does not establish that it should execute first.

| External script in HTML | Download | Execution in the ordinary example |
|---|---|---|
| Classic script without async/defer | Can block parsing at its position | Execute, then resume parsing |
| Classic script with defer | Overlaps continued parsing | After parsing, preserving classic deferred-script order |
| Classic script with async | Overlaps parsing | When ready; independent-file order is not guaranteed |
| type="module" without async | Fetch module and dependencies | Deferred by default; respects dependencies |

These tags illustrate loading policy, not a complete application with supplied source files:

~~~html
<script src="/app.js" defer></script>
<script type="module" src="/main.js"></script>
~~~

If app reads configuration created by config, marking both async does not establish config-first execution. For classic deferred files, use dependency order in the document; with modules, explicitly declare the dependency through **import**, requesting another module's exported code. JavaScript owns the syntax details.

## Event loop and responsiveness

The **main thread** runs this page's JavaScript and participates in interface work. A **task** is a turn of work, such as script execution, an event handler, or a timer callback. A **callback** is a function supplied to other code for invocation. The platform invokes this example's timer/promise callbacks later; not every programming callback is asynchronous.

In this example, synchronous script execution completes without a ready timer or promise callback interrupting it on the same thread. A **microtask**, such as a ready promise's then handler, is processed at an appropriate checkpoint after current execution, before another ordinary task. The **event loop** coordinates opportunities for this work and display updates.

Rendering does not necessarily occur after every task. The browser chooses rendering opportunities; endlessly adding microtasks can also delay other work.

## A complete file with predictable output

Save `event-loop.html` in a new practice folder and open it in a modern browser. No server, Node installation, or Internet access is needed. JavaScript is used because browser execution is this lesson's named topic.

Before the code:

- `const` names a value; `document.querySelector` selects a DOM element.
- `textContent` holds its text; `+=` appends.
- `log` is our line-display function; `() =>` creates a short callback function.
- `setTimeout` schedules eligibility for a later task. Zero is not immediate execution.
- `Promise.resolve()` creates a fulfilled promise; `then` queues its handler as a microtask rather than invoking it immediately within that statement.

~~~html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Event loop trace</title>
</head>
<body>
  <pre id="output"></pre>
  <script>
    const output = document.querySelector('#output');

    function log(message) {
      output.textContent += message + '\n';
    }

    log('A');
    setTimeout(() => log('D'), 0);
    Promise.resolve().then(() => log('C'));
    log('B');
  </script>
</body>
</html>
~~~

Expected output:

~~~text
A
B
C
D
~~~

| Point | Current work | Pending work | Text so far |
|---|---|---|---|
| log A | Initial script | Nothing from this example | A |
| setTimeout | Same script continues | Timer callback | A |
| then | Same script continues | Microtask C and timer D | A |
| log B | Script continues | C, then a later opportunity for D | A,B |
| Script ends | Run microtask C | D | A,B,C |
| Timer task gets a turn | Run D | Example complete | A,B,C,D |

Registering the timer before then does not put D before C. A fulfilled promise does not make C interrupt the script's next statement either. The order is defined for this example; **millisecond timing is not**.

## Delayed input and painting

Imagine a callback computing from time 0 until 80ms. A click or timer becoming ready at 10 does not automatically preempt it; it awaits an appropriate turn. Updating DOM text during that callback is not proof the user already saw new pixels.

These are illustrative times, not measurements. Do not run an unbounded busy loop. Measure before choosing shorter chunks, deferral, or a suitable worker; async does not automatically split arbitrary CPU computation. A **Web Worker** provides background execution for selected work and cannot directly modify the page DOM.

**Layout** calculates element positions and sizes. Alternating style changes and size reads in a loop can force repeated calculation, called **layout thrashing**. Batch reads and writes where suitable. A transform can reduce layout cost in some animations, not guarantee a speedup everywhere.

## Choose a measurement question

- **LCP, Largest Contentful Paint:** timing of the largest eligible content element appearing in the viewport, addressing visible loading.
- **INP, Interaction to Next Paint:** interaction responsiveness through a following display update; waiting, execution, and presentation matter, not only callback duration.
- **CLS, Cumulative Layout Shift:** unexpected layout movement; a fast network can still deliver a visually unstable page.

Use **DevTools**, browser developer tools, and the Performance panel to inspect long work and its timing. These metrics address different questions rather than sharing one universal fix.

## Why the second load can differ

A **redirect** starts a request for another address, not necessarily another connection. **Connection reuse** sends another request on an established connection. A **Service Worker** is a site-registered browser program that may intercept selected requests and serve saved content; it is not the page DOM script above.

The Network **waterfall** shows request timing stages. Compare first and second loads. Missing connection setup does not prove a cache HIT; a reused connection can still reach the server. Inspect response-source evidence and cache policy.

A **cookie** is browser-stored data sent with matching requests. **CORS** controls whether page scripts may read selected cross-origin responses, owned by [its lesson](/en/programming-basics/11-same-origin-cors/), not inferred from speed.

## Independent practice

1. Add `log('X');` immediately after log B. Predict all lines before reopening the file.
2. Replace the entire Promise statement with a direct `log('C');`. What changes?
3. Does a zero timer execute before the next statement? Does it always execute before painting?
4. Two independent classic async files are config and app; app needs config. Is tag order sufficient?
5. The second request has no connection phase. Does that prove a Service Worker served it?

<details>
<summary>Solution and acceptance checks</summary>

1. A,B,X,C,D. X is still part of the running script.
2. A,C,B,D. C is now a direct invocation, not a queued microtask.
3. Neither guarantee holds. Eligibility is not preemption or a fixed order against all rendering opportunities.
4. No. Follow readiness and execution; use appropriate deferred ordering or an explicit import dependency.
5. No; connection reuse is another explanation. Success identifies current and pending work, explains ordering, and separates network timing from interface execution.

</details>

## Summary and references

Separate file arrival, execution turns, and rendering opportunities. Continue to [the server-side request journey](/en/programming-basics/07-server-side-path/).

- [MDN: JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [WHATWG: event-loop processing](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)
- [MDN: script and async/defer](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)
