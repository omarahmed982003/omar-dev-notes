---
title: 8. How browsers render a page
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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: How browsers render a page">
<p class="lesson-diagram-title">Concept map: How browsers render a page</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>From a response to pixels</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>JavaScript loading</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Event loop and responsiveness</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>DevTools workflow</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “From a response to pixels” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> DOM represents elements and content. CSSOM contains parsed style rules. Layout calculates geometry. Paint draws text, color, and borders. Composite assembles layers into the final frame. Render-critical CSS can delay paint. A classic script can pause HTML parsing while it downloads and executes. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “From a response to pixels” with “JavaScript loading”. Why does neither replace the other in “How browsers render a page”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “From a response to pixels”: DOM represents elements and content. CSSOM contains parsed style rules. Layout calculates geometry. Paint draws text, color, and borders. Composite assembles layers into the final frame. Render-critical CSS can delay paint. A classic script can pause HTML parsing while it downloads and executes. For “JavaScript loading”: defer preserves order and runs after DOM parsing. Modules are deferred by default. async runs as soon as it is ready and does not preserve ordering between independent scripts. Repeated layout reads and writes can cause layout thrashing. Batch reads and writes, and prefer compositor-friendly properties such as transform where appropriate. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Event loop and responsiveness”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Long JavaScript tasks block input and rendering. Inspect Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift, and main-thread long tasks. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “DevTools workflow” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Use Network with cache disabled for controlled tests. Inspect DNS, connection, TLS, TTFB, and download phases. Check headers, transferred size, and protocol. Use Performance for tasks, layout, and paint. Use Elements for DOM and computed styles. :::tip A high TTFB may come from the network, CDN, PHP, or the database. Correlate browser traces with server logs and profiling. ::: Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
