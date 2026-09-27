---
title: "Moving data and making writes durable"
description: "Moving data and making writes durable"
sidebar:
  order: 8
prev: {"link":"/en/programming-basics/computer-in-depth/12-memory-allocation/","label":"Allocation and the lifetime of data"}
next: {"link":"/en/programming-basics/computer-in-depth/06-operating-systems/","label":"Operating-system architecture and types"}
---

A program can produce data faster than a device consumes it. Understand waiting storage, then distinguish handing off a write from making it durable.

## Waiting data or a reusable copy?

A producer emits100 messages/second while a consumer handles60:40 accumulate per second. A **buffer** holds data in transit; a **queue** organizes waiting order. A **cache** retains a reusable, usually reproducible copy.

Ten seconds adds400 messages. **Backpressure** slows production in response to a slower consumer, or a bounded system rejects new work. After a write reaches a device, ask whether it survives power loss: **durability** is persistence under a specified failure guarantee.

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

A library `flush` may move bytes only into the kernel, which can retain them in page cache, while the device may have another cache. Power-loss durability requires an explicit filesystem or database contract. DMA (Direct Memory Access, device-memory transfer without the CPU copying every byte) transfers blocks without CPU copying each byte. Zero-copy techniques reduce intermediate copies but do not mean data never moves.


**Worked check:** A producer adds 100 messages per second and a consumer processes 60. The queue grows by 40 per second, or 400 after ten seconds. A size limit plus rejection or backpressure bounds growth; adding RAM only delays exhaustion. A flush can move data between buffers without guaranteeing power-loss durability.

<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>What is the essential buffer/cache difference?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A buffer holds data in transit; a cache retains a usually reproducible copy for speed.</div></details></section>

<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Why may flush not guarantee durability?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Data may remain in kernel or device caches; durable persistence needs an explicit sync and storage contract.</div></details></section>
