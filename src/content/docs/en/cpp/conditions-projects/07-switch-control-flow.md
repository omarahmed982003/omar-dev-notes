---
title: "10. switch, control flow, and a calculator"
sidebar:
  order: 10
description: "switch selects a branch from one discrete value. Use it for clear constant cases; prefer if for ranges and compound predicates."
tableOfContents: true
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **Scope:** The region of code in which a name or variable is visible.


## Selection by one discrete value

switch selects a branch from one discrete value. Use it for clear constant cases; prefer if for ranges and compound predicates.

## selector, case, break, and default

- Case labels must be unique compile-time constants compatible with the selector.
- break prevents execution from falling into the next case.
- default handles unmatched values.
- Grouped cases are useful when several values share behavior.
- Intentional fall-through should be explicit, optionally with [[fallthrough]].
- Use braces around a case body when local declarations need scope.

## Example: a command menu

```cpp
switch (choice) {
case 1: runReport(); break;
case 2: saveFile(); break;
case 0: std::cout << "Bye\n"; break;
default: std::cout << "Unknown option\n";
}
```

## Range and fall-through mistakes

- `switch` cannot directly express `score >= 50`.
- A missing break may execute multiple cases.

<div class="lesson-diagram" role="img" aria-label="How switch selects a case and break prevents fall-through">
<p class="lesson-diagram-title">How switch selects a case and break prevents fall-through</p>
<div class="diagram-flow diagram-decision">
<div class="diagram-node input"><span>Selector</span></div>
<span class="diagram-arrow" data-label="compare" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Match case</span></div>
<span class="diagram-arrow" data-label="matched" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Run case</span></div>
<span class="diagram-arrow" data-label="after body" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>break?</span></div>
<span class="diagram-arrow" data-label="yes" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Exit / default</span></div>
</div>
<div class="diagram-branches">
<p class="diagram-branch-label">Branches omitted by a purely linear picture</p>
<div class="diagram-node output"><span>No matching case ← default</span></div>
<div class="diagram-node danger"><span>No break ← fall through to next case</span></div>
</div>
</div>

## Selector limits and a safe calculator

The selector may use integral types, `char`, or an enumeration. It cannot directly use `double` or `std::string`, and each `case` must be a distinct constant expression. Group labels that share behavior, mark intentional continuation with `[[fallthrough]]`, and use braces around case-local variables.

In a calculator, `switch` selects `+`, `-`, `*`, or `/`, while a nested `if` rejects a zero divisor. This illustrates the rule: use `switch` for one discrete selector and `if` for ranges or compound predicates.

## How switch executes a decision

The program evaluates the `switch` expression once, converts the result when required, and jumps to the matching label. A `case` is an entry point, not a predicate that gets checked again after execution has entered the statement.

```cpp
char action{'P'};

switch (action) {
case 'R':
    std::cout << "Registration\n";
    break;
case 'P':
    std::cout << "Payment\n";
    break;
case 'S':
    std::cout << "Status\n";
    break;
default:
    std::cout << "Unknown action\n";
}
```

The selector is `'P'`, so execution starts in the payment case and `break` transfers control past the `switch`.

## Selector types

| Type | Directly valid? | Notes |
| --- | --- | --- |
| `char` and integral types | Yes | Common for command characters and menu numbers |
| `bool` | Technically yes | An `if` is usually clearer for two outcomes |
| `enum` and `enum class` | Yes | Useful for named application states after input parsing |
| `float` and `double` | No | Floating-point values are not switch selectors |
| `std::string` | No | Use `if`, a lookup table, or parse the text into an enum |

A class with a suitable conversion may also qualify, but an implicit conversion can hide the meaning of the decision. Prefer an explicit selector type.

## Case labels are unique constant expressions

Each label must be an integral constant expression available at compile time and must remain unique after conversion to the selector type.

```cpp
constexpr int registerCode = 1;
constexpr int reportCode = 1 + 1;

int choice{};
std::cin >> choice;

switch (choice) {
case registerCode:
    std::cout << "Register\n";
    break;
case reportCode:
    std::cout << "Report\n";
    break;
}
```

These examples are invalid:

```cpp
// case choice:       // runtime value
// case choice > 2:   // predicate, not a discrete value
// case 2:            // duplicate when reportCode is already 2
```

`constexpr` states the compile-time intention directly. A `const int` may satisfy the constant-expression rules in some contexts, but `constexpr` is clearer here.

## Trace fall-through precisely

```cpp
int choice{1};

switch (choice) {
case 1:
    std::cout << "One\n";
case 2:
    std::cout << "Two\n";
    break;
default:
    std::cout << "Other\n";
}
```

The program prints `One`, continues forward because no `break` follows it, then prints `Two`. It does not compare the selector with `2` again. Use `[[fallthrough]];` in C++17 or later when continuation between nonempty case bodies is intentional. Consecutive empty labels such as `'Y'` and `'y'` simply group several values onto one body.

## default and unmatched input

`default` is optional. Without it, an unmatched selector executes no case body. It may appear in any position, but placing it last is easier to read. A `default` in the middle can fall through into a later case if control reaches it and no statement stops execution.

## Complete calculator with input validation

```cpp
#include <iostream>

int main() {
    double left{}, right{};
    char operation{};

    std::cout << "Enter: number operator number: ";
    if (!(std::cin >> left >> operation >> right)) {
        std::cerr << "Invalid input\n";
        return 1;
    }

    switch (operation) {
    case '+':
        std::cout << "Result: " << left + right << '\n';
        break;
    case '-':
        std::cout << "Result: " << left - right << '\n';
        break;
    case '*':
        std::cout << "Result: " << left * right << '\n';
        break;
    case '/':
        if (right == 0.0) {
            std::cerr << "Cannot divide by zero\n";
            return 1;
        }
        std::cout << "Result: " << left / right << '\n';
        break;
    default:
        std::cerr << "Unsupported operator\n";
        return 1;
    }
}
```

Test `8 / 2`, `8 / 0`, `5 * 3`, and `5 ? 3`. These cover successful division, the zero-divisor rule, a normal operation, and `default`. Stream validation must happen before the `switch`; control flow cannot repair a failed extraction.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Why can switch not directly express score&gt;=50?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Case labels match discrete constants, not ranges or comparison expressions; use if/else for ranges.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>What happens when break is omitted?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Execution continues through later cases until a break or the switch ends; this may be a bug or documented fall-through.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>When should several cases be grouped?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> When multiple selector values intentionally share the same behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Why add braces around a case with local variables?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> They create a clear scope and avoid jumping across a variable initialization between labels.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">05</span><p>After entering case 1 without a break, does the program compare the selector with case 2 again?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> No. Once execution jumps to a matching label, it continues forward until a break, return, or the end of the switch.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">06</span><p>Why does the calculator use switch for the operation but if inside division?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> The operator is one discrete character, while rejecting a zero divisor is a runtime predicate, so each construct matches a different kind of decision.</div></details>
</section>
</div>

## Connect the ideas

C++17 permits an init-statement before the selector to narrow scope. With enum class, enable warnings for unhandled cases and decide whether default is appropriate: omitting it can expose new enum values, while external input still needs validation and fallback.

### Try it yourself

Add an enum value and confirm the build or a test exposes an incomplete switch.
