---
title: "Computers and operating systems for programmers"
description: "A short hardware introduction followed by software, operating systems, execution, memory, files, and developer tools."
sidebar:
  order: 0
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

When a program becomes slow, consumes memory, or cannot open a file, syntax knowledge alone cannot explain why. Follow what resources the program requests and how the operating system supplies them.

Start with hardware only as far as it serves programming, then follow software and execution. The introductory lesson explains source code, processes, runtimes, libraries, and frameworks before operating-system details.

## Learning order

- [Hardware components and motherboard architecture](/en/programming-basics/computer-in-depth/03-hardware-architecture/)
- [Software: from source code to a running program](/en/programming-basics/computer-in-depth/software-and-runtime/)
- [Operating-system architecture and types](/en/programming-basics/computer-in-depth/06-operating-systems/)
- [How a processor executes instructions](/en/programming-basics/computer-in-depth/04-cpu-gpu/)
- [Representing numbers and characters in memory](/en/programming-basics/computer-in-depth/03-binary-languages-algorithms/)
- [Images, audio, video, and size units](/en/programming-basics/computer-fundamentals/18-media-and-units/)
- [Addresses and virtual memory](/en/programming-basics/computer-in-depth/05-ram-memory-buffers/)
- [Allocation and the lifetime of data](/en/programming-basics/computer-in-depth/12-memory-allocation/)
- [Moving data and making writes durable](/en/programming-basics/computer-in-depth/13-buffers-and-durability/)
- [Read and write files from a terminal](/en/programming-basics/computer-in-depth/05-os-terminal-files-git/)
- [Command channels, permissions, and environment](/en/programming-basics/computer-in-depth/17-terminal-environment/)
- [When does parallel work help?](/en/programming-basics/computer-in-depth/15-parallel-work/)
- [From solution steps to running code](/en/programming-basics/computer-in-depth/14-running-code/)
- [Test behavior and locate a defect](/en/programming-basics/computer-in-depth/16-testing-and-debugging/)

## Required foundations and optional depth

The first pass aims to explain a program and its resources: hardware roles, software, processes and permissions, representation, memory and lifetime, files, terminals, and environment.

Connector details, page-translation arithmetic, cache coherence, and GPU parallelism are topic-owned depth, not prerequisites for first code. PHP experiments remain optional until language preparation; observation and paper tracing are valid alternatives.

## Part project: observe and explain a program

Produce an observation report rather than a new application. Choose a text editor and a new practice file. Do not terminate system processes, change permissions, or permanently change PATH.

1. Draw CPU, RAM, and storage roles during opening, saving, and closing.
2. Record two Task Manager CPU/memory observations and explain why no fixed number is required.
3. Read a practice file through relative and absolute paths, change the working directory, and explain the difference.
4. Display nonsensitive APP_ENV and identify permanence and inheritance limits.
5. Diagnose an unknown command or wrong file path from a message or paper case; do not break installations or change real-file permissions.
6. Draw writing layers and explain why “Saved” does not guarantee survival of every failure.
7. Repeat one observation independently and record expected, actual, and explanatory differences.

Evidence means causal explanations and observation limits, not screenshots alone. Assessment scores and progress remain private; reading the card does not automatically pass a checkpoint.

## Connect observations to explanations

Predict an example's output, run it, and change one input. For a file operation, identify the process, its identity, the path, and the expected result. For a delay, distinguish active computation from waiting.

After processes, memory, and resources, continue with [networks and the web](/en/programming-basics/networking-next/).
