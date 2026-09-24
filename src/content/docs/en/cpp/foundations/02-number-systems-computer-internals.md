---
title: "2. Number systems, computers, and memory"
sidebar:
  order: 2
description: "Number systems explain how values are represented; computer architecture explains where a program lives and how it moves from storage to execution."
tableOfContents: true
---

## Values and numeral systems

Number systems explain how values are represented; computer architecture explains where a program lives and how it moves from storage to execution.

## Binary, octal, decimal, and hexadecimal

- Decimal uses base 10, binary 2, octal 8, and hexadecimal 16.
- A positional digit contributes digit × base^position.
- One hexadecimal digit represents four bits.
- The CPU executes instructions, RAM holds active state, and cache reduces repeated-access latency.
- The OS loads a program from storage into memory and creates a process.

## Example: one value in three bases

```text
45₁₀ = 32 + 8 + 4 + 1 = 101101₂ = 2D₁₆
```

## RAM, storage, and representation mistakes

- RAM is not persistent storage.
- Conversion changes representation, not the value.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: Number systems and computer internals">
<p class="lesson-diagram-title">Concept map: Number systems and computer internals</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Value and base</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Binary and hex</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Example</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Corrections and common mistakes</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Number systems explain how values are represented; computer architecture</span></div>
</div>
</div>

## Bases and conversion

Decimal, binary, octal, and hexadecimal use positional powers of 10, 2, 8, and 16. Convert binary to decimal by summing active place values. Convert decimal to binary by repeated division or powers-of-two decomposition. One hex digit represents four bits, so grouping binary from the right gives a compact exact representation.

Hex appears in addresses, debuggers, byte viewers, colors, and bit masks. Octal still appears in areas such as Unix permissions.

## Hardware and memory hierarchy

Storage holds program files, RAM holds active pages, and the CPU fetches and executes instructions. Registers are smallest and fastest, followed by caches, RAM, and persistent storage. The motherboard connects components; the GPU handles graphics and suitable parallel work; power, cooling, network, input, and output devices support execution.

The operating system creates a process, maps memory, schedules CPU time, manages files and devices, and displays results. A stored executable is not a running process until the system loads and starts it.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Convert 0x2D to decimal and binary.</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> 2D is 2×16+13 = 45; each hex digit is four bits, so it becomes 0010 1101.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Why is hexadecimal common for addresses and colors?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It is much shorter than binary while mapping exactly to groups of four bits.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>What roughly happens when a program is opened from an SSD?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The OS loads needed code/data into RAM, creates a process, and the CPU fetches instructions with cache assistance.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Does adding RAM make the CPU itself faster?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> No, but it can reduce slow storage paging under memory pressure and improve overall throughput.</div></details>
</section>
</div>
