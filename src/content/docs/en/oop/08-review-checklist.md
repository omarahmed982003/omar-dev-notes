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

## Lesson-specific problems

<details><summary>What is the first question for a large class?</summary><p>Does it have one responsibility and reason to change, or mix storage, presentation, I/O, and business rules?</p></details>

<details><summary>How do you find a hidden dependency?</summary><p>Look for <code>new</code>, globals, time, or files inside logic and inject what must vary.</p></details>

## Cumulative project: testable checkout

Turn the combined exercise into a small collaboration of four boundaries:

- <code>Order</code> protects <code>draft → pending → paid</code> transitions and rejects a second payment.
- <code>Money</code> is a readonly value object that prevents currency mismatch and invalid addition.
- <code>PaymentGateway</code> and <code>OrderRepository</code> are contracts with test fakes.
- <code>CheckoutService</code> coordinates the use case without owning entity rules or constructing dependencies internally.

### Acceptance test

~~~text
given draft order total=2999 EGP
when fake gateway approves payment
then order status=paid
and repository saves once
and receipt total=2999 EGP
~~~

Add three failure tests: provider rejection, an already-paid order, and a <code>Money</code> value in another currency. “No exception” is not enough; assert final state and collaborator call counts.

### Severe design review

If a unit test unexpectedly requires a real database or network, review its boundaries. Integration tests deliberately exercise those dependencies and remain necessary. If <code>CheckoutService</code> repeatedly switches on concrete types, the contract does not express behavior. If callers can change order state directly, encapsulation is only cosmetic.


## Refactor the checkout in stages

Run `php checkout-lab.php` in the [downloadable lab](/en/php/00-lab-setup/). It prints `checkout: approval, decline, duplicate, currency = PASS`. Read the complete file in this order:

1. `Money` combines integer minor units with a currency. Its constructor rejects negative amounts and unsupported currencies; addition rejects mixed currencies and overflow. This example accepts EGP/USD only and does not convert exchange rates.
2. `Order` owns the transitions draft→pending→paid. An explicit decline returns pending→draft. Keeping status private prevents callers from marking an unpaid order paid by assignment.
3. `PaymentGateway`, `OrderRepository`, `Clock`, and `Notifier` describe the collaborators. Constructor injection supplies those objects explicitly; it is not a global service lookup.
4. `CheckoutService` coordinates the calls. `Receipt` records the result using immutable Money and DateTimeImmutable values. A fake gateway returns a controlled answer without a network request; a fixed clock makes the timestamp repeatable.
5. Tests inspect final state and call counts. A paid order is rejected before contacting the gateway again. A decline saves and notifies zero times. A different currency fails even when both numeric amounts are valid.

Start with a single checkout function, extract Money when currency/range rules repeat, then move state rules into Order. Introduce interfaces where a real dependency needs substitution. This gives each abstraction a reason instead of creating an interface for every class.

**Failure exercise:** What if the provider approves but repository save fails? A local unit test cannot make a remote charge atomic with your database. The teaching fake does not implement provider deduplication. A real integration needs a persisted pending attempt, a provider-supported idempotency key, reconciliation for unknown outcomes, and an outbox for notifications. Do not blindly reset an ambiguous timeout to draft and charge with a new key. Test those boundaries separately with the actual persistence and provider sandbox.
