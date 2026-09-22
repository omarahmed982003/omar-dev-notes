---
title: "Compilation, linking, and diagnostics"
description: "Compilation is not one opaque step. Knowing the stages helps locate a diagnostic instead of trying random edits."
tableOfContents: true
---

## Overview

Compilation is not one opaque step. Knowing the stages helps locate a diagnostic instead of trying random edits.

## Concepts you need

- The preprocessor expands includes and macros into a translation unit.
- Lexing creates tokens, parsing builds an AST, and semantic analysis checks names and types.
- Compilers may create IR for optimization before machine code or assembly.
- The assembler emits object files; the linker resolves symbols across units and libraries.
- Separate compilation rebuilds changed units.
- Warnings do not stop the build but often reveal real defects.

## Example

```text
source → preprocessing → parsing/type checks → optimization/codegen
       → object files → linking → executable
```

## Corrections and common mistakes

- An undefined reference is usually a linker issue, not a parser issue.
- Fix the earliest root diagnostic, rebuild, then inspect what remains.

<div class="lesson-diagram" role="img" aria-label="Inside the compilation and linking pipeline">
<p class="lesson-diagram-title">Inside the compilation and linking pipeline</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Source + Headers</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Tokens / AST</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>IR + Optimization</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Object files</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Resolve symbols</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Executable</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>How do an AST and IR differ?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> An AST preserves source structure and meaning; IR is designed for analysis, optimization, and target-independent code generation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>What does an undefined reference usually mean?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Compilation saw a declaration, but the linker could not find the matching definition or required library/object.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Why is separate compilation useful?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Only changed units need recompilation before linking, reducing build time and isolating source files.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Is a warning safe because it does not stop the build?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> No. It may expose narrowing, uninitialized state, or suspicious logic; treat warnings as potential defects.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
