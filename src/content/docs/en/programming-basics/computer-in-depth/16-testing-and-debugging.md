---
title: "Test behavior and locate a defect"
description: "Test behavior and locate a defect"
sidebar:
  order: 15
prev: {"link":"/en/programming-basics/computer-in-depth/09-git-debugging/","label":"Record file history and merge changes"}
next: {"link":"/en/programming-basics/computer-in-depth/04-tech-fields-ai-engineering-mindset/","label":"Technology fields, AI, and the engineering mindset"}
---

Testing compares behavior with its promise; Git records file history. Separate the jobs: write the expected result independently, run the case, and locate the first differing step.


## Evidence-based debugging

Reproduce with fixed input, state expected and actual behavior, find the last known-correct point, gather logs and debugger evidence, test one hypothesis at a time, fix the cause, and add a regression test. `git bisect` can binary-search history when a reliable pass/fail test exists.

## Test levels

Unit tests cover small logic, integration tests cover component boundaries, end-to-end tests cover user journeys, and regression tests preserve a previously failing case. A good test has controlled dependencies, a clear failure reason, and explicit arrange–act–assert structure.
