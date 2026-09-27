---
title: "Allocation and the lifetime of data"
description: "Allocation and the lifetime of data"
sidebar:
  order: 7
prev: {"link":"/en/programming-basics/computer-in-depth/05-ram-memory-buffers/","label":"Addresses and virtual memory"}
next: {"link":"/en/programming-basics/computer-in-depth/13-buffers-and-durability/","label":"Moving data and making writes durable"}
---

Trace a local value, then data needed for longer. First understand memory addresses in the preceding lesson.

## Short-lived values and retained data

A price function needs its inputs and intermediate result during a call. Local data lifetime can end afterward according to language rules, while the shopping list must survive the add function. **Allocation** obtains storage; **lifetime** describes when data remains valid. These are different questions.

The **stack** commonly organizes call data. The **heap** supports flexible allocation lifetimes. Language implementations may optimize placement; not every local value physically resides on a stack.

**Check:** returning from add does not erase a list still needed by the program. Language rules, memory management, and references govern its lifetime.

## Stack and heap

Stack frames normally hold call state and local values and disappear as calls return. The heap supports dynamically lived objects. Deep recursion can overflow a stack; heaps can suffer retention leaks, fragmentation, or out-of-memory failure. These are virtual address regions, not separate RAM chips.

## Allocation, leaks, fragmentation, and OOM

An allocator manages blocks and reuses freed space. A leak keeps memory reachable or allocated after it is no longer useful. Fragmentation leaves unusable gaps or overhead. Observe resident and peak memory, not only theoretical object size. Garbage collection cannot correct an intentionally retained unbounded cache.


**Managed memory** is administered by the language; **native memory** may lie outside its usual object-heap counters. **Retention** keeps unneeded objects reachable, so garbage collection cannot reclaim them. **RSS (Resident Set Size, process memory currently resident in physical RAM under the system's accounting)** can rise because of thread stacks, native library allocations, or mapped pages while a heap counter stays flat.
