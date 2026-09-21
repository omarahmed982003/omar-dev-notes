---
title: 4. Isolation, locking, and deadlocks
description: Concurrency anomalies, isolation levels, pessimistic/optimistic locking, retries, and savepoints.
sidebar:
  order: 4
---

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
