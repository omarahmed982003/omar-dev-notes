---
title: "The processor and executing instructions"
description: "Understand what a processor does and how it relates to the program you opened. First distinguish data from instructions and recognize the basic component names."
sidebar:
  order: 9
prev: {"link":"/en/programming-basics/computer-fundamentals/03-hardware-architecture/","label":"The computer components you use"}
next: {"link":"/en/programming-basics/computer-fundamentals/05-ram-memory-buffers/","label":"Memory and saving: where did your work go?"}
---

Understand what a processor does and how it relates to the program you opened. First distinguish data from instructions and recognize the basic component names.

## Dependent steps or independent work?

With a balance of 100, subtract 10 before computing tax on the new balance: the second step needs the first result. Brightening a million image pixels with the same independent rule can process many at once. A **pixel** is an image color point.

A CPU handles varied work and sequential decisions. A GPU is designed for many similar operations together. It is not always faster: transferring data and setting up work also cost time.

## From instruction to execution

The CPU (Central Processing Unit, the main instruction-executing processor) is the main processor executing program instructions. In 12+8, the numbers are data, addition requests an operation, and the result can then be displayed. A worker following a checklist is a useful analogy, but the processor does not understand human intention or independently choose the right solution.

A program on storage is not necessarily running. When opened, the operating system prepares it and the processor executes its instructions. Several windows do not each need an independent processor; the system distributes execution time.

## Where does the GPU fit?

A GPU (Graphics Processing Unit, a processor suited to many similar operations across data) handles some repetitive work across many data items well, such as computing parts of an image. It is not a universally faster replacement for the CPU. Drawing, calculation, input, and saving cooperate; some devices integrate graphics processing into the same chip.

A powerful GPU is not required for addition programs or learning conditions. A slow-opening application does not prove that the CPU alone is inadequate; storage, memory, or software may be responsible.

## Observe

Open Calculator and Notepad and switch through the taskbar. Type a note, then calculate 3×4. Each application retains its work while the system lets you switch. This exercise does not reveal core count or internal scheduling; it distinguishes running applications from the device running them.

**Worked exercise:** Why would a faster CPU not fix a program that adds when it should subtract? It may only execute the wrong instruction faster. Correctness comes from the program’s design, not the component’s speed.
