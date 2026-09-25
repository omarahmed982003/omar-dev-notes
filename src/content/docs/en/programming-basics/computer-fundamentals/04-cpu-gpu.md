---
title: 4. CPU, GPU, and parallel processing
description: CPU execution, cores and hardware threads, cache hierarchy, and why GPUs have a different architecture and workload.
sidebar:
  order: 4
---

## Inside a CPU

The processor fetches, decodes, and executes instructions. A program counter identifies the next instruction, the control unit coordinates it, the ALU performs arithmetic and logic, and registers hold values closest to execution. Other units handle floating point, vectors, branches, and memory access.

Modern CPUs pipeline instructions, predict branches, and execute independent work out of order. “One instruction per clock” is therefore an oversimplification, and GHz alone cannot predict performance.

## Cores, threads, clock, and IPC

A core can execute an independent instruction stream. A hardware thread shares some core resources; it is not a complete additional core. Clock rate counts cycles, while IPC measures useful instructions completed per cycle. Memory behavior, architecture, heat, and power limits matter as well.

More cores help only when work can be divided. Serial sections and shared locks limit speedup.

## Registers and L1/L2/L3 caches

Registers are the smallest and fastest storage. L1 is tiny and very fast, L2 is larger, and L3 is larger again and often shared. Caches move cache lines, so contiguous access benefits from locality while random access causes more misses and RAM waits.

Cache coherence does not replace locks or atomic operations when threads mutate shared state.

## Why a GPU is different

A CPU has fewer powerful cores optimized for low latency, branching, and general-purpose work. A GPU contains many simpler execution units designed to apply similar operations to large data sets. It excels at rendering, matrix work, machine learning, and scientific computation.

Irregular branching and repeated small transfers can erase the advantage. A discrete GPU normally has separate VRAM; copying data, launching a kernel, and returning results all cost time.

## Integrated and discrete GPUs

An integrated GPU usually shares system memory and power. A discrete GPU has its own VRAM, power budget, and cooling. Unified-memory APIs simplify programming but do not guarantee that physical data movement disappears.

## Workload comparison

| Workload | Typical choice | Reason |
|---|---|---|
| Web request and business rules | CPU | Branching, I/O, and latency |
| Small compression task | CPU | GPU transfer cost dominates |
| Large matrix multiplication | GPU | High data parallelism |
| Rendering millions of pixels | GPU | Similar operation over many values |
| Database transaction | CPU | Control, memory, and I/O heavy |

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why can a 3.5GHz CPU outperform a 4GHz CPU?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> IPC, architecture, caches, core count, power limits, and workload all affect completed work.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>How does a hardware thread differ from a core?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A thread shares execution resources within a core; it is not another complete physical core.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>When is a GPU a poor choice?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> For small, serial, heavily branching work or when data-transfer cost exceeds computation.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>How does locality improve speed?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Nearby access reuses cache lines; scattered access creates misses and waits for RAM.</div></details></section>
</div>
