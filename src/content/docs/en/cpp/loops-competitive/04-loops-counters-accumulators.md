---
title: "Loops, counters, and accumulators"
description: "A loop has initial state, a continuation condition, and an update. Choose while, for, or do-while according to the repetition model."
tableOfContents: true
---

## Overview

A loop has initial state, a continuation condition, and an update. Choose while, for, or do-while according to the repetition model.

## Concepts you need

- for fits a known counter progression.
- while fits termination driven by evolving state.
- do-while runs at least once and can support interactive validation.
- A counter counts, an accumulator combines, and a sentinel ends unknown-length input.
- break exits the nearest loop; continue skips the rest of one iteration.
- Nested loops often multiply iteration counts; analyze complexity.

## Example

```cpp
long long sum{};
for (int i = 1; i <= n; ++i) {
    if (i % 2 != 0) continue;
    sum += i;
}
```

## Corrections and common mistakes

- Every path should move toward termination.
- Updating the counter in the wrong place causes off-by-one errors.

<div class="lesson-diagram" role="img" aria-label="The loop cycle and its initialization, bound, and update points">
<p class="lesson-diagram-title">The loop cycle and its initialization, bound, and update points</p>
<div class="diagram-flow">
<div class="diagram-node start"><span>Initialize</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Condition</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Loop body</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Update</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Exit</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>When is do-while preferable to while?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When the body must execute once before continuation is tested, such as showing a menu or reading a first attempt.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>What commonly causes an off-by-one bug?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Ambiguous inclusive bounds, starting value, or update position; write the intended first and last iterations before coding.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>How do you average values terminated by -1?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Accumulate and count values without including -1, then divide only after confirming count is nonzero.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>What is the complexity of two n-sized nested loops?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Usually O(n²), but actual bounds matter; shrinking or globally advancing inner work can change the result.</div></details>
</section>
</div>

## Summary

Build the solution in stages, enable warnings, and test normal, boundary, and invalid cases. Understanding means you can explain why each line exists.
