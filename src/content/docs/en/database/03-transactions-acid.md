---
title: 3. Transactions and ACID
description: Auto-commit, commit, rollback, ACID, and safe multi-step operations.
sidebar:
  order: 3
---

## Beginner bridge

A transaction protects one database invariant across several statements. Commit makes the group durable; rollback discards the group when a required step fails. Atomicity does not mean that emails, HTTP calls, or another independent database automatically roll back with it.

Write the invariant first, keep the transaction short, and include every dependent database change. For external effects, store an outbox event in the same transaction and deliver it later with idempotent processing.

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

## Lesson-specific problems

<details><summary>When should a transaction roll back?</summary><p>When any step within one invariant fails, preventing partial writes.</p></details>

<details><summary>Does a database transaction make an API call atomic?</summary><p>No. The database cannot normally roll back another service; use an outbox or failure-aware workflow.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php transaction-lab.php
~~~

**Success criterion:** On success every required table changes; on a mid-operation exception none changes. Repeat after a simulated connection loss.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.
