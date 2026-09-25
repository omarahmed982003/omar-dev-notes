---
title: 6. Operating-system architecture and types
description: Kernels, user mode, system calls, processes, threads, scheduling, memory, filesystems, drivers, and operating-system categories.
sidebar:
  order: 6
---

## Kernel, operating system, and distribution

The kernel manages processors, memory, devices, isolation, and privileged operations. An operating system includes the kernel plus system services, libraries, tools, and user interfaces. Linux is a kernel; Ubuntu is a distribution combining it with packages and policy. Windows and macOS are complete systems with different kernels and surrounding components.

## User mode and kernel mode

Applications normally run with restricted privilege. A system call requests a file, socket, memory mapping, or another protected operation. The kernel validates arguments and permission before operating on resources. This boundary prevents ordinary code from directly reading another process or executing privileged instructions.

## Processes, threads, and scheduling

A process owns an address space, identity, and resource handles. Threads share process memory and files while retaining separate stacks and execution state. The scheduler assigns CPU time and performs context switches. Too many threads can increase switching and lock contention rather than speed.

Common states include ready, running, blocked, and terminated. A thread waiting for disk or network becomes blocked so another can use the CPU.

## Memory management

The kernel creates address spaces, maintains page tables, resolves page faults, manages shared mappings and swap, and applies protection bits. Out-of-memory policy determines what happens when allocation cannot be satisfied.

## Filesystems, I/O, and drivers

A filesystem maps names and metadata to stored blocks. Page cache accelerates access. Drivers operate hardware controllers, while interrupts or polling report events. Open resources are represented by descriptors or handles and must be closed through a clear ownership contract.

## Users, groups, and permissions

Processes run as identities with restricted privileges. A web service should not run as root or administrator, and a service account should access only required files and ports. Permissions remain one layer alongside secret protection and network isolation.

## Operating-system categories

- Desktop systems prioritize interactive applications.
- Server systems emphasize long-lived services, remote administration, and reliability.
- Mobile systems manage power, sensors, sandboxes, and controlled distribution.
- Embedded systems serve a focused device with constrained resources.
- Real-time systems provide predictable timing; missing a hard deadline is a failure.
- Hypervisors manage virtual machines directly on hardware or above a host OS.

Windows, Linux, and macOS share processes, virtual memory, files, and drivers but differ in APIs, architecture, tooling, filesystem conventions, packaging, and licensing. Selection follows workload and operations, not a universal winner.

## Starting a program

```text
Shell/GUI -> create process -> loader maps executable and libraries
          -> virtual memory, stack, and handles
          -> scheduler runs the first thread
          -> system calls access files, networks, and devices
```

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Are Linux and Ubuntu the same thing?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Linux is a kernel; Ubuntu is a distribution containing it with tools, packages, services, and policy.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why does an application need a system call?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> User-mode code cannot directly perform privileged resource and device operations; the kernel validates and performs them.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>What do threads in one process share?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> They share address space and resources such as files, while each keeps a stack and execution state.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>How does a server OS goal differ from a real-time OS goal?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A server emphasizes services, capacity, and reliability; real-time design emphasizes predictable timing bounds.</div></details></section>
</div>
