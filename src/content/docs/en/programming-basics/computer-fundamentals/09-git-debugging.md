---
title: 9. Git, debugging, and testing foundations
description: Repositories, commits, branches, merges, conflicts, evidence-based debugging, and regression tests.
sidebar:
  order: 9
---

## Git stores snapshot history

The repository stores project history. The working tree contains current files, the index stages the next snapshot, and a commit records it with parent, author, and message. Use `git status`, review `git diff`, and keep each commit coherent.

## Branches, merging, and conflicts

A branch is a movable name pointing to a commit. A merge combines histories; a fast-forward only moves a pointer. Rebase replays commits and changes their identities, so do not rewrite shared history without coordination.

A conflict means Git cannot choose the intended result. Read both sides and surrounding behavior, create the correct combined file, run tests, and only then stage it.

## Remotes and pull requests

`fetch` downloads remote references without integrating them. `pull` fetches and then merges or rebases according to configuration. A pull request supports review but does not replace clear commits and passing tests. Never commit credentials; deletion from a later commit does not invalidate the exposed secret.

## Evidence-based debugging

Reproduce with fixed input, state expected and actual behavior, find the last known-correct point, gather logs and debugger evidence, test one hypothesis at a time, fix the cause, and add a regression test. `git bisect` can binary-search history when a reliable pass/fail test exists.

## Test levels

Unit tests cover small logic, integration tests cover component boundaries, end-to-end tests cover user journeys, and regression tests preserve a previously failing case. A good test has controlled dependencies, a clear failure reason, and explicit arrange–act–assert structure.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How do the working tree and index differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The working tree contains all current edits; the index contains the selected next commit.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>What follows conflict resolution before committing?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Review the result, remove markers through a real resolution, run tests, and stage the intended file.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why does deleting a secret in a later commit not solve exposure?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It remains in history, clones, and possibly logs; rotate it and remediate stored history and distribution.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>What does a regression test preserve?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The previously failing input and expected behavior so the defect cannot silently return.</div></details></section>
</div>
