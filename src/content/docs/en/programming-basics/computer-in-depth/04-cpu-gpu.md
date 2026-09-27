---
title: "How a processor executes instructions"
description: "How a processor executes instructions"
sidebar:
  order: 4
prev: {"link":"/en/programming-basics/computer-in-depth/03-hardware-architecture/","label":"Hardware components and motherboard architecture"}
next: {"link":"/en/programming-basics/computer-in-depth/15-parallel-work/","label":"When does parallel work help?"}
---

## Two instructions, then data location

Imagine two simplified instructions: put 5 in a processor working slot, then add 3 to it. The slot is a **register**. The processor fetches an instruction, decodes its required operation, and executes it. Results are 5, then 8. This is a teaching model, not a specific machine syntax.

```text
CPU registers ↔ L1 cache ↔ L2 cache ↔ L3 cache ↔ RAM
```

A **cache** keeps nearby copies to reduce repeated data waits. L1/L2/L3 are levels in a common simplified hierarchy; organization and sharing vary. Arrows represent requests/transfers, not a requirement that every read visits every level. Learn this picture before parallelism and prediction details.

## Inside a CPU

The processor fetches, decodes, and executes instructions. A program counter identifies the next instruction, the control unit coordinates it, the ALU (Arithmetic Logic Unit, the processor's arithmetic and logical operation unit) performs arithmetic and logic, and registers hold values closest to execution. Other units handle floating point, vectors, branches, and memory access.

Modern CPUs pipeline instructions, predict branches, and execute independent work out of order. “One instruction per clock” is therefore an oversimplification, and GHz (gigahertz, a billion cycles per second, not a count of completed instructions) alone cannot predict performance.

## Cores, threads, clock, and IPC

A core can execute an independent instruction stream. A hardware thread shares some core resources; it is not a complete additional core. Clock rate counts cycles, while IPC (Instructions Per Cycle, average instructions completed per processor cycle) measures useful instructions completed per cycle. Memory behavior, architecture, heat, and power limits matter as well.

More cores help only when work can be divided. Serial sections and shared locks limit speedup.

## Registers and L1/L2/L3 caches

Registers are the smallest and fastest storage. L1 is tiny and very fast, L2 is larger, and L3 is larger again and often shared. Caches move cache lines, so contiguous access benefits from locality while random access causes more misses and RAM (Random Access Memory, working memory for active program data and instructions) waits.

Cache coherence does not replace locks or atomic operations when threads mutate shared state.

## Execution terms and a measurement exercise

**Fetch–Decode–Execute** means fetching an instruction, identifying its operation and operands, and performing it. **Floating point** represents fractional values with limited precision; a **vector** groups values; a **branch** selects an instruction path; **serial** work must proceed sequentially.

**SIMD (Single Instruction Multiple Data, applying an instruction to multiple data elements)** applies one instruction to several data elements, unlike multiple cores running independent instruction streams. A GPU **kernel** is a compute program, not an OS kernel. **Branch divergence** makes grouped work take differing paths and can reduce efficiency. **Unified memory** simplifies the programming view but does not always eliminate physical transfers.

If 50% of a program's time cannot be parallelized, infinitely accelerating the other half leaves at least 50% of the original time: maximum speedup is two. This illustrates **Amdahl's law**.

**Worked measurement:** After warm-up, record 9,10,10,11,30 milliseconds under the same conditions. The median is 10; the mean is 14. Do not discard 30 without investigating. Record input size and transfer costs as well.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why can a 3.5GHz CPU outperform a 4GHz CPU?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> IPC, architecture, caches, core count, power limits, and workload all affect completed work.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>How does a hardware thread differ from a core?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A thread shares execution resources within a core; it is not another complete physical core.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>When is a GPU a poor choice?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> For small, serial, heavily branching work or when data-transfer cost exceeds computation.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>How does locality improve speed?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Nearby access reuses cache lines; scattered access creates misses and waits for RAM.</div></details></section>
</div>

## Next step

After completing this practice, continue with [When does parallel work help?](/en/programming-basics/computer-in-depth/15-parallel-work/).
