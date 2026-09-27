---
title: "Record file history and merge changes"
description: "Record file history and merge changes"
sidebar:
  order: 14
prev: {"link":"/en/programming-basics/computer-in-depth/17-terminal-environment/","label":"Command channels, permissions, and environment"}
next: {"link":"/en/programming-basics/computer-in-depth/16-testing-and-debugging/","label":"Test behavior and locate a defect"}
---

## Create and inspect local history

Install **Git**, the version-control program, from [its official download page](https://git-scm.com/downloads) if needed. In PowerShell, git --version should display a version. Use a new folder name if the one below exists:

```powershell
Set-Location $HOME
New-Item -ItemType Directory -Name git-practice
Set-Location .\git-practice
git init
git config user.name "Learning Example"
git config user.email "learner@example.invalid"
Set-Content -LiteralPath note.txt -Value 'First version'
git status
git add note.txt
git diff --staged
git commit -m "Add practice note"
git log --oneline
```

init creates the repository; config sets a training identity only in it. status reports state, add selects content for the next snapshot in the **staging area/index**, diff --staged displays it, commit records it, and log displays history. These are local operations, not publication.

Change the text to Second version and inspect git diff: expect a removed and added line. ## Git stores snapshot history

The repository stores project history. The working tree contains current files, the index stages the next snapshot, and a commit records it with parent, author, and message. Use `git status`, review `git diff`, and keep each commit coherent.

## Branches, merging, and conflicts

A branch is a movable name pointing to a commit. A merge combines histories; a fast-forward only moves a pointer. Rebase replays commits and changes their identities, so do not rewrite shared history without coordination.

A conflict means Git cannot choose the intended result. Read both sides and surrounding behavior, create the correct combined file, run tests, and only then stage it.

## Remotes and pull requests

`fetch` downloads remote references without integrating them. `pull` fetches and then merges or rebases according to configuration. A pull request supports review but does not replace clear commits and passing tests. Never commit credentials; deletion from a later commit does not invalidate the exposed secret.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How do the working tree and index differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The working tree contains all current edits; the index contains the selected next commit.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>What follows conflict resolution before committing?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Review the result, remove markers through a real resolution, run tests, and stage the intended file.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why does deleting a secret in a later commit not solve exposure?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It remains in history, clones, and possibly logs; rotate it and remediate stored history and distribution.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>What does a regression test preserve?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The previously failing input and expected behavior so the defect cannot silently return.</div></details></section>
</div>

## Next step

After completing this practice, continue with [Test behavior and locate a defect](/en/programming-basics/computer-in-depth/16-testing-and-debugging/).

## Try two branches and a conflict in the practice folder

Use only the new repository after its first commit. `branch -M main` names the current branch; `switch -c` creates and switches to a branch. Change the same line in two ways:

```powershell
git branch -M main
git switch -c practice-change
Set-Content -LiteralPath note.txt -Value 'Branch version'
git add note.txt
git commit -m "Change note on practice branch"
git switch main
Set-Content -LiteralPath note.txt -Value 'Main version'
git add note.txt
git commit -m "Change note on main"
git merge practice-change
```

Expect a conflict because both versions changed one line. Open note.txt: `<<<<<<<`, `=======`, and `>>>>>>>` delimit alternatives, not final content. Replace the whole marked block with `Combined learning note`, save, run `git add note.txt`, then `git commit -m "Resolve practice conflict"`. `git status` should show no conflict. `git log --oneline --graph --all` draws text history. Nothing was published.
## Inspect history after trying a merge

A **parent** is an earlier commit linked by a commit. **Fast-forward** moves a branch name along an already-descendant history. **Conflict markers** show unresolved alternatives, requiring a real semantic resolution.

**restore** restores file or index contents according to options; **revert** records an inverse commit; **reset** changes a reference and may change the index or working files according to mode. They are not interchangeable.

**Worked check:** Commit A computes 2+3=5, B changes + to - and produces -1, C changes only a comment. B is the first failing commit. bisect narrows history using a reliable pass/fail test. **Arrange–Act–Assert** means prepare input, perform an action, and compare against expectation. **CI (Continuous Integration, frequent code integration with automated checks)** runs automated integration checks; a clean checkout reveals untracked dependencies.
