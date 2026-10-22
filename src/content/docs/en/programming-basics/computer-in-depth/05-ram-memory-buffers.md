---
title: "Addresses and virtual memory"
description: "Addresses and virtual memory"
sidebar:
  order: 7
prev: {"link":"/en/programming-basics/computer-fundamentals/18-media-and-units/","label":"Images, audio, video, and size units"}
next: {"link":"/en/programming-basics/computer-in-depth/12-memory-allocation/","label":"Allocation and the lifetime of data"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Required now: working memory is not a saved file

Opening a file in an editor leaves its saved copy on disk, while the program needs data it can use quickly. **RAM, working memory**, holds data and instructions during execution; its usual contents do not survive power loss.

You need the CPU's role and a **process**, a running program instance. Coding and memory-chip specifications are not prerequisites.

### How does a program see memory?

An **address** identifies a position in memory. An **address space** is the collection of addresses visible to a process.

**Virtual memory** lets a process use addresses whose mappings to actual memory the system manages. **Physical memory** is a real resource, not another name for a disk file.

| Process | Its virtual address | Example data |
|---|---|---|
| Editor A | 1000 | File A's text |
| Editor B | 1000 | File B's text |

Matching numbers do not establish shared data. The system interprets an address in its process context. This supports **isolation**: sharing needs explicit arrangements and permission, not guessing another process's address.

The table illustrates a relationship rather than measuring your device's addresses. Virtual memory is not extra RAM or a guarantee that arbitrarily large requests will succeed.

### Why can similar amounts of data involve different waits?

A **memory controller** coordinates access to RAM chips. **Bandwidth** measures data transferred per unit of time; **latency** measures waiting for one result.

Higher bandwidth does not automatically mean lower latency. The CPU often uses **caches**, nearby reusable copies, to reduce some waits. Their levels are explained in the [processor lesson](/en/programming-basics/computer-in-depth/04-cpu-gpu/).

### When available memory becomes tight

**Memory pressure** means requests compete heavily for available memory. The system may reclaim reloadable data or move some contents to storage.

**Swap** is storage used to move memory contents out temporarily under some policies. Typical storage access is much slower than RAM; adding swap does not offer the same performance as adding RAM.

**Thrashing** means spending excessive time moving memory contents instead of doing useful work. **OOM, out of memory**, may cause an allocation failure or process termination according to system policy.

Virtual memory is an addressing and management model; swap is one possible way of moving data to storage. They are not synonyms.

## A defined experiment: one process, not the whole device

On Windows we will read **WorkingSet64**: a process's resident working-set size in RAM, measured in **bytes**. It includes private and shared pages; it is not the opened file's size, device-wide memory usage, or every allocation the process has reserved.

A **PID, process identifier**, selects the instance being observed. If an application uses multiple processes, this reading covers only one PID. Adding their working sets does not make shared pages unique allocations.

### Prepare one safe reading

Open a text editor with a blank document. Find its name and PID in Task Manager's Details tab. Do not end processes or change memory settings or permissions.

Open PowerShell from Start. **Get-Process** reads process information; `-Id` selects its identifier. The `|` symbol passes the result to another command. **Select-Object** selects displayed properties: Id is the identifier and ProcessName the name.

Replace 2740 below with your editor's actual PID, then run this read-only command:

```powershell
Get-Process -Id 2740 | Select-Object Id, ProcessName, WorkingSet64
```

Expect a row with the name, identifier, and a numeric WorkingSet64 value. This property is displayed as raw bytes, unlike a default WS column that may use abbreviated units. Divide by 1048576 for MiB; for example, 16777216 bytes = 16 MiB.

If access is denied or the process exits, record the message and stop. Do not elevate PowerShell or substitute a system process. If command-line work is still unfamiliar, use the paper alternative below.

### Take three readings, then finish

Record the Windows/PowerShell versions, editor name/PID, counter name WorkingSet64, and unit bytes above your log. Record actual reading times; ten seconds organizes observation rather than guaranteeing a settled machine.

| Stage | WorkingSet64 in bytes | Observation |
|---|---|---|
| A: blank editor; wait 10 seconds, then read | Record value | Baseline for an existing process, not zero before it started |
| B: open a small practice file; wait 10 seconds, rerun the command | Record value | Same PID and counter |
| C: close the file or return to a blank document while keeping the editor open; wait 10 seconds, read | Record value | Rise, fall, or no change? What can you infer? |

**Finish after C**; this is not continuous monitoring. If closing the file ends the process, record “exited” and stop, not zero bytes. Do not continue with a new PID as though it were the same instance.

No fixed increase or return to baseline is required. Caches, shared pages, and system policies affect readings. Three changing values alone prove neither a leak nor that the file caused the entire difference.

### Safe alternative before terminal work or outside Windows

Use a paper trace without installing tools or changing settings. These are **hypothetical**, same-PID, same-counter values, not observations from your device:

| Stage | WorkingSet64 in bytes | Equivalent |
|---|---|---|
| A | 16777216 | 16 MiB |
| B | 20971520 | 20 MiB |
| C | 18874368 | 18 MiB |

B exceeds A by 4 MiB; C falls from B by 2 MiB but does not return to A. This proves neither a leak nor file deletion. The counter measures resident pages, not file lifetime.

If you later use another system monitor, record its actual counter name, unit, and definition rather than renaming every memory number WorkingSet64. Distinguish “the process has addresses” from “all its data is currently in RAM.”

## Check the foundation

1. Two processes both use virtual address 1000. Does that prove shared data?
2. Is virtual memory the same as swap?
3. If a program waits for storage-backed data with low CPU activity, is a faster CPU a guaranteed fix?
4. Does closing an editor delete its saved file?

<details>
<summary>Review after attempting</summary>

1. No. An address's meaning depends on its process and system-managed mapping.
2. No. The first is an addressing/management model; the second is storage the system may use for some data.
3. No. Investigate memory, storage, and workload rather than buying from one CPU counter.
4. No. Temporary execution state and the saved file are different.

</details>

If you can distinguish addresses, physical resources, and files, continue to [allocation and data lifetime](/en/programming-basics/computer-in-depth/12-memory-allocation/). The calculations below are optional, not prerequisites for first code.

## Optional depth: address translation and pages

Memory is managed in pieces rather than assuming one fully prepared contiguous physical allocation per process. These sections explain that model more closely.

<details>
<summary>Pages, frames, and the MMU: trace one address</summary>

A **page** is a unit of virtual address space. A **frame** is a physical-memory unit matching the page size in our model.

A **page table** records mapping and protection information. An **MMU, memory management unit**, provides hardware support for translation and access checking using system-managed tables.

An **offset** is a byte's position inside a page. Assume 4096-byte pages and zero-based numbering:

1. Address 5000 belongs to page 1.
2. Its offset is `5000 − 4096 = 904`.
3. If that page maps to frame 7, the illustrative physical address is `7 × 4096 + 904 = 29576`.

Page sizes and translation structures vary by system and architecture. A visible reservation need not immediately have physical pages backing all of it.

The **TLB, translation lookaside buffer**, caches recent address translations. Missing there does not necessarily cause a page fault: a valid page-table entry may still supply the mapping.

</details>

<details>
<summary>Page faults, sharing, and preparing resources on demand</summary>

A **page fault** requires system intervention when memory access cannot complete using the current translation or protection state. It is not always a crash.

The system may prepare a valid page as part of **demand paging**, supplying pages when needed. Alternatively, access may be forbidden and rejected or terminate the program.

A **memory-mapped file** associates a file region with addresses. **Shared memory** exposes an explicitly shared region to processes. Neither removes the need to coordinate updates.

**Overcommit** may permit some virtual reservations before all resources for their later use are available. Initial success does not promise every later access will succeed.

A **cache line** is a block transferred as a unit by a processor cache. It differs from a system-managed memory page even though both describe groups of bytes.

</details>

### Optional calculation

With 4096-byte pages and zero-based numbering, which page and offset contain address 4095? What about 4096?

<details>
<summary>Review the optional calculation</summary>

The first is in page 0 at offset 4095; the second is in page 1 at offset 0. A TLB miss alone does not establish that the page table lacks a mapping.

</details>

## Summary and reference

RAM is limited, addresses are a system-managed abstraction, and swap is not additional RAM with the same performance. The first goal is explaining those differences, waits, and pressure, not memorizing translation calculations.

- [Microsoft: virtual memory](https://learn.microsoft.com/en-us/windows/win32/memory/virtual-memory).

- [Microsoft: working-set meaning and limits](https://learn.microsoft.com/en-us/windows/win32/memory/working-set).
- [Microsoft: Get-Process property readings](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process).
- [Microsoft: WorkingSet64 returns a value in bytes](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.process.workingset64).
