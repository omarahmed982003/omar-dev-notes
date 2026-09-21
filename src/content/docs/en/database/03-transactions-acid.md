---
title: 3. Transactions and ACID
description: Auto-commit, commit, rollback, ACID, and safe multi-step operations.
sidebar:
  order: 3
---

A transaction prevents partially completed multi-step changes. Under normal auto-commit, each statement is independent until an explicit transaction begins.

ACID means atomicity (all or rollback), consistency (constraints/rules remain valid), isolation (concurrent work behaves according to the selected level), and durability (committed data survives under system guarantees).

```php
$pdo->beginTransaction();

try {
    $debit->execute(['amount' => $amount, 'id' => $from]);
    $credit->execute(['amount' => $amount, 'id' => $to]);
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}
```

For balance transfer, lock/check both accounts consistently and update both before commit. Exact locking syntax is database-specific. Keep transactions short; validate first and avoid waiting for external APIs or email while holding locks.

Database rollback cannot undo an already-sent email. Use a transactional outbox: store an event in the same transaction and publish it later.

Some databases implicitly commit DDL such as `CREATE TABLE` or `DROP TABLE`; never assume all schema changes roll back. Constraints remain necessary even inside transactions.

Oracle deserves the same warning: DML transactions provide ACID semantics, while DDL normally issues implicit commits before and after the statement. Do not mix schema changes into a business transaction expecting one rollback boundary.
