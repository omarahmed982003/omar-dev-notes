---
title: 4. Isolation, locking, and deadlocks
description: Concurrency anomalies, isolation levels, pessimistic/optimistic locking, retries, and savepoints.
sidebar:
  order: 4
---

## Beginner bridge

Concurrent transactions can each be locally correct and still produce a wrong combined result. Isolation describes which intermediate states one transaction may observe, while locks and multiversion techniques are mechanisms used to provide that behavior.

Start from the anomaly the business rule cannot tolerate: dirty read, non-repeatable read, phantom, or lost update. Then choose an isolation level and explicit locking strategy, keep a consistent lock order, and treat deadlock retry as a normal bounded path.

Transactions can overlap; isolation controls what each sees. Anomalies include dirty reads, non-repeatable reads, phantoms, lost updates, and write skew.

Levels commonly range from Read Uncommitted through Read Committed and Repeatable Read to Serializable. Exact MVCC and locking behavior differs across MySQL, PostgreSQL, and other systems; verify your database rather than relying on a generic table.

Pessimistic locking uses database-specific syntax such as `SELECT ... FOR UPDATE`. Good indexes keep the lock scope focused.

Optimistic locking updates only when a version matches:

```sql
UPDATE products
SET stock = :new_stock, version = version + 1
WHERE id = :id AND version = :old_version
```

Zero affected rows indicates a conflict.

Deadlocks are expected concurrency outcomes. Access resources in consistent order, keep transactions short, index queries, and use bounded retry with backoff/jitter for retryable errors. Make the operation idempotent or use an idempotency key.

PDO has no portable true nested transactions. Some databases support savepoints, but rolling back to one does not finish the outer transaction. Choose isolation from business invariants and combine it with constraints, atomic updates, and deliberate locking.

## Lesson-specific problems

<details><summary>Why does a deadlock occur?</summary><p>Transactions hold different resources and each waits for the other; keep lock order consistent and retry safely.</p></details>

<details><summary>Is the highest isolation always best?</summary><p>No. It prevents more anomalies but may increase waiting and conflicts; choose for the invariant and workload.</p></details>

## Run and verify

Two real processes compete on SQLite: one purchases and one rejects insufficient stock, leaving orders=1 stock=2. Test deadlocks and isolation separately on the production engine.

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php locking-lab.php
~~~

**Extended integration exercise target:** Two concurrent operations produce the expected final state without a lost update, and deadlock retry terminates within an explicit bound.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.
