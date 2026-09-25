---
title: "2. Computers, data, and the processing cycle"
description: "A connected model of a computer receiving data, processing it, producing output, and storing results across hardware and software layers."
tableOfContents: true
sidebar:
  order: 2
---

## A computer is a system, not one component

Hardware is the physical machinery, software is instructions plus data, and the operating system manages resources and exposes controlled interfaces to programs. A computer does not understand intent; it executes precise instructions over data represented as bits.

Distinguish raw **data**, interpreted **information**, a stored **program**, and a running **process** with memory, state, and resources.

## Input–Process–Output–Storage

1. **Input:** keyboard, file, network, camera, or sensor data.
2. **Process:** validation, conversion, calculation, and decisions.
3. **Output:** a display, file, network response, or control signal.
4. **Storage:** temporary memory or persistent SSD/HDD state.

The stages may overlap. A video player receives chunks, decodes them, fills a buffer, and displays frames while later chunks are still arriving.

<div class="lesson-diagram" role="img" aria-label="Computer data-processing cycle">
<p class="lesson-diagram-title">The data journey</p><div class="diagram-flow"><div class="diagram-node input"><span>Input</span></div><span class="diagram-arrow" aria-hidden="true">→</span><div class="diagram-node process"><span>Validation + Processing</span></div><span class="diagram-arrow" aria-hidden="true">→</span><div class="diagram-node output"><span>Output</span></div><span class="diagram-arrow" aria-hidden="true">↔</span><div class="diagram-node start"><span>Memory / Storage</span></div></div></div>

## Example: opening and editing an image

The app asks the OS for the file. The storage controller reads blocks into RAM, the program decodes the format using the CPU, and the GPU may render it. RAM holds active state and the display receives the result. Saving requires writing persistent storage and checking that the write succeeded; changing RAM alone is not enough.

## Where data lives

- **Registers and CPU caches:** immediately needed values and instructions.
- **RAM:** fast active workspace.
- **SSD/HDD:** larger persistent storage with higher access latency.
- **Network:** movement to another machine through agreed protocols.

This is the overview. Dedicated lessons explain CPU/GPU, memory, storage, and the operating system without duplicating their details here.

## Diagnose along the data path

Check whether input arrived in the expected format, which processing step changed it, whether internal output differs from presentation, whether persistence succeeded, whether a stale cache is being read, and whether disk or network work failed partially.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is an executable file on an SSD not yet a running program?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It contains stored instructions. The OS must create a process, map required pages and resources, and start execution.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Trace a voice message through IPO and storage.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The microphone supplies input; encoding and compression process it; sending and persistence are output/storage. The receiver accepts bytes, decodes them, and outputs audio.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>The calculation succeeds but the UI shows an old value. What do you inspect?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Inspect the write result, the UI data source, and every cache or buffer that may contain stale state.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>How do a program and a process differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A program is stored instructions. A process is a live execution with an address space, state, open resources, and scheduling context.</div></details></section>
</div>
