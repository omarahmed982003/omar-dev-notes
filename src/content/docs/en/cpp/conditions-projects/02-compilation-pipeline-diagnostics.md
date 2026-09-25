---
title: "4. Compiler, build pipeline, and diagnostics"
description: "Follow C++ from source and translation units through tokens, AST, IR, optimization, assembly, object files, linking, loading, warnings, and failures."
sidebar:
  order: 4
tableOfContents: true
---

## Why C++ needs translation

Processors execute machine instructions for a target architecture. C++ source uses a human-readable language, so a toolchain transforms it into a binary understood by the operating system and CPU. “Compiler” often names the driver that coordinates several distinct stages.

```text
Source files
  ↓ Preprocessor
Translation units
  ↓ Frontend + optimizer + backend
Assembly or machine code
  ↓ Assembler
Object files
  ↓ Linker + libraries
Executable
  ↓ Operating-system loader
Running process
```

Real toolchains may integrate stages and never save a separate assembly file, but this model explains where each diagnostic originates.

## Compilation, interpretation, and JIT

Ahead-of-time compilation produces objects and a platform binary before execution. An interpreter manages translation and execution at runtime. Hybrid systems may compile to bytecode, run it in a virtual machine, and JIT-compile frequently executed paths. C++ normally compiles to native code, while Java, C#, and modern JavaScript runtimes illustrate hybrid models.

## GCC, Clang, and MSVC

The compiler, standard library, target platform, architecture, and build options jointly affect available features, diagnostics, ABI, and binary format.

```bash
g++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o app
clang++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o app
cl /std:c++20 /W4 /EHsc main.cpp
```

Debug builds retain useful symbols and reduce optimization surprises while investigating. Release builds enable stronger optimization. Neither mode makes undefined behavior safe.

## A program through the pipeline

```cpp
#include <iostream>
#define TAX_RATE 0.14

int add(int a, int b) { return a + b; }

int main()
{
    int price{100};
    double total = price + price * TAX_RATE;
    std::cout << add(10, 20) << '\n' << total << '\n';
}
```

The expected output is `30` and `114`. The macro demonstrates preprocessing, although a typed `constexpr` is preferable for an ordinary numeric constant.

## 1. Preprocessing and translation units

The preprocessor handles `#include`, token substitution with `#define`, and conditional source selection through `#if`, `#ifdef`, and related directives. Header guards or `#pragma once` prevent repeated declarations inside one translation unit.

Each `.cpp` file after preprocessing, together with included header content, forms a **translation unit**. A widely included header can force many units to recompile when it changes. Headers normally provide shared declarations and types; ordinary non-inline definitions belong in source files.

## 2. Lexical analysis

The frontend recognizes tokens. In `int x = 10 + 20;`, tokens include a keyword, identifier, assignment operator, literals, addition operator, and punctuation. Tokenization identifies pieces but does not prove that their arrangement or meaning is valid. Comments normally disappear during early translation and do not affect runtime speed.

## 3. Parsing and AST

The parser validates token order against C++ grammar and builds an **abstract syntax tree**. The tree for `10 + 20 * 3` places multiplication below addition, representing operator precedence. `int x = ;` is a syntax error because an expression is missing. A diagnostic may point after the true mistake because the parser detects the inconsistency there.

## 4. Semantic analysis

The compiler then checks names, scopes, types, conversions, overload resolution, access rules, and `const` requirements.

```cpp
int count = "Hello"; // incompatible type
unknown = 10;        // undeclared name
```

Both lines have recognizable structure, but their meanings violate C++ rules. One root mistake may produce many follow-up diagnostics, so fix the first relevant cause and rebuild.

## 5. Intermediate representation

An IR gives the optimizer a simpler, compiler-specific representation:

```text
temp1 = b * c
temp2 = a + temp1
x = temp2
```

This is teaching pseudocode rather than real LLVM IR. A compiler may use several representations for different analyses.

## 6. Optimization

Optimization can fold constant expressions, remove unreachable work, inline functions, and transform loops while preserving required observable behavior for a well-defined program. Undefined behavior, such as signed overflow or using an object after its lifetime, removes important guarantees and may produce surprising optimized results.

## 7. Code generation and assembly

The backend selects instructions for the target. An addition may resemble:

```asm
mov eax, edi
add eax, esi
ret
```

This illustrative x86-64 sequence depends on the calling convention and ABI. Windows x64, System V x86-64, and ARM64 differ. Assembly is the textual instruction language; the assembler is the tool that encodes it as machine bytes.

## 8. Object files

An `.o` or `.obj` file commonly contains machine-code and data sections, provided and required symbols, relocation entries for unresolved addresses, optional debug information, and format metadata such as ELF or COFF. It is usually not runnable because references and final addresses remain unresolved.

## 9. Separate compilation

```cpp
// math.cpp
int add(int a, int b) { return a + b; }
```

```cpp
// main.cpp
int add(int, int);
int main() { return add(10, 20); }
```

Each translation unit becomes its own object. `main.obj` requires the function symbol; `math.obj` provides it. This allows incremental builds, though a changed header requires dependent translation units to rebuild.

## 10. Linking

The linker combines objects and required library components, resolves symbols, assigns final addresses, and writes the executable.

- **Undefined reference / unresolved external:** a declaration was visible, but no matching definition was linked.
- **Multiple definition:** the same non-inline definition appeared in more than one unit.
- **Architecture or library mismatch:** a dependency does not match the target or link configuration.

Static linking copies required library parts into the result. Dynamic linking leaves dependencies that the loader resolves at execution time.

## 11. Loading and execution

The operating-system loader reads the executable format, creates a process and virtual address space, maps program sections and shared libraries, prepares runtime state, and transfers control through startup code to `main`.

A successful build does not guarantee successful loading, safe execution, or correct results.

## Diagnostic categories

| Category | Example | Stage |
|---|---|---|
| Preprocessor error | Missing header | Preprocessing |
| Syntax error | Missing semicolon | Parsing |
| Semantic error | Incompatible type | Frontend analysis |
| Link error | Missing function definition | Linking |
| Load error | Missing dynamic library | Loading |
| Runtime failure | Invalid memory access | Execution |
| Logic error | `area = width + height` | Testing reveals a wrong result |
| Warning | Narrowing `double` to `int` | Build may still succeed |

Treat warnings as findings. Enable strong warnings and prevent new ones from accumulating.

## A diagnostic workflow

1. Reproduce the issue with fixed input.
2. Identify whether it occurs during preprocessing, compilation, linking, loading, execution, or result verification.
3. Read the first diagnostic related to your code.
4. Reduce the program to the smallest reproduction.
5. Change one cause and rebuild.
6. Add a test that would catch the regression.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="C++ source-to-process build pipeline">
<p class="lesson-diagram-title">From source code to a running process</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Source + Headers</span></div><span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Preprocessor</span></div><span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Tokens + AST + Semantics</span></div><span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>IR + Optimization + Codegen</span></div><span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Object Files</span></div><span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Linker</span></div><span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Executable + Loader</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How do a source file, translation unit, and object file differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The source file is written code. The translation unit is its preprocessed form with included declarations. The object file contains compiled code, symbols, and relocations but may not run independently.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why can valid syntax still produce a semantic error?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Grammar may accept the statement shape while name lookup, type checking, or conversion rules reject its meaning.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why can compilation succeed before an undefined-reference failure?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The compiler only needed a declaration. The linker later failed to find a matching definition in linked objects or libraries.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>What does IR add between an AST and target code?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> A compiler-oriented representation that simplifies analysis, optimization, and retargeting to different backends.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>Classify a missing header, undeclared name, missing function definition, missing DLL, and wrong area formula.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Preprocessing, semantic analysis, linking, loading, and logic testing respectively.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>Must optimization preserve a valid program's observable behavior, and what changes when the program has undefined behavior?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Optimization must preserve the required observable behavior of a program whose behavior is defined. Once undefined behavior occurs, the language no longer supplies that guarantee, so optimized results may appear surprising.</div></details></section>
</div>
