---
title: Operating-system architecture and types
description: Kernels, user mode, system calls, processes, threads, scheduling, memory, filesystems, drivers, and operating-system categories.
sidebar:
  order: 3
prev: {"link":"/en/programming-basics/computer-in-depth/software-and-runtime/","label":"Software: from source code to a running program"}
next: {"link":"/en/programming-basics/computer-in-depth/04-cpu-gpu/","label":"How a processor executes instructions"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## Required now: who shares the machine between programs?

You have an editor, a browser, and a program reading a file. The processor, memory, and storage are shared resources; each program does not own the whole machine.

An **operating system** is a collection of programs managing resources and providing organized ways for applications to use them. We will follow a program starting, requesting a file, possibly waiting, continuing, and finishing.

You need to know that the CPU executes instructions, RAM is working memory, and a program file differs from its running instance. Start with [software and runtime](/en/programming-basics/computer-in-depth/software-and-runtime/) if the last distinction is new.

### Observe a running instance

A **process** is a running program instance with memory, resources, and identity. A **PID, process identifier**, currently distinguishes it. A **thread** is an execution path within a process; a process may contain several.

On Windows, open Notepad and Task Manager with Ctrl+Shift+Esc. In Details, find `notepad.exe`; the name may differ by version. Show PID and Threads columns if available, record them, and type in Notepad.

Observe CPU use without ending processes. Nearly zero does not mean the program is closed: its threads may be waiting for input. One window does not establish one process, and more threads do not prove greater speed.

### Where does a request go?

The **kernel** manages resources and protected access. Ordinary applications generally run in **user mode**, while the kernel performs protected operations in **kernel mode**.

A **system call** requests a system service such as opening a file. Running on a machine does not permit a program to read every file: the system checks the request and the process identity's access, then allows or rejects it.

**Permissions** specify allowed actions such as reading and writing. Being installed is not permission to read an accounting program's memory or another user's files. Authorized sharing is possible; protection does not prohibit every exchange.

### Follow one file read

This is a paper scenario: a program wants `notes.txt`. The **scheduler** selects a ready thread to receive processor time.

| Moment | What happens? |
|---|---|
| Ready | The thread can run and waits its turn |
| Running | It executes, then requests opening and reading the file |
| Blocked or sleeping | If data is not ready, it may wait instead of consuming processor time |
| Ready, then running | Once the request is ready, it becomes eligible and continues when scheduled |
| Terminated | It finishes and its resources are reclaimed according to system policy |

A fast cached copy may supply the data without a long wait; not every read waits for disk. If permission is denied, the request fails instead of completing the read.

A **context switch** saves one execution state and restores another. While one thread waits, another ready thread may run. Some tools aggregate process status; Task Manager's Running label does not necessarily describe every thread at each instant.

### Memory and files are different resources

An **address space** is the collection of addresses a process uses for memory. The system manages their mapping and protection. Threads within a process normally share its address space and resources such as open files.

A **filesystem** organizes file/directory names and their relationship to stored data. **Metadata** describes information such as size, ownership, and permissions.

A **handle or file descriptor** identifies an opened resource to the program. Names help locate it; the identifier is used while working with it. Closing an editor does not delete a saved file.

### Why broader permission is not a universal fix

A **user** is an identity; a **group** collects identities to simplify access grants. **Least privilege** means providing only necessary permissions.

Administrator on Windows and root on systems such as Linux are broad administrative identities. A **service account** belongs to a program; a web service normally does not need full administration.

| Symptom | First explanation to investigate |
|---|---|
| Missing file | Name, path, and the program's starting directory |
| Access denied | Process identity and required permission |
| Slow program with low CPU | Storage, network, or resource waits, not necessarily a weak CPU |
| Continually growing memory | Retained data or excessive allocation; administration does not fix lifetime |

PHP started from a terminal may use a different identity from the web server's PHP service. The browser is not PHP's execution identity on that server. The same file may be allowed in one execution and denied in another.

Permissions are one protective layer, not a substitute for protecting secrets or isolating networks. Do not change real files' permissions or run everything as administrator for this lesson.

## Check the foundation

1. Why can open Notepad use almost no CPU?
2. If a thread must wait for a file, must the whole machine stop?
3. Does administration fix an incorrect filename?
4. How does a saved program differ from a process?

<details>
<summary>Review after attempting</summary>

1. Its process exists while threads may be waiting for input.
2. No. Another ready thread may run. Completing the wait does not guarantee immediate execution ahead of all others.
3. No. Broader access does not create the correct file and may hide the cause while increasing potential harm.
4. One is saved instructions and files; the other is execution with memory, identity, and resources.

</details>

This is sufficient before [how the processor executes instructions](/en/programming-basics/computer-in-depth/04-cpu-gpu/). The remaining references are optional depth; the PHP lab waits until the language is configured.

## Optional depth: system layers and cases

Each folded section expands part of the same journey. Use one to explain an observation, rather than memorizing every mechanism or system category.

<details>
<summary>Kernels, distributions, and usage categories</summary>

A complete system includes its kernel, administration tools, libraries, services, and interface. A **library** provides reusable code; a **service** performs a background function such as accepting requests.

Linux names a kernel. A **distribution**, such as Ubuntu, combines it with packages, tools, settings, and updates. Windows and macOS are complete systems with different components. Everyday “Linux” may refer to the whole system, so check context.

- **Desktop:** windows, applications, and direct interaction.
- **Server:** continuous services, remote administration, and request capacity.
- **Mobile:** power, sensors, and a **sandbox**, isolation limiting application access.
- **Embedded:** a function within a device, potentially with limited resources.
- **Real-time:** completing work before a defined deadline. In **hard real-time**, missing it is failure even if the answer arrives later.
- **Hypervisor:** manages **virtual machines**, environments presented as machines to their guest systems. It may run directly above hardware or above another system; it is not a synonym for every server OS.

These uses and layers can overlap; they are not mutually exclusive boxes. Systems differ in **APIs, Application Programming Interfaces**, their programmatic services, tools, file organization, and licensing. Choose according to application and hardware requirements.

</details>

<details>
<summary>Thread state, addresses, and memory management</summary>

Each thread has execution state and a **call stack**, storing information needed to return from a **function**, a unit of code performing a task. Threads sharing data need coordination when more than one modifies it.

More threads may increase contention and switching instead of speed, especially with one limiting processor or resource.

**Virtual memory** provides a system-managed address space. A **page** is a unit of that space. **Page tables** record mappings to physical memory, protection, and page state.

A **page fault** may require preparing a valid page or reveal forbidden access; it is not always a crash. **Paging** manages pages rather than necessarily moving an entire process each time.

**Shared memory** permits authorized coordinated sharing. A **memory-mapped file** associates a file region with addresses. **Swap** is storage to which some memory contents may temporarily move.

Page permissions may allow reading/execution without writing or allow data without execution. **OOM, out of memory**, may cause an allocation failure or process termination according to policy.

Translation calculations belong in the [memory lesson](/en/programming-basics/computer-in-depth/05-ram-memory-buffers/), not among prerequisites for understanding the file wait here.

</details>

<details>
<summary>Devices, caches, and notifications</summary>

**Blocks** are pieces in which filesystems organize storage. The **page cache** keeps memory copies to reduce storage access; completing a write there does not always mean reaching persistent media.

**I/O, Input/Output**, includes files, network communication, and displaying results. A **driver** lets the system communicate with a **controller**, hardware managing a device.

An **interrupt** notifies the processor of an event needing attention. **Polling** repeatedly checks status instead of waiting for notification. Workload and design determine the choice.

Close resources when finished, or use a documented **runtime**, language execution environment, mechanism for managing them. Do not assume every resource closes at the right time automatically.

</details>

<details>
<summary>Optional PHP lab: trace writing and reading a file</summary>

A **GUI, Graphical User Interface**, uses windows and controls. A **shell** interprets written commands. When starting a new process, the system creates it; a **loader** prepares executable code and libraries in its address space, execution state/resources are prepared, and a thread is scheduled.

Clicking may instead direct work to an existing process. Here we explicitly assume creation of a new one; operating systems and applications differ.

**PHP CLI** means running PHP from the command line. Use this lab only after configuring PHP and learning the first language concepts. Its no-code alternative is tracing the file-read table above.

Use a fresh practice directory and save `os-file-lab.php`. Repeating the lab replaces only its `os-lab-note.txt` with the same text; do not use personal files.

Before the code: `$path` and `$data` hold a path and text. `__DIR__` identifies the script directory. `file_put_contents` writes and returns a byte count or false; `file_get_contents` reads or returns false.

`strlen` counts bytes, `!==` is strict inequality, and `throw new RuntimeException` reports failure instead of treating it as success. `echo` displays output; `declare` controls specific type behavior as introduced in software.

```php
<?php
declare(strict_types=1);

$path = __DIR__ . '/os-lab-note.txt';
$data = "Hello from PHP\n";
$written = file_put_contents($path, $data);
if ($written !== strlen($data)) {
    throw new RuntimeException('Could not write the complete file');
}
$loaded = file_get_contents($path);
if ($loaded === false) {
    throw new RuntimeException('Could not read the file');
}
echo $loaded;
```

Run `php os-file-lab.php`. Expect `Hello from PHP` and a new `os-lab-note.txt` beside the script.

`__DIR__` anchors the path to the script rather than the terminal's location. Comparing the byte count avoids accepting an incomplete write; checking false distinguishes a failed read from valid contents.

PHP uses system services for paths, identity/permissions, filesystems, caches, and drivers when needed. A PHP call need not map to exactly one system call: libraries and **buffers**, temporary storage during transfers, can group work.

Cached data may return quickly; slower access may make the thread wait while another runs. Writing successfully here means acceptance under the interface's contract, not a power-loss survival experiment.

See [buffers and durable storage](/en/programming-basics/computer-in-depth/13-buffers-and-durability/) for those limits.

</details>

<details>
<summary>Communication and deadlock</summary>

**IPC, Inter-Process Communication**, exchanges data and notifications. A **pipe** passes output to another program. A **socket** is a communication interface, local or networked. Shared memory is another option, and a **signal** notifies a process of an event.

This IPC is not Instructions Per Cycle in processor measurement: the same abbreviation has different contexts.

A **deadlock** example is A holding resource1 while waiting for2, with B holding2 while waiting for1. The usual conditions are exclusive resource use, holding while waiting, no forced resource withdrawal, and a circular wait.

A consistent acquisition order breaks the circular wait in this model. Waiting for a disk read alone is not evidence of deadlock; investigate a dependency cycle that cannot progress rather than any delay.

</details>

### Optional-depth questions

Are Linux and Ubuntu identical? Does a server OS necessarily promise hard real-time deadlines?

<details>
<summary>Review the optional questions</summary>

Linux is a kernel; Ubuntu is a distribution combining it with other components. Service capacity and reliability do not themselves guarantee strict response deadlines.

</details>

## Summary and references

Separate saved code from a process, execution from waiting, and necessary access from administration. Extra mechanisms explain limits; they are not a list to memorize before first code.

- [Microsoft: processes, threads, and resources](https://learn.microsoft.com/en-us/windows/win32/procthread/about-processes-and-threads).
- [Microsoft: user mode and kernel mode](https://learn.microsoft.com/en-us/windows-hardware/drivers/gettingstarted/user-mode-and-kernel-mode).
