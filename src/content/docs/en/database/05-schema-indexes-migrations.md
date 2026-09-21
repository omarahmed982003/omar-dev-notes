---
title: 5. Schema, indexes, and migrations
description: Types, constraints, relationships, composite indexes, query plans, pagination, and safe schema change.
sidebar:
  order: 5
---

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
