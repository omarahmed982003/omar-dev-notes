---
title: "Software: from source code to a running program"
description: "Distinguish source code, programs, processes, runtimes, libraries, and the operating system by following a small PHP script."
sidebar:
  order: 2
prev: {"link":"/en/programming-basics/computer-in-depth/03-hardware-architecture/","label":"Hardware components and motherboard architecture"}
next: {"link":"/en/programming-basics/computer-in-depth/06-operating-systems/","label":"Operating-system architecture and types"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

You saved `echo 'Hello';` in a file; echo is PHP's output construct. The text exists on disk, but nothing has executed yet. This lesson follows the parts that turn that file into work on a computer.

You need only a basic hardware model: a processor executes instructions, RAM holds active work, and storage retains files. Previous programming experience is unnecessary.

## Hardware needs instructions

**Hardware** means physical components such as processors, memory, and disks. **Software** includes programs, instructions, data, and configuration that define what the computer does. The same hardware can run a browser or an accounting application because different instructions process different data.

Software has different roles. Applications serve users; operating systems manage resources; developer tools include PHP, code-translation tools, and editors. **Firmware** is software associated with a device, used for initialization or control, such as UEFI, the platform startup interface.

Software does not need a window to perform useful work.

## Source code, program, and process

**Source code** is the text a programmer writes for language tools to understand. `hello.php` is source code. A **program** is the instructions and components that accomplish a task, potentially spread across many files.

A **process** is a running instance of a program with an identity, memory, and resources managed by the operating system.

Running the same PHP script in two terminals normally creates two processes. A variable in one does not automatically change a variable in the other. Communication needs an explicit mechanism such as a file, database, or connection.

A program file can exist without running. A running program can wait for a user, storage, or a network rather than continually calculating.

## Why the processor does not read PHP directly

A processor executes machine instructions appropriate for its architecture. Language tools translate or execute source code. A **compiler** translates code into another representation, which may be machine code or an intermediate format. An **interpreter** executes a program or representation under another program's control.

The distinction is not a strict classification of every language into one category. A typical PHP implementation parses source and compiles it into intermediate instructions called **opcodes**, then its execution engine runs them.

A **runtime** supplies services used while a program executes, such as managing values and memory, invoking operations, and handling errors.

PHP is itself a program built to run on the operating system. When a PHP script requests a file, the runtime uses operating-system services. The script does not directly control the disk.

### Compare one task through two execution models

Both programs display Hello. A **build** prepares output from source files before running it. An **executable** is output the system can load to run instructions suited to the platform.

Compare an ordinary PHP execution with a program built ahead of time into machine instructions. These are specific tracing models, not an eternal division of languages into “compiled” or “interpreted.”

| Question | PHP script | Ahead-of-time compiled program |
|---|---|---|
| What exists beforehand? | Source such as hello.php and an installed PHP executable | Source has gone through a build producing an executable |
| Who reads the source? | The PHP engine parses/prepares intermediate instructions according to configuration | Build tools read source before execution and produce executable code |
| What does the OS start? | A PHP process running the script | A process for the resulting executable |
| What does the CPU execute? | Machine instructions for PHP and system components; PHP manages the script's instructions | Machine instructions for the output, libraries, and system components |
| What follows a source edit? | Save and rerun; other operating modes may require checking caches | Rebuild and run the new output; source edits alone do not modify the old executable |

The CPU does not wait for the tools to operate independently: it executes tool and system instructions throughout. Responsibilities overlap in time.

<details>
<summary>Optional depth: build stages and PHP caches</summary>

A common GCC-style build prepares/preprocesses source, compiles, assembles, and links output. You do not need those tools here; the distinction is **build time** versus **run time**.

**OPcache** can reuse prepared PHP intermediate instructions instead of parsing source each time. **JIT, just-in-time compilation**, may translate some work into machine code during execution. Neither removes the PHP engine or makes every execution identical to the simplest example.

</details>

### Trace without installing another tool

On paper, assume the first version displayed Hello, then you edit the source to display Welcome. For each model:

1. Who must read the edited source?
2. Does running old output guarantee Welcome?
3. Does a failure before the script starts prove its logic is wrong?

<details>
<summary>Review both paths after attempting</summary>

In the simple PHP model, rerunning makes the engine read the edited source. In the ahead-of-time model, rebuild and run the new executable; the old executable may still show Hello.

Tool discovery and loading failures precede program logic in either model. Identify the failed stage rather than randomly changing calculations.

</details>

## Run a small program

Install PHP CLI, the command-line interface for PHP, and confirm it is available:

```bash
php -v
```

If the command is not recognized, the terminal cannot find PHP in its search paths or PHP is not installed. The script has not started, so editing `echo` cannot repair that failure.

This experiment is optional until PHP and basic file handling are available; first follow the model on paper. Save a new practice file named `hello.php` without replacing personal files.

Before the code: `<?php` starts PHP source, `$name` names a variable, `.` joins strings, `echo` displays output, and `PHP_EOL` ends a line. `declare(strict_types=1)` enables stricter rules for certain function-call values; it does not declare every variable's type.

```php
<?php
declare(strict_types=1);

$name = 'Omar';
echo 'Hello ' . $name . PHP_EOL;
```

Open a terminal in that file's directory:

```bash
php hello.php
```

Expected output:

```text
Hello Omar
```

`<?php` introduces PHP code. `$name` names a value during execution. The `.` operator joins strings. `echo` writes the result, and `PHP_EOL` supplies a platform-appropriate line ending. `strict_types` affects certain scalar type checks at function calls; it does not declare every variable's type.

The operating system starts a PHP process. PHP reads the script, executes it, and writes to **standard output**, the normal output channel displayed by the terminal. The process then ends. The file remains on disk, but `$name` does not become persistent database state.

Change the name to `Mona` and run it again. The new invocation reads the changed source. Saving and executing are different actions.

## Libraries, frameworks, and extensions

A **library** supplies reusable code your program calls for a particular task. A **framework** supplies structure and parts of an application's execution lifecycle, invoking your code at designated points. Laravel is a PHP framework that routes requests and provides tools for application data and services.

A **PHP extension** adds functionality to the PHP engine, such as **PDO, PHP Data Objects**, a database-access interface. Installing a project library is different from enabling an engine extension. A **dependency** is a component your application needs.

Composer manages PHP packages; it does not replace PHP installation or extension configuration.

Learn variables, files, and functions in plain PHP first. Laravel can then demonstrate their use in a larger application. Printing a line does not require a framework.

### Optional depth: dependencies during building and running

<details>
<summary>Open static/dynamic linking and locked versions</summary>

**Linking** connects a program to code it needs. **Static linking** includes library code in a build result; **dynamic linking** relies on loading a library during execution under platform rules. These are general patterns, not a claim that Composer converts PHP packages into machine-code libraries.

A **package** combines code with distribution information; Composer manages PHP packages and dependencies. A **lock file** records selected versions to help reproduce dependency choices. It is not a concurrency lock or, alone, a guarantee of identical operating systems and extensions.


</details>

## Installed does not mean running

**Installation** prepares program files and components. **Configuration** selects settings such as a data location or database address. **Execution** actually runs instructions.

PHP can be installed while a required extension is missing. A script can start but fail to open a file because of permissions. A database can be installed while its service is stopped. Each situation requires different evidence.

A **service** is a process or set of processes kept ready for new work, such as a web server. A short CLI script can start and end per invocation; a **worker**, a task-processing program, can remain alive across many jobs.

A long-lived process may retain values that a short-lived process would discard on exit if application code keeps references to them.

**PATH** lists directories searched for executable commands; the environment lesson explains its rules. A **parse error** means source text violates the language's grammar.

## Diagnose the stage that failed

| Observation | Likely category | First check |
|---|---|---|
| `php` is not recognized | Installation or search path | PHP installation and PATH |
| `Could not open input file` | Script location | Filename and working directory |
| `Parse error` | Language syntax | Reported location and preceding line |
| Old output | Different file or invocation | Saved file, command, and path |
| `Permission denied` | Resource access denied | Process identity and resource permissions |

These are starting points, not proof of a single cause. Read the complete message and locate the failed stage before changing code.

## Try it yourself

Run the script in two terminals after changing its name value. Does the first invocation retain the variable after it ends? Does an identical filename guarantee identical source in two directories?

<details><summary>Reasoning and answer</summary>

Each invocation has its own process-local state. Its variables do not persist after the process ends merely because the source file remains. Two directories can contain different files with the same name; inspect the working directory and path passed to PHP.

</details>

The model now connects saved source, execution tools, process resources, and an operating system managing those resources. Continue with [operating systems](/en/programming-basics/computer-in-depth/06-operating-systems/) to understand resource sharing and protected operations.

## References

- [PHP CLI](https://www.php.net/manual/en/features.commandline.php)
- [PHP type declarations](https://www.php.net/manual/en/language.types.declarations.php)
- [Composer introduction](https://getcomposer.org/doc/00-intro.md)

- [GCC: build stages and output types](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html)
- [PHP: OPcache and reuse of intermediate instructions](https://www.php.net/manual/en/book.opcache.php)
