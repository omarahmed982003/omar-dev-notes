---
title: "Addresses and virtual memory"
description: "Addresses and virtual memory"
sidebar:
  order: 6
prev: {"link":"/en/programming-basics/computer-in-depth/15-parallel-work/","label":"When does parallel work help?"}
next: {"link":"/en/programming-basics/computer-in-depth/12-memory-allocation/","label":"Allocation and the lifetime of data"}
---

## Two addresses for the same data

A **virtual address** belongs to a program’s address space; a **physical address** identifies its corresponding memory location. Hardware and the system translate between them. With illustrative4096-byte pages, address5000 is page1, offset904. Mapping to frame7 gives `7×4096+904=29576`.

```text
Virtual: page 1 + offset 904 → page table: 1 maps to 7 → Physical: frame 7 + offset 904
```

A **page table** stores mappings; an **offset** locates a byte within a page. Real page sizes vary. **Try:**4096 has offset0;4095 belongs to page0 at offset4095.

## RAM and addresses

RAM (Random Access Memory, working memory for active program data and instructions) is fast volatile storage for active code and data. The CPU (Central Processing Unit, the main instruction-executing processor) reads addresses, usually through cache lines. The memory controller, channels, frequency, bandwidth, and latency all influence performance.

## Physical and virtual memory

Each process sees a private virtual address space. Memory is divided into pages; the MMU (Memory Management Unit, hardware translating memory addresses and enforcing access) translates virtual addresses to physical frames through page tables managed by the kernel. This provides isolation, demand loading, and controlled sharing.

A page fault can be a normal request to load a valid page. Swapping cold pages to storage is much slower than RAM, and thrashing occurs when the system spends more time moving pages than performing work.

## Trace an address and a growing queue

Assume 4096-byte pages and zero-based indexing. Virtual address 5000 is on page 1 at offset 904. If that page maps to physical frame 7, the illustrative physical address is 7×4096+904=29576. A **page** is a virtual-memory unit; a **frame** is its physical counterpart. Actual page sizes vary.

A **TLB (Translation Lookaside Buffer, a cache of memory-address translations)** caches translations. A TLB miss need not be a page fault because a valid page-table entry may exist. **Demand paging** prepares pages when needed. **Overcommit** can allow virtual reservations larger than immediately available backing; it does not promise every later write succeeds.





## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Is every page fault fatal?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> No. A valid page may simply need loading; an invalid access fails when the kernel cannot resolve it.</div></details></section>

<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why is swap not equivalent to more RAM?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Storage is far slower; swap may avoid immediate failure but can create severe latency and thrashing.</div></details></section>

</div>

## Next step


After completing this practice, continue with [Allocation and the lifetime of data](/en/programming-basics/computer-in-depth/12-memory-allocation/).



After completing this practice, continue with [Moving data and making writes durable](/en/programming-basics/computer-in-depth/13-buffers-and-durability/).
