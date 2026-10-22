---
title: "Test behavior and locate a defect"
description: "Test behavior and locate a defect"
sidebar:
  order: 14
prev: {"link":"/en/programming-basics/computer-in-depth/14-running-code/","label":"From solution steps to running code"}
next: false
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

## It ran, but did it meet the requirement?

If a grade of 50 should pass and your program prints “failed,” it is faulty even without an error message. A **test** compares actual behavior with an expected result derived from requirements, not copied from the implementation.

Start after [turning problems into steps](/en/programming-basics/computer-in-depth/14-running-code/). Paper reasoning is sufficient; the code is optional until initial PHP knowledge is available.

## Three kinds of faults

A **syntax error** violates a language's writing rules, such as a missing bracket. A **runtime error** occurs during execution, such as failing to open a required file.

A **logic error** produces behavior that contradicts the requirement even when execution continues normally. Using “greater than 50” instead of “at least 50” is one example.

## Debugging follows evidence

**Debugging** narrows down and corrects a fault using reproducible observations. Changing five things simultaneously does not identify a cause.

1. Fix the input and environment: grade 50 and the same program version.
2. Write the **expected** result: passed, from the requirement.
3. Record the **actual** result: failed.
4. Trace the first incorrect decision.
5. State one hypothesis: the comparison uses greater-than rather than at-least.
6. Change only that condition, then repeat boundary and other tests.

A **log** records execution events. A **debugger** can pause execution and inspect values and steps. Use them to collect evidence, not to flood records with user data.

Do not publish passwords, access keys, or personal files in fault reports. Redact sensitive values and retain the smallest input that reproduces the problem.

## Complete example: the passing boundary

In PHP, `$grade` stores the grade and `>` compares “greater than.” `?:` selects between two results; `echo` displays the result. This intentionally faulty example should be diagnosed before repair.

After configuring PHP, save a new practice file named `boundary-bug.php`:

```php
<?php
$grade = 50;
echo ($grade > 50 ? 'passed' : 'failed'), PHP_EOL;
```

The **faulty implementation** produces `failed`; the **requirement** expects `passed`. That comparison establishes the fault.

Trace 49, 50, and 51. Fifty exposes the difference because `50 > 50` is false. Replace the operator with `>=`, then expect failed, passed, and passed.

## A test also has structure

**Arrange–Act–Assert** means prepare the case, perform the action, and compare with the expected result. A good test makes failure understandable and avoids uncontrolled dependencies on networks or random timing.

A **regression test** preserves a case that revealed a fault, such as grade 50, so that reintroducing the fault becomes visible. Passing it does not prove the absence of all other faults.

| Type | Scope | Example |
|---|---|---|
| Unit test | Small isolated logic | Passing at grade 50 |
| Integration test | Collaboration between components | Actually writing and reading a file |
| End-to-end test | A complete user journey | Entering a grade on a page and seeing the result |
| Regression test | Previously failing behavior | Keeping the grade-50 test after repair |

A regression test can also be a unit test. These classifications describe different aspects rather than mutually exclusive boxes.

### A fault introduced by an earlier change

**Git** records file-change history; it does not determine correctness against requirements. After studying Git, `git bisect` can search between a good and bad **commit**, a recorded version of changes.

You still need a reliable test distinguishing good from bad. This command is optional and will not be run against your project here.

## Independent practice and fault report

Write five fields: requirement, input, expected result, actual result, and minimal reproduction steps. Use grade 50, then try -1 to determine whether range validation exists.

<details>
<summary>Review after attempting</summary>

Fifty should pass; failed with > identifies a boundary fault. Minus one tests a separate concern: the small example does not validate the range, so a complete application needs that validation.

Fixing the boundary does not complete the whole program. Retest the full agreement, including 0, 100, and 101.

</details>

## Summary and exit

Start with expected behavior, establish actual behavior, change one cause, and guard against recurrence. Version history and correctness solve different problems.

Before networking, complete the observation project in the [foundations guide](/en/programming-basics/computer-in-depth/). Writing new code is not required.
