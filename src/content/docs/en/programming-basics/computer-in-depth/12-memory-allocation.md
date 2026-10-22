---
title: "Allocation and the lifetime of data"
description: "Allocation and the lifetime of data"
sidebar:
  order: 8
prev: {"link":"/en/programming-basics/computer-in-depth/05-ram-memory-buffers/","label":"Addresses and virtual memory"}
next: {"link":"/en/programming-basics/computer-in-depth/13-buffers-and-durability/","label":"Moving data and making writes durable"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Location and lifetime are different

An order program may discard a temporary calculation while retaining its order list. **Allocation** supplies memory for data; **lifetime** is the period in which the data remains valid for use.

From the [RAM lesson](/en/programming-basics/computer-in-depth/05-ram-memory-buffers/), distinguish a process's **address space** from physical RAM. Reserving space does not promise that every page immediately resides in RAM.

## Stack and heap are organizations, not separate chips

A **function** performs a task and may accept inputs and return a result. A **call** begins its execution; a **return** finishes it and resumes the caller at the appropriate place.

A **stack** follows last-in, first-out organization. When tracing calls, the most recent call returns before its caller. A **stack frame** records information for a particular call, such as its return location and execution state under the implementation.

The **heap** supports allocations whose lifetime need not match one call. A **reference** here means a way to reach data in the paper model, not a PHP-specific rule for passing values.

Stack and heap are not separate RAM chips, and not every local variable must physically live on a stack. A **runtime**, the language execution environment, may optimize or relocate storage. This is a general explanation model, not a literal PHP map.

### Paper trace: two functions and one retained value

The main program calls makeReport, labeled A. A calls makeTitle, labeled B. B prepares a report-title string, returns it to A, and A returns it to the main program.

Label the title's storage **H1**; this is an illustration label, not a real address. For this model, assume returning transfers access to the same data without making another copy.

Read the frame list from oldest to newest. The last name is the stack top: the current call, possibly waiting for a call nested within it to finish.

| Moment | Call frames | H1's state |
|---|---|---|
| Main calls A | `main, A` | Not created |
| A calls B; B creates the title | `main, A, B` | B can reach it |
| B returns the result to A | `main, A` | B's frame ends; A retains access |
| A returns the result to main | `main` | A's frame ends; main still reaches the title |
| Main drops its last access path | `main` | Data may become reclaimable under runtime rules |

**Ending a call frame does not end every value used during that call.** B's frame contains return information; H1 outlives it because the caller still retains access.

Actual language implementations may copy values, share internal representations, or organize storage differently. The table explains lifetime and reachability, not a claim that PHP places every string on the heap and every variable on the stack in this exact way.

### Pause and test the trace

1. After B returns but before A returns, does B's frame still exist? Has H1 ended?
2. After A returns, who retains the result?
3. Does dropping the last access path prove immediate RAM return to the operating system?

<details>
<summary>Review after attempting</summary>

1. B's frame has ended in this model; H1 remains reachable through A.
2. The main program, not A's ended frame.
3. No. Reclamation timing, block reuse, and returning memory to the OS are different events.

</details>

## Who decides whether data is still needed?

As with H1 in the trace, a list still reachable by the program does not become disposable merely because the function that added an item returned.

With **managed memory**, the language environment manages aspects of lifetime. **Garbage collection** reclaims data under implementation rules. Some environments combine reference counting with cycle collection; there is no single method shared by all languages.

A collector cannot prevent unnecessary **retention**. A long-running program that keeps appending to a list or an unbounded **cache**, a reusable copy, may keep all those values reachable.

PHP-specific zval, garbage-collector, and OPcache details belong in the later PHP-internals stage, not before the first program.

## What can fail?

An **allocator** manages and reuses memory **blocks**. Releasing data may make its block reusable inside the program without immediately returning it to the operating system.

| Problem | Meaning | Diagnostic example |
|---|---|---|
| Leak | Resources remain allocated beyond their useful lifetime | Each request leaves unreleased allocations |
| Fragmentation | Scattered space or waste obstructs useful allocation | Enough total space but unsuitable block layout |
| Stack overflow | Calls exceed available stack capacity | Unbounded recursion, or a function calling itself |
| OOM, out of memory | Required memory cannot be supplied | Allocation failure or process termination under system policy |

Do not exhaust your device to demonstrate OOM. **Demand paging**, supplying pages when needed, and **overcommit**, accepting reservations beyond some immediately available resources, explain why reservation success does not guarantee every later access.

## Read the right measurement

**Resident memory** means pages currently in physical RAM under the operating system's accounting. **RSS**, resident set size, measures resident process memory rather than just language variables.

**Working set** can mean actively used pages over an interval in theoretical models. Windows's Working Set counter describes resident process pages. Read the tool's definition instead of assuming cross-platform identity.

**Peak usage** is the highest observed value rather than the current one. **Native memory**, outside some language-object counters, can include libraries, thread stacks, and file-backed pages.

A PHP memory counter and an operating-system counter may therefore disagree without either being wrong.

### Optional bounded PHP experiment

After configuring PHP and learning variables, `memory_get_usage` reports bytes tracked by PHP's memory manager, not the whole RSS. `str_repeat` constructs repeated text; `unset` removes the variable here.

Save a new `memory-lifetime.php` file and run `php memory-lifetime.php`. It allocates only one MiB, writes no files, and is not a device benchmark:

```php
<?php
echo memory_get_usage(), PHP_EOL;
$payload = str_repeat('x', 1024 * 1024);
echo memory_get_usage(), PHP_EOL;
unset($payload);
echo memory_get_usage(), PHP_EOL;
```

Expect the tracked count to rise after construction and fall after removing its sole reference in this example. Exact values and exact deltas are not fixed; a fall does not prove immediate return of all memory to the OS.

## No-code practice

Draw two processes with separate address spaces. One retains a growing list; the other opens and closes a file. Which can grow despite a collector? Does closing the second process delete its saved file?

<details>
<summary>Review after attempting</summary>

The reachable list can grow without a bound. The collector cannot infer that a still-retained item is no longer useful. Process termination releases resources under OS rules but does not delete a saved file merely because the program exits.

</details>

## Summary

Ask who allocated the space, who can still reach the data, and what the counter measures. Continue with [buffers and durable writes](/en/programming-basics/computer-in-depth/13-buffers-and-durability/).

## Reference

[PHP: memory_get_usage accounting boundaries](https://www.php.net/manual/en/function.memory-get-usage.php)
