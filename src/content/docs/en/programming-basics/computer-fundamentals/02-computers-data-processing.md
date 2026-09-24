---
title: "Computers, data, and the processing cycle"
description: "A computer receives data, executes instructions, produces results, and may store them. This cycle connects software to memory, the processor, storage, and input/output devices."
tableOfContents: true
---

## Overview

A computer receives data, executes instructions, produces results, and may store them. This cycle connects software to memory, the processor, storage, and input/output devices.

## Core concepts

- Data is raw fact; information is organized data; knowledge is the ability to use it.
- Hardware is physical equipment; software is the instructions controlling it.
- A program is stored instructions, while a process is a running instance.
- RAM is fast and temporary; storage is persistent and usually slower.
- The IPO model describes inputs, processing, outputs, and optional storage.

## Worked example

When a message is sent, the keyboard supplies input, the app processes and encodes it, the network carries it, and the receiver displays and may store it.

## Corrections and common mistakes

- A CPU does not infer intent; it executes precise instructions.
- A file on disk becomes a running process only after loading and execution.

## The fetch-decode-execute cycle

The processor repeatedly fetches an instruction from memory, decodes its operation and operands, then executes it and updates registers or memory. Modern CPUs add pipelines, caches, parallel execution, and branch prediction, but this model explains why a running program needs instructions, data, and execution state.

## The memory hierarchy

| Level | Relative speed | Capacity | Main use |
|---|---|---|---|
| Registers | Highest | Tiny | Values used by execution units now |
| CPU cache | Very high | Small | Nearby copies of frequently used data and instructions |
| RAM | High | Medium | Active programs and data |
| SSD/HDD | Lower | Large | Files and installed programs |

Data that stays closer to the CPU is cheaper to access. Data layout and access patterns can therefore affect performance even when two solutions execute a similar number of operations.

## What happens when a program opens?

The operating system checks the executable and permissions, creates a process and virtual address space, loads the required pages, and starts execution at the entry point. Its scheduler shares CPU time between processes while device drivers handle displays, storage, and networks.

<div class="lesson-diagram" role="img" aria-label="The computer data-processing cycle">
<p class="lesson-diagram-title">The computer data-processing cycle</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Data input</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>CPU/RAM processing</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Result output</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node start"><span>Optional storage</span></div>
</div>
</div>

## CPU execution, memory, processes, and threads

Registers hold the values currently used by the CPU. The ALU performs arithmetic and logic, while the control unit coordinates instruction fetch, decode, and execution. Clock rate alone does not compare processors; architecture, cache, cores, and work per cycle also matter.

The stack commonly holds function calls and short-lived local state, while the heap supports dynamic allocation. Virtual memory gives each process an address space divided into pages. A page fault occurs when a required mapping must be created or loaded.

A process owns resources and an address space. Threads within a process share much of that state but keep their own execution stacks. The scheduler switches CPU time between them. Unsynchronized access to shared state can create a race condition.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>How does a program differ from a process, and when can one program have several processes?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A program is stored instructions; a process is a running instance with state and memory. Multiple launches or workers can create several processes from one program.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Trace sending a photo and identify data, information, and knowledge.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Bytes are data, the rendered photo with sender context is information, and deciding whether it is trustworthy or actionable is knowledge.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Why is persistent storage not a substitute for RAM?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Storage favors persistence and capacity but is slower. RAM is the fast working area into which the OS loads active code and data.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Inputs are correct but output is wrong. Where do you start in the IPO model?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Inspect processing steps and intermediate state, then confirm the output uses the current value and the intended formatting.</div></details>
</section>
</div>

## Summary

Connect the idea to its inputs and outcomes, then test normal, boundary, and invalid cases. Explanation and application matter more than memorized wording.
