---
title: "When does parallel work help?"
description: "When does parallel work help?"
sidebar:
  order: 5
prev: {"link":"/en/programming-basics/computer-in-depth/04-cpu-gpu/","label":"How a processor executes instructions"}
next: {"link":"/en/programming-basics/computer-in-depth/05-ram-memory-buffers/","label":"Addresses and virtual memory"}
---

Compare dependent steps with thousands of independent operations. First understand the processor and memory.

## Why a GPU is different

A CPU (Central Processing Unit, the main instruction-executing processor) has fewer powerful cores optimized for low latency, branching, and general-purpose work. A GPU (Graphics Processing Unit, a processor suited to many similar operations across data) contains many simpler execution units designed to apply similar operations to large data sets. It excels at rendering, matrix work, machine learning, and scientific computation.

Irregular branching and repeated small transfers can erase the advantage. A discrete GPU normally has separate VRAM (Video RAM, memory for graphics data, often on a discrete card); copying data, launching a kernel, and returning results all cost time.

## Integrated and discrete GPUs

An integrated GPU usually shares system memory and power. A discrete GPU has its own VRAM, power budget, and cooling. Unified-memory APIs simplify programming but do not guarantee that physical data movement disappears.

## Workload comparison

| Workload | Typical choice | Reason |
|---|---|---|
| Web request and business rules | CPU | Branching, I/O (Input/Output, reading, writing, and device communication), and latency |
| Small compression task | CPU | GPU transfer cost dominates |
| Large matrix multiplication | GPU | High data parallelism |
| Rendering millions of pixels | GPU | Similar operation over many values |
| Database transaction | CPU | Control, memory, and I/O heavy |
