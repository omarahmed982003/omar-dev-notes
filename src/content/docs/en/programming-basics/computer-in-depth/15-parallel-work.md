---
title: "When does parallel work help?"
description: "When does parallel work help?"
sidebar:
  order: 12
prev: {"link":"/en/programming-basics/computer-in-depth/17-terminal-environment/","label":"Command channels, permissions, and environment"}
next: {"link":"/en/programming-basics/computer-in-depth/14-running-code/","label":"From solution steps to running code"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Many tasks: are they really executing together?

Imagine one program reading a file while another calculates a report. The first may be waiting for storage while the second uses the processor. Having both open does not prove simultaneous instruction execution.

From [operating systems](/en/programming-basics/computer-in-depth/06-operating-systems/), recall that a **process** is a running program with resources, and a **thread** is an instruction-execution path within a process.

## Concurrency versus parallelism

**Concurrency** means tasks have overlapping lifetimes and can progress through switching or while another task waits. A single core can support it.

**Parallelism** means portions of work actually execute at the same time on multiple execution resources. A **core** is an execution unit within a processor; open windows do not count active cores.

One core executing a piece of A, then B, then A gives interleaving. Two cores simultaneously executing separate pieces give actual parallel execution for those pieces.

An **asynchronous** interface permits other work instead of blocking until an operation finishes. It does not promise a new thread or prove parallelism; inspect the implementation.

## Waiting versus calculating

**I/O**, or input/output, means reading, writing, or communicating with a device. **I/O-bound** work spends most of its time waiting for that resource.

**CPU-bound** work spends its main time executing processor instructions. Measure the limiting resource rather than guessing from the application's name.

A page request waiting for storage may benefit from serving another request during the wait. A long independent calculation may benefit from distributing pieces across cores, provided coordination costs less than the gain.

## Shared data needs an agreement

A **race condition** is a fault whose outcome depends on overlapping timing. If two tasks both read counter 0 and each writes 1, two increments leave 1 rather than 2.

A **lock** controls entry to a conflicting operation. Locks cost time and can introduce waits. **Deadlock** means tasks wait for resources held by each other, as discussed in the operating-system lesson.

Cache coherence—coordination of cached copies between cores—does not make “read, increment, write” indivisible. An **atomic operation** provides an indivisibility guarantee defined by its interface.

### Serial work limits speedup

**Amdahl's law** relates maximum speedup to the portion that cannot be distributed. If half the original time must remain serial, making the other half nearly instantaneous cannot exceed twice the overall speed, even before coordination costs.

Splitting work into a thousand tasks therefore does not promise a thousand-fold improvement.

## CPU and GPU fit different workloads

The **CPU**, a general-purpose processor, suits varied steps, branches, and short response times. **Latency** is the wait for one result; **throughput** is completed work per unit time.

A **GPU**, a graphics processor, specializes in many similar operations over multiple data elements, such as image pixels and matrix calculations. Suitable machine-learning and scientific workloads also benefit.

**Data parallelism** applies similar operations to multiple data portions. A **GPU kernel** is a function launched across a collection of work; it is not an operating-system kernel.

**Branch divergence** occurs when work in a group selects different execution paths, potentially reducing utilization. Small repeated data transfers can also consume the computation benefit.

| Work | Initial candidate | Reason to test |
|---|---|---|
| Web requests and business rules | CPU | Branches, waiting, response time |
| Compressing a small file | Usually CPU | GPU transfer and setup may cost more than the calculation |
| Huge matrix products | GPU may help | Many similar calculations |
| Rendering millions of pixels, or image points | GPU | Repeated work over large data |
| Database transactions | Usually CPU | Coordination, memory, and I/O rather than arithmetic alone |

### GPU memory still costs time

An **integrated GPU** commonly shares system memory and power budget. A **discrete GPU** usually has dedicated **VRAM**, or graphics memory. Category alone does not determine performance.

**Unified memory** can simplify the programming interface without eliminating physical data movement or its cost. With separate memory, transfer to the device and return of results belong in the timing.

Hypothetical example, not a benchmark: CPU calculation takes four milliseconds. GPU calculation takes one, but setup and transfer take six, totaling seven. Faster computation alone does not guarantee a faster complete operation.

## Independent practice

1. One core switches between two programs: concurrency or actual parallel execution?
2. A task mostly waits for storage. Is a GHz upgrade a sufficient diagnosis?
3. Why can a shared counter lose an increment despite two cores?
4. Choose between four and one-plus-six milliseconds and explain.

<details>
<summary>Review after attempting</summary>

1. Concurrency, not necessarily parallel execution.
2. No. Clock frequency does not fix waiting on another resource.
3. The compound increment requires suitable coordination or an atomic guarantee.
4. CPU wins the complete example: four is less than seven. Measurement and data size can change the decision.

</details>

## Summary

Separate overlapping tasks from simultaneous execution. Measure waiting, computation, and transfer before choosing cores or GPUs. Implementing concurrent programs belongs after language foundations.

## Further reading

[NVIDIA's CUDA execution and data-transfer model](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)
