---
title: "Choose between greedy steps and saved results"
description: "Choose between greedy steps and saved results"
sidebar:
  order: 11
prev: {"link":"/en/programming-basics/math-problem-solving/09-solution-patterns/","label":"Turn solution patterns into steps"}
next: {"link":"/en/programming-basics/math-problem-solving/03-applied-math-graphs-primes/","label":"Measurement, units, and prime numbers"}
---

Find the fewest coins for an amount. Before naming an algorithm, make 6 from 1, 3, and 4: largest-first gives 4+1+1, while 3+3 is better. Learn why a quick choice can fail and how a table of smaller results helps. First study complexity and solution patterns.


## Greedy versus dynamic programming: choose with evidence

In the coin example below, dp names the results table, dp[x] is the entry for amount x, min selects the smaller value, and != means "not equal". O(Tk) describes work growing with target amount T times the number of coin types k; O(T) describes table space growing with the target.


Form 6 with the fewest coins from {1,3,4}, allowing reuse. Greedy chooses the largest usable coin now: 4+1+1 uses three, but 3+3 uses two. A locally best choice does not guarantee a globally best solution; greedy needs a problem-specific proof.

Dynamic programming stores smaller solutions. Let dp[x] be the minimum coins forming x. Start with dp[0]=0 and other entries unreachable. Try each last coin c: remainder x−c needs dp[x−c], then add one. Denominations must be positive integers and the target a nonnegative integer.

```text
coins = [1, 3, 4]
dp[0] = 0
for x from 1 through target:
    dp[x] = infinity
    for c in coins:
        if c <= x and dp[x-c] != infinity:
            dp[x] = min(dp[x], dp[x-c] + 1)
```

| x | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| dp[x] | 0 | 1 | 2 | 1 | 1 | 2 | 2 |

For 6 compare dp[5]+1=3, dp[3]+1=2, and dp[2]+1=3: choose two. Every solution ends with a tried coin, and its remainder is a smaller solved problem; this justifies the recurrence. Infinity is a pseudocode marker: use a special value or a large sentinel without adding one to it. For k denominations and target T, time is O(Tk), memory O(T); a billion-sized target is unsuitable even if k is small.

**Worked exercise:** With {3,4}, target 2 is unreachable, not zero coins. Target zero takes zero coins. If each coin is available once, this algorithm violates the contract by reusing it; change the state or update order to represent limited inventory.
