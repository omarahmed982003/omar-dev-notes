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
<div class="diagram-node input"><span>Decimal value</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Binary bits</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Bytes in memory</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>CPU instruction</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Displayable result</span></div>
</div>
</div>

## Bases and conversion

Decimal, binary, octal, and hexadecimal use positional powers of 10, 2, 8, and 16. Convert binary to decimal by summing active place values. Convert decimal to binary by repeated division or powers-of-two decomposition. One hex digit represents four bits, so grouping binary from the right gives a compact exact representation.

Hex appears in addresses, debuggers, byte viewers, colors, and bit masks. Octal still appears in areas such as Unix permissions.

## Hardware and memory hierarchy

Storage holds program files, RAM holds active pages, and the CPU fetches and executes instructions. Registers are smallest and fastest, followed by caches, RAM, and persistent storage. The motherboard connects components; the GPU handles graphics and suitable parallel work; power, cooling, network, input, and output devices support execution.

The operating system creates a process, maps memory, schedules CPU time, manages files and devices, and displays results. A stored executable is not a running process until the system loads and starts it.

## Positional value and manual conversion

In base `b`, each digit is multiplied by a power of `b`. Convert binary to decimal by summing set-bit positions. Convert a nonnegative decimal integer to another base by repeated division and reading remainders in reverse. Hexadecimal maps each digit to exactly four bits, which makes it useful for addresses and masks.

## Signed values and two's complement

For a fixed width, two's complement represents negative values so addition hardware can use the same circuit. Negating a bit pattern means invert the bits and add one. Width matters: an 8-bit demonstration does not describe the range of every C++ `int`.

## CPU, memory, storage, and process execution

Storage keeps files without power. RAM holds active program data. CPU registers are smaller and faster; the ALU performs arithmetic and logic, while the control unit coordinates instructions. The operating system loads an executable, creates a process and virtual address space, schedules threads, and provides controlled access to files and devices through system calls.

## Memory hierarchy

Registers, caches, RAM, and persistent storage trade capacity for latency. A value may exist at several levels during execution. Virtual memory maps process addresses to physical pages; a page fault asks the operating system to make a page available and is much slower than a cache miss.

## Hexadecimal and the nibble

One hexadecimal digit represents exactly four binary bits, called a nibble. That is why `0xAF` maps directly to `1010 1111`: `A` is 10 or `1010`, and `F` is 15 or `1111`. Hexadecimal is a compact notation for bit patterns; it does not change the stored value.

## Bits, bytes, words, and signed values

A bit has two states. A byte is the smallest addressable unit on typical systems and is normally eight bits. A machine word is the processor's natural working width and depends on the architecture. Do not infer a C++ type's exact range only from the machine being “64-bit”; use `sizeof` and `<limits>`, or fixed-width types when the exact width is part of the contract.

Signed integers are commonly represented with two's complement. For an `n`-bit signed value, the usual range is `-2^(n-1)` through `2^(n-1)-1`; the negative side has one extra value. This asymmetry matters when taking the absolute value of the minimum representable integer.

## From storage to a running process

An executable rests on persistent storage. The operating system loader maps its code and data into memory, prepares the process, and schedules its threads. The CPU fetches, decodes, and executes instructions; registers and caches hold nearby working data, RAM holds the active program state, and storage preserves files after power is removed. Faster levels are smaller and closer to the CPU, while slower levels are larger.

Input devices, displays, network adapters, and storage controllers communicate through operating-system drivers. They are not “inside the CPU”; the OS coordinates access and presents abstractions such as files, sockets, and processes.

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
