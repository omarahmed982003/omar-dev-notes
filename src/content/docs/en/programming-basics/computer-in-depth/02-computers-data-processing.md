---
title: "Computers, data, and the processing cycle"
description: "A connected model of a computer receiving data, processing it, producing output, and storing results across hardware and software layers."
tableOfContents: true
sidebar:
  order: 2
prev: {"link":"/en/programming-basics/computer-in-depth/01-learning-roadmap/","label":"Learning roadmap and study rules"}
next: {"link":"/en/programming-basics/computer-in-depth/03-hardware-architecture/","label":"Hardware components and motherboard architecture"}
---

## Open and follow an image

```text
File on storage → Read into RAM → Decode image → Prepare pixels → Display
```

A file contains bytes, groups of eight bits. Reading brings data into working memory. **Image decoding** converts a format such as PNG into color values usable for display. Arrows show a simplified work sequence; actual stages can overlap.

**Before the details:** If the file is missing, is pixel color the issue? No: reading failed first. Place interrupts and transfers within this journey rather than memorizing isolated names.

## A computer is a system, not one component

Hardware is the physical machinery, software is instructions plus data, and the operating system manages resources and exposes controlled interfaces to programs. A computer does not understand intent; it executes precise instructions over data represented as bits.

Distinguish raw **data**, interpreted **information**, a stored **program**, and a running **process** with memory, state, and resources.

## Input–Process–Output–Storage

1. **Input:** keyboard, file, network, camera, or sensor data.
2. **Process:** validation, conversion, calculation, and decisions.
3. **Output:** a display, file, network response, or control signal.
4. **Storage:** temporary memory or persistent SSD (Solid-State Drive, electronic storage without moving mechanical parts)/HDD (Hard Disk Drive, storage using rotating magnetic disks) state.

The stages may overlap. A video player receives chunks, decodes them, fills a buffer, and displays frames while later chunks are still arriving.

<div class="lesson-diagram" role="img" aria-label="Computer data-processing cycle">
<p class="lesson-diagram-title">The data journey</p><div class="diagram-flow diagram-pipeline"><div class="diagram-node input"><span>Input</span></div><span class="diagram-arrow" aria-hidden="true">→</span><div class="diagram-node process"><span>Validation + Processing</span></div><span class="diagram-arrow" aria-hidden="true">→</span><div class="diagram-node output"><span>Output</span></div><span class="diagram-arrow" aria-hidden="true">↔</span><div class="diagram-node start"><span>Memory / Storage</span></div></div></div>

## Example: opening and editing an image

The app asks the OS for the file. The storage controller reads blocks into RAM (Random Access Memory, working memory for active program data and instructions), the program decodes the format using the CPU (Central Processing Unit, the main instruction-executing processor), and the GPU (Graphics Processing Unit, a processor suited to many similar operations across data) may render it. RAM holds active state and the display receives the result. Saving requires writing persistent storage and checking that the write succeeded; changing RAM alone is not enough.

## Where data lives

- **Registers and CPU caches:** immediately needed values and instructions.
- **RAM:** fast active workspace.
- **SSD/HDD:** larger persistent storage with higher access latency.
- **Network:** movement to another machine through agreed protocols.

This is the overview. Dedicated lessons explain CPU/GPU, memory, storage, and the operating system without duplicating their details here.

## Diagnose along the data path

Check whether input arrived in the expected format, which processing step changed it, whether internal output differs from presentation, whether persistence succeeded, whether a stale cache is being read, and whether disk or network work failed partially.

## Measure the relevant question

**Latency** is one operation's delay; **throughput** is work or data per unit of time. Many small files can be dominated by per-file setup, while a large sequential file can be dominated by transfer rate.

An **interrupt** notifies the processor instead of continuous **polling**, repeatedly asking for status. **DMA (Direct Memory Access, device-memory transfer without the CPU copying every byte)** transfers data without the CPU copying every byte, while still requiring setup and coordination.

**Worked check:** One thousand 1 kB files and one 1 MB file contain the same million bytes but need different numbers of file-open operations. Measure elapsed time, operations, and throughput rather than blaming CPU speed. kB=1000 bytes, KiB=1024, MB=1000000, and MiB=1048576.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is an executable file on an SSD not yet a running program?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It contains stored instructions. The OS must create a process, map required pages and resources, and start execution.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Trace a voice message through IPO and storage.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The microphone supplies input; encoding and compression process it; sending and persistence are output/storage. The receiver accepts bytes, decodes them, and outputs audio.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>The calculation succeeds but the UI shows an old value. What do you inspect?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Inspect the write result, the UI data source, and every cache or buffer that may contain stale state.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>How do a program and a process differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A program is stored instructions. A process is a live execution with an address space, state, open resources, and scheduling context.</div></details></section>
</div>
