---
title: 8. OOP review checklist
description: A practical review checklist and exercise covering encapsulation, interfaces, composition, DI, and tests.
sidebar:
  order: 8
---

# OOP review checklist

- Does each class have a clear domain responsibility?
- Does its constructor produce a valid object?
- Are members given the narrowest useful visibility?
- Is inheritance a true is-a relationship, or is composition clearer?
- Is each interface small and required by its consumer?
- Do traits stay cohesive and avoid hidden dependencies?
- Will static state harm tests or long-running workers?
- Does readonly provide the depth of immutability required?
- Do magic methods improve the API or hide mistakes?
- Are collaborators explicit and replaceable in tests?

## Combined exercise

Design a checkout where Order protects its state, PaymentGateway is replaceable with a fake, Money and Receipt are readonly value objects, and OrderService receives gateway/repository/clock through dependency injection. Add notification through composition and test success, provider failure, and already-paid orders.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: OOP review checklist">
<p class="lesson-diagram-title">Concept map: OOP review checklist</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Combined exercise</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Does each class have a clear domain responsibility</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>interfaces</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>composition</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Combined exercise” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Design a checkout where Order protects its state, PaymentGateway is replaceable with a fake, Money and Receipt are readonly value objects, and OrderService receives gateway/repository/clock through dependency injection. Add notification through composition and test success, provider failure, and already-paid orders. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Combined exercise” with “Does each class have a clear domain responsibility”. Why does neither replace the other in “OOP review checklist”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Combined exercise”: Design a checkout where Order protects its state, PaymentGateway is replaceable with a fake, Money and Receipt are readonly value objects, and OrderService receives gateway/repository/clock through dependency injection. Add notification through composition and test success, provider failure, and already-paid orders. For “Does each class have a clear domain responsibility”: Does each class have a clear domain responsibility? Does its constructor produce a valid object? Are members given the narrowest useful visibility? Is inheritance a true is-a relationship, or is composition clearer? Is each interface small and required by its consumer? Do traits stay cohesive and avoid hidden dependencies? Will static state harm tests or long-running workers? Does readonly provide the depth of… The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “interfaces”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A practical review checklist and exercise covering encapsulation, interfaces, composition, DI, and tests. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “composition” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> A practical review checklist and exercise covering encapsulation, interfaces, composition, DI, and tests. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
