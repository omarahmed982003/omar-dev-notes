---
title: "From solution steps to running code"
description: "From solution steps to running code"
sidebar:
  order: 11
prev: {"link":"/en/programming-basics/computer-in-depth/03-binary-languages-algorithms/","label":"Representing numbers and characters in memory"}
next: {"link":"/en/programming-basics/computer-in-depth/05-os-terminal-files-git/","label":"Read and write files from a terminal"}
---

After representing values, follow instructions: what translates them, what executes them, and why a program may need an external library.

A **compiler** translates source to machine code or another executable representation. An **interpreter** executes code or its representation. A **runtime** supplies execution services. **JIT**, just-in-time compilation, translates selected code while a program runs.

## From an algorithm to a program

1. Define inputs, outputs, and constraints.
2. Write language-independent steps as pseudocode or a flowchart.
3. Dry-run a normal, boundary, and invalid case.
4. Translate the design into code and compare behavior with expectations.
5. Optimize only after correctness and measurement show a real need.

<div class="lesson-diagram" role="img" aria-label="From a problem to machine-executable instructions">
<p class="lesson-diagram-title">From a problem to machine-executable instructions</p>
<div class="diagram-flow diagram-pipeline">
<div class="diagram-node input"><span>Problem</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Algorithm</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Source code</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Compiler / Interpreter</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Executable instructions</span></div>
</div>
</div>


A compiler translates source before execution, an interpreter executes a representation at runtime, and a JIT (Just-In-Time compilation, translating code during execution) compiles selected code while the program runs. A runtime supplies services required by the language or platform.


Libraries may link statically or load dynamically. Projects record dependency versions because API (Application Programming Interface, a defined contract for requesting data or actions from another component) and behavior can change between releases.


A **library** is reusable code; a **dependency** is something a project requires. **Static linking** incorporates library code into a build; **dynamic linking** loads it for execution. A **lock file** records selected dependency versions to help reproduce a build.
