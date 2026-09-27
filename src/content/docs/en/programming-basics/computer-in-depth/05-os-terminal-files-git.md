---
title: "Read and write files from a terminal"
description: "Read and write files from a terminal"
sidebar:
  order: 12
prev: {"link":"/en/programming-basics/computer-in-depth/14-running-code/","label":"From solution steps to running code"}
next: {"link":"/en/programming-basics/computer-in-depth/17-terminal-environment/","label":"Command channels, permissions, and environment"}
---

## Terminal and shell

A terminal displays a text session; a shell parses commands, quoting, expansions, and pipes before starting processes. PowerShell, Bash, zsh, and `cmd.exe` use different syntax, so escaping rules should not be copied blindly between them.

## Paths and working directory

An absolute path starts at a root or drive. A relative path is resolved from the current working directory; `.` means current and `..` means parent. A filename is not a complete path, and an extension does not prove content type.

Use tab completion and literal-path options for special characters. Before recursive deletion or movement, resolve and display the exact target.

## A reproducible terminal workspace

Open PowerShell on Windows and create a new training directory under your user directory. Choose another name if it already exists:

```powershell
Set-Location $HOME
New-Item -ItemType Directory -Name terminal-practice
Set-Location .\terminal-practice
Set-Content -LiteralPath '.\note.txt' -Value 'Hello'
Get-Location
Get-ChildItem
Get-Content -LiteralPath '.\note.txt'
```

Set-Location changes the working directory; $HOME is your user directory. New-Item creates a directory. Set-Content writes text and would replace an existing file, so use the new training folder. The Get commands display location, children, and contents. Expect note.txt and Hello. Tab completes names.

**Quoting** preserves paths containing spaces. A **wildcard**, such as *, can match many items; LiteralPath treats the path literally. **Recursive** includes child directories and therefore broadens a move or deletion.


## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How do a terminal and shell differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The terminal presents the session; the shell interprets commands and connects processes and streams.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Why can a valid relative path fail?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It is resolved from the current working directory, which may differ from the script or project directory.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why separate stdout and stderr?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Machine-readable output remains clean while diagnostics can be displayed or logged independently.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>Is an environment variable a secret vault?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> No. It is a configuration channel that can leak; use secret management, permissions, rotation, and log redaction.</div></details></section>
</div>

## Next step

After completing this practice, continue with [Command channels, permissions, and environment](/en/programming-basics/computer-in-depth/17-terminal-environment/).
