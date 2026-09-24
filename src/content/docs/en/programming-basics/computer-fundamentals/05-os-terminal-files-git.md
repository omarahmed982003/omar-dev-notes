---
title: "Operating systems, terminal, files, and Git"
description: "Understand what the operating system manages, navigate files from a terminal, and use Git to keep a reviewable history of project changes."
tableOfContents: true
---

## The operating system's role

The operating system provides an organized layer between applications and hardware. It manages processes, virtual memory, files, devices, users, permissions, and networking. Programs request these services through system calls instead of controlling a disk or keyboard directly.

A **process** is a running program with its own state and memory. A **thread** is an execution path inside a process that shares its resources. One application can use several processes or threads to perform concurrent work.

## Files and paths

- An absolute path starts at the file-system root. A relative path starts at the current directory.
- A directory organizes names. A file extension helps tools but does not change the content by itself.
- Permissions control who may read, write, or execute.
- Do not depend on filename casing because some systems distinguish `App.cpp` from `app.cpp`.

## Essential terminal commands

| Task | PowerShell | Bash |
|---|---|---|
| Show current directory | `Get-Location` | `pwd` |
| List files | `Get-ChildItem` | `ls` |
| Change directory | `Set-Location path` | `cd path` |
| Create a directory | `New-Item -ItemType Directory demo` | `mkdir demo` |
| Read a text file | `Get-Content file.txt` | `cat file.txt` |

Before deleting or moving anything, resolve the final path and verify that it stays inside the intended project.

## Git as project history

Git records connected snapshots. Start with `git status`, inspect details with `git diff`, and group one coherent change into a commit whose message explains why it exists. A branch isolates a line of work until it is ready for review and merging.

```text
Working tree → Staging area → Commit history
   edit          select          documented snapshot
```

Never commit passwords or API keys. Keep secrets in ignored environment files and provide an example file that lists variable names without values.

## Practical exercise

Create a small project with `README.md` and a `src` directory. Initialize Git, edit the file, inspect `status` and `diff`, and create a commit. Create a branch for another change and compare its history with the main branch.

## Kernel, permissions, shell, Git, and testing

The kernel manages memory, processes, and devices. User programs request privileged operations through system calls. File permissions control reading, writing, and execution for users and groups; an application should receive only the access it needs.

A terminal hosts a shell such as PowerShell or Bash. Environment variables such as `PATH` affect command discovery. Redirection sends output to a file, while a pipe connects one command's output to another command's input.

A Git branch points to a line of commits. A merge combines histories, and a conflict requires a content decision followed by tests. `fetch` downloads remote history, `pull` downloads and integrates it, and `push` publishes local commits.

Breakpoints and call stacks support debugging. Unit tests check focused behavior, integration tests check cooperating components, and end-to-end tests check a complete user flow. Preserve a regression test for every repaired defect.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How do a program, process, and thread differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A program is stored instructions. A process is a running instance with resources and state. A thread is an execution path inside that process and shares its resources.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why inspect git diff before a commit?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> It confirms the snapshot contains only the intended change and no secret, experiment, or unfinished line.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>When can a relative path become unreliable?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When the working directory changes or the program runs in another environment. Resolve it from a known project or configuration root.</div></details></section>
</div>

## Summary

A developer needs to understand the environment that runs the code, handle files safely, and maintain a history that others can review and restore.
