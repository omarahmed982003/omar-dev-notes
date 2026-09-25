---
title: 5. RAM, virtual memory, and buffers
description: Physical and virtual memory, stack and heap, paging, allocation, buffers, caches, queues, DMA, and durability.
sidebar:
  order: 5
---

## RAM and addresses

RAM is fast volatile storage for active code and data. The CPU reads addresses, usually through cache lines. The memory controller, channels, frequency, bandwidth, and latency all influence performance.

## Physical and virtual memory

Each process sees a private virtual address space. Memory is divided into pages; the MMU translates virtual addresses to physical frames through page tables managed by the kernel. This provides isolation, demand loading, and controlled sharing.

A page fault can be a normal request to load a valid page. Swapping cold pages to storage is much slower than RAM, and thrashing occurs when the system spends more time moving pages than performing work.

## Stack and heap

Stack frames normally hold call state and local values and disappear as calls return. The heap supports dynamically lived objects. Deep recursion can overflow a stack; heaps can suffer retention leaks, fragmentation, or out-of-memory failure. These are virtual address regions, not separate RAM chips.

## Allocation, leaks, fragmentation, and OOM

An allocator manages blocks and reuses freed space. A leak keeps memory reachable or allocated after it is no longer useful. Fragmentation leaves unusable gaps or overhead. Observe resident and peak memory, not only theoretical object size. Garbage collection cannot correct an intentionally retained unbounded cache.

## Buffer, cache, queue, stream, and pool

| Concept | Purpose |
|---|---|
| Buffer | Absorb rate differences or batch transfer |
| Cache | Keep a reproducible copy to avoid repeated work |
| Queue | Order work waiting for consumption |
| Stream | Sequential flow whose final size may be unknown |
| Pool | Reusable prepared resources |

A cache can normally be dropped and rebuilt; unsent buffered data may be unique and must not be discarded.

## Common buffers

Input buffers collect events. File buffers reduce small system calls. Socket send and receive buffers decouple network and application rates. `stdout` may be line-buffered on a terminal and fully buffered when redirected. Ring buffers reuse fixed storage; double buffering prepares one frame while another is displayed.

A buffer overflow writes beyond a boundary in an unsafe environment. Media underflow means consumption outran production. Backpressure prevents an unbounded producer from filling memory.

## Flush, DMA, and zero-copy

A library `flush` may move bytes only into the kernel, which can retain them in page cache, while the device may have another cache. Power-loss durability requires an explicit filesystem or database contract. DMA transfers blocks without CPU copying each byte. Zero-copy techniques reduce intermediate copies but do not mean data never moves.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Is every page fault fatal?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> No. A valid page may simply need loading; an invalid access fails when the kernel cannot resolve it.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>What is the essential buffer/cache difference?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A buffer holds data in transit; a cache retains a usually reproducible copy for speed.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why is swap not equivalent to more RAM?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Storage is far slower; swap may avoid immediate failure but can create severe latency and thrashing.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why may flush not guarantee durability?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Data may remain in kernel or device caches; durable persistence needs an explicit sync and storage contract.</div></details></section>
</div>
