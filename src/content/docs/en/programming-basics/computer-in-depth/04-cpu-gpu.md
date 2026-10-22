---
title: "How a processor executes instructions"
description: "How a processor executes instructions"
sidebar:
  order: 4
prev: {"link":"/en/programming-basics/computer-in-depth/06-operating-systems/","label":"Operating-system architecture and types"}
next: {"link":"/en/programming-basics/computer-in-depth/03-binary-languages-algorithms/","label":"Representing numbers and characters in memory"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Required now: trace 5 + 3

The **CPU, central processor**, executes program instructions. **RAM, working memory**, holds active instructions and data; it is not the component performing the addition.

Our imaginary program has two instructions: “put 5 in the working slot,” then “add 3 to it.” This is a paper model, not real machine syntax or a command to run.

### Where will the value live?

A **register** is a small, fast processor working location. Call ours R; we do not need to assume an initial value.

The **program counter** is a register that helps track the next instruction's location. Label our instructions A and B instead of using real addresses.

| Moment | R | Next instruction |
|---|---|---|
| Before starting | Unspecified | A: put 5 |
| After A | 5 | B: add 3 |
| After B | 8 | Whatever follows the program |

The table separates an **instruction** from **data**: “add 3” specifies work, while 5 is the value it operates on. Execution needs both.

### How does “add 3” happen?

**Fetch–Decode–Execute** names three responsibilities: obtaining an instruction, identifying its required operation, and carrying it out. Apply them to B while R contains 5:

1. **Fetch:** the processor obtains the instruction. The program counter helps track the execution location.
2. **Decode:** the **control unit** coordinates understanding and execution: add 3 to R.
3. **Execute:** the **ALU, Arithmetic Logic Unit**, performs the addition in our model, leaving 8 in the register.

Execution continues at the appropriate next instruction. Modern processors need not finish an entire instruction before preparing another, and a branch can change the execution path.

### Is the data near the processor?

A **cache** holds nearby copies to reduce repeated data waits. Every value need not come from RAM on every access.

| Location | Role in our example |
|---|---|
| Register | Holds the value used directly: 5, then 8 |
| CPU cache | May supply nearby copies of instructions or data |
| RAM | Holds parts of an active program's instructions and data |

**L1, L2, and L3** are common cache levels; their organization and sharing vary. The table does not require every read to visit every level in sequence.

### Why GHz alone is not a performance result

The processor **clock** provides a cycle rhythm. **GHz, gigahertz**, means a billion cycles per second, not a billion completed tasks or a requirement that each instruction takes one cycle.

Processors with different clock rates may complete different amounts of work in the same time because of instruction types, waits, internal organization, heat, and power. Waiting to obtain an instruction or value is different from doing the addition itself.

## Check the foundation first

1. R holds 5 and the instruction is “add 3.” What specifies the work, what holds the value, and what is the result?
2. Replacing “add 3” with “add 4” changes the instruction or the starting value?
3. Why might a higher-clocked processor still wait for data?
4. Is a cache a substitute for a saved disk file?

<details>
<summary>Review after attempting</summary>

1. The instruction specifies addition, the register holds 5, and the result is 8. The control unit coordinates execution and the ALU adds in our model.
2. The instruction changes. The starting value remains 5, so the result becomes 9.
3. Clock rate does not eliminate memory-access time or other resource waits.
4. No. It keeps copies to reduce waits, not a promise of file persistence after power loss.

</details>

If you can explain the journey, continue to [number and character representation](/en/programming-basics/computer-in-depth/03-binary-languages-algorithms/). The folded sections below are references, not prerequisites for a first program.

## Optional depth: what changes execution speed?

These sections explain names encountered while investigating performance. Open one when needed; do not memorize all of them on a first pass.

<details>
<summary>Cores, hardware threads, and work per cycle</summary>

A **core** has physical execution resources and can run an independent instruction stream. A **hardware thread** is an execution context sharing core resources, not a complete additional core.

**IPC, Instructions Per Cycle**, is the average number of instructions completed per cycle. Clock rate and IPC measure different things; memory behavior, code, heat, and power limits also matter.

Additional cores help when work can be divided. **Serial work** must proceed sequentially. A **lock** coordinates access to shared data and may make work wait.

**Amdahl's law** describes how the serial portion limits overall speedup. If half the original time cannot be divided, making the other half nearly instantaneous still leaves at least half the original time: a theoretical maximum speedup of two, before coordination overhead.

</details>

<details>
<summary>Cache levels and nearby access</summary>

Registers are among a core's smallest and fastest working locations. L1 is typically small and very fast, L2 larger, and L3 larger again and often shared across cores. This is a common pattern, not every processor's exact layout.

A **cache line** is a block transferred as a unit rather than an individual byte. **Locality** means using nearby data spatially or reusing it soon in time.

Reading adjacent elements may reuse the same blocks. A **cache miss** means the requested data is absent from the level being checked; another level or RAM may supply it. Scattered access may increase misses and waits depending on data size and access pattern.

**Cache coherence** coordinates copies across cores. It does not make “read, increment, write” one indivisible action.

An **atomic operation** guarantees that a partially interleaved execution is not exposed under the tool's contract. Coherence does not replace locks or atomic operations needed for correct shared-state updates.

A cache is not generally extra RAM directly managed by the application, nor a guarantee that writes immediately reach persistent storage.

</details>

<details>
<summary>Overlapping instructions, prediction, and other operation types</summary>

**Pipelining** overlaps instruction stages. A **branch** chooses an instruction path, such as taking different paths according to a condition.

**Branch prediction** prepares a likely path before its condition is known. **Out-of-order execution** performs ready operations in a different internal order while preserving required results.

Execution units do more than integer addition. **Floating point** represents fractional values with finite precision. A **vector** groups values that may undergo similar operations.

**SIMD, Single Instruction Multiple Data**, applies an instruction to several elements. That differs from multiple cores running independent instruction streams.

CPU/GPU selection, transfer costs, branch divergence, and unified memory are collected in [concurrent and parallel work](/en/programming-basics/computer-in-depth/15-parallel-work/), with definitions in their usage context.

</details>

<details>
<summary>A worked measurement-reading example, not a device benchmark</summary>

A **warm-up** is a preliminary run intended to reduce some startup effects. Assume five durations for the same task under the same conditions: 9, 10, 10, 11, and 30 milliseconds. These are teaching numbers, not measurements of the reader's device.

The **median** is the middle value after sorting: 10. The **arithmetic mean** is the sum divided by the count: 14.

Their difference highlights variation or an outlying value. Do not discard 30 without explanation; record input size, transfer costs, temperatures, and execution conditions rather than relying on one number.

</details>

### Optional-depth question

Why do more cores or improved caches not promise a fixed speedup?

<details>
<summary>Review the optional question</summary>

Most work may be serial, the data may not benefit from caching, or waiting, coordination, and transfers may consume the gain. Measure the actual workload; GHz and core counts alone are insufficient.

</details>

## Summary and next step

The required foundation is to explain how a processor fetches, understands, and executes instructions on data, and how registers, caches, and RAM differ. Designing processors or memorizing their optimizations is not a prerequisite for writing a program.

Next, study [representing numbers and characters in memory](/en/programming-basics/computer-in-depth/03-binary-languages-algorithms/).
