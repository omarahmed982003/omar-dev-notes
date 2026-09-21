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
