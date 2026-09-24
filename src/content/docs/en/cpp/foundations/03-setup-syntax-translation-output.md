---
title: "3. C++ introduction, tools, and the first program"
sidebar:
  order: 3
description: "C++ is a compiled language with strong performance and memory control. Understanding program structure and the build path matters more than depending on one IDE."
tableOfContents: true
---

## The C++ language

C++ is a compiled language with strong performance and memory control. Understanding program structure and the build path matters more than depending on one IDE.

## Editors, compilers, IDEs, and source code

- An editor writes files, a compiler translates them, and an IDE integrates several tools.
- A statement performs an action, an expression produces a value, and a token is a smallest meaningful unit.
- Execution starts at main; returning zero conventionally signals success.
- iostream provides streams, and std is the standard-library namespace.
- The build pipeline covers preprocessing, compilation, assembly, and linking.

## The first C++ program

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, C++!\n";
    return 0;
}
```

## Build warnings and namespace mistakes

- Enable warnings and start with the first diagnostic related to your code.
- Avoid global using namespace std in headers or large projects.

<div class="lesson-diagram" role="img" aria-label="The C++ source-to-executable pipeline">
<p class="lesson-diagram-title">The C++ source-to-executable pipeline</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Source .cpp</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Preprocessor</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Compiler</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Assembler</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Linker</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Executable</span></div>
</div>
</div>

## Toolchains, standards, and diagnostics

An editor changes text; an IDE also manages projects, builds, and debugging. MSVC, GCC, and Clang are the toolchains that compile the program. Select a project standard such as C++20 or C++23 and verify compiler support instead of assuming every feature is available.

The preprocessor expands includes and directives. The compiler analyzes tokens, syntax, and types and generates code. The assembler creates object files, and the linker resolves symbols across object files and libraries. A missing semicolon is a compile error; a declared but undefined function usually becomes a link error; a crash is a runtime error; a wrong result is a logic error.

Read the first relevant diagnostic, reduce the problem to a small reproduction, change one cause, and rebuild.

## Language, standards, and tools

C++ combines high-level structure with explicit resource and memory control. It appears in engines, browsers, embedded systems, and performance-sensitive software. Standards from C++98 through C++11, 17, 20, and 23 evolve the language; the selected compiler mode determines which standard rules are enabled.

An editor changes files, an IDE also integrates projects and debugging, and a toolchain performs compilation. Visual Studio provides MSVC through its C++ workload. VS Code needs an external compiler. Code::Blocks may bundle one. Tool choice does not change language rules.

## Program structure and output

Tokens form expressions and statements. `price + tax` produces a value; `total = price + tax;` performs an assignment. `main` is the entry point, `<iostream>` provides stream declarations, and `std::cout` writes standard output. Escape sequences include `\n`, `\t`, `\"`, and `\\`. A character literal such as `'A'` differs from the string literal `"A"`.

Namespaces prevent collisions. Prefer qualified names such as `std::cout`; broad `using namespace` directives are especially harmful in headers.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>How do an IDE and a compiler differ?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> An IDE integrates editing, building, and debugging; a compiler translates and checks source. Either can be used without the other.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Why can compilation succeed while linking fails?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Each unit can be valid alone while the linker cannot find a referenced definition or finds duplicate definitions.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>What is main and what does return 0 mean?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> main is the hosted program entry point; zero conventionally reports successful completion to the operating system.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>How should you handle ten diagnostics caused by one mistake?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Fix the earliest relevant diagnostic and rebuild; later messages may only be cascading consequences.</div></details>
</section>
</div>
