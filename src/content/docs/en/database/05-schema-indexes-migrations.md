---
title: 5. Schema, indexes, and migrations
description: Types, constraints, relationships, composite indexes, query plans, pagination, and safe schema change.
sidebar:
  order: 5
---

## Beginner bridge

A schema is an executable statement of allowed data: types, nullability, keys, uniqueness, and relationships. Application validation improves messages, while database constraints protect every writer, including scripts and future services.

Indexes are workload-specific copies that accelerate selected reads at the cost of space and write work. Migrations must remain compatible with old and new application versions during deployment; use expand, migrate data, switch readers and writers, then contract in a later release.

Protect invariants in the database as well as application code. Use `NOT NULL`, `UNIQUE`, `CHECK`, foreign keys, and appropriate types. Store money as integer minor units or an appropriate decimal type, not binary float; define a timezone policy.

Indexes speed lookup, join, and ordering at the cost of storage and write work:

```sql
CREATE INDEX idx_orders_user_status_created
ON orders (user_id, status, created_at);
```

Column order matters. Indexes must be chosen for measured query patterns, not added to every column.

Use `EXPLAIN` and, when supported, actual-analysis plans. Test production-like volumes and monitor slow queries and latency percentiles. Watch for N+1, unnecessary `SELECT *`, deep OFFSET pagination, casts/functions blocking indexes, and excessive round trips.

Keyset pagination often scales better:

```sql
SELECT *
FROM orders
WHERE id < :last_seen_id
ORDER BY id DESC
LIMIT 20
```

Migrations should be versioned, reviewed, automated, and tested with realistic data. Back up and test restoration, monitor locks, separate heavy backfills, and do not assume DDL rollback. Expand/contract deployments add compatible structure, migrate readers/writers and data, then remove old structure later.

Keep schema migrations distinct from development/reference seeds, make seeds idempotent, and never copy production personal data into fixtures.

## Lesson-specific problems

<details><summary>Why not index every column?</summary><p>Indexes consume space and slow writes; design for real queries and inspect execution plans.</p></details>

<details><summary>How do you deploy a risky migration safely?</summary><p>Use expand/migrate/contract: add compatible structure, move data, update code, and remove old structure later.</p></details>

## Cumulative project: inventory that cannot oversell

Design <code>products</code>, <code>orders</code>, and <code>order_items</code>, then implement one purchase transaction through PDO. The database must protect rules that remain true even when application code is wrong: positive quantities, valid foreign keys, and unique order identifiers.

### Concurrent scenario

1. Begin a transaction and read the product row using the lock appropriate for your engine.
2. Reject the operation when stock is below requested quantity.
3. Create the order and its items, update stock, and commit.
4. Roll back every change on failure; never leave an empty order or a deduction without an order.

### Deterministic verification data

~~~text
initial_stock=5
buyer_A_requests=4
buyer_B_requests=4
expected_successes=1
expected_final_stock=1
expected_negative_stock_rows=0
~~~

Run both purchases concurrently several times. Two successes or negative stock proves a real race condition, not a cosmetic test failure.

### Measure the index and migration

Save <code>EXPLAIN</code> output for lookup by <code>user_id, created_at</code> before and after the index, recording estimated or examined rows instead of claiming it “became faster.” Apply the migration through expand/migrate/contract: add compatible structure, backfill in resumable batches, switch reads and writes, and defer old-field removal to a later release after proving it is unused.

### Acceptance criteria

- Every client value is passed as a prepared parameter.
- Integration tests prove commit, rollback, and the two-buyer race.
- Constraints reject impossible states inside the database.
- A rollback or roll-forward plan exists, and backup restoration is tested rather than assumed.
