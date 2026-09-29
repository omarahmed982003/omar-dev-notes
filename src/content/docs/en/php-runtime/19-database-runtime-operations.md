---
title: 19. Database connections and runtime operations
description: Connection budgets, PDO timeouts, persistent state, transactions, replicas, migrations, and failure readiness.
sidebar:
  order: 19
---

## Before you start

Schema and query design have their own track. This lesson focuses on the lifetime of a connection from a PHP worker to the database and on behavior during latency, failure, and deployment.

### New terms

- **Connection budget:** The database capacity allocated to each service.
- **Persistent connection:** A connection reused inside a PHP process.
- **Pooler:** A proxy managing a set of database connections.
- **Replica lag:** Delay between a read replica and the primary.

## Budget connections before adding workers

Six replicas with 30 FPM workers and one possible connection per worker can request 180 connections before queue workers, cron, and administration. Keep `pm.max_children` and autoscaling within the database budget.

~~~text
database budget
= web replicas × possible connections per replica
+ queue workers
+ scheduled jobs
+ administration reserve
~~~

Readiness can fail when the application cannot establish a required connection. Liveness should not restart every replica because of one shared database outage.

## PDO and deadlines

~~~php
$pdo = new PDO($dsn, $user, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_TIMEOUT => 2,
    PDO::ATTR_PERSISTENT => false,
]);
~~~

`ATTR_TIMEOUT` does not control every timeout for every driver. Configure connection, statement, and lock timeouts at the driver or server level and enforce an overall operation deadline. Never expose a DSN or exception trace to the client.

## Persistent connections

A persistent connection is cached per process, not pooled across every replica. It may retain session settings, temporary tables, locks, or transactions from a previous request. Enable it only after measuring connection cost and understanding driver cleanup. A dedicated pooler is often easier to govern centrally.

Every transaction must reach commit or rollback on a guaranteed path. Retry deadlocks or serialization failures with a limit and jitter only when the operation is idempotent.

## Read replicas

A read immediately following a primary write may see older data on a replica. Read-your-writes paths must use the primary or a supported consistency token. Monitor lag and stop routing critical reports to a replica beyond the accepted threshold.

## Migrations and deployment

Use Expand/Contract: add compatible structure, deploy code that understands both forms, backfill in bounded batches, then enforce constraints and remove old fields later. Monitor lock duration, transaction size, and replication delay.

## PostgreSQL lab

~~~bash
docker compose -f production/compose.yaml -f production/compose.full.yaml up --build -d
curl -fsS http://127.0.0.1:8080/database
docker compose -f production/compose.yaml -f production/compose.full.yaml exec postgres psql -U app -d app -c "select * from runtime_probe"
~~~

The HTTP and PostgreSQL `probe_key` values must match. Stop Postgres and verify that the endpoint returns 503 without credentials, then restart it and measure recovery.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><details><summary>Why can FPM consume more connections than expected?</summary><p>Every worker in every replica may hold a separate connection, in addition to workers and administration.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>What can persist on a persistent connection?</summary><p>A transaction, lock, temporary table, or connection-level setting can reach a later request.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>When is a deadlock retry valid?</summary><p>After rollback, with a bound and jitter, and only when the operation is safe to repeat.</p></details></section>
<section class="quiz-card" role="listitem"><details><summary>Why can a replica miss a recent write?</summary><p>Replication can be asynchronous and the replica may lag behind the primary.</p></details></section>
</div>

#### Practice cycle

Write your prediction before running the example and record the output. Introduce one controlled failure, collect evidence from logs or metrics, repair the cause, and rerun the check to prove the fix handles the fault instead of hiding it.


### Try it yourself

Predict peak connection use, observe it under a small load, lower the PostgreSQL connection limit until saturation occurs, then repair the FPM and worker budget instead of adding unlimited retries.
