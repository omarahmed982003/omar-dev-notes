---
title: 17. Disaster recovery and restore testing
description: RPO, RTO, backups, restore order, runbooks, and practical recovery exercises.
sidebar:
  order: 17
---

## A backup is not a recovery plan

A backup is an artifact. Recovery defines what is restored, in which order, who decides, and how correctness is proven. An untested restore is only an assumption. Protect databases, uploaded files, critical configuration, and encryption keys through explicit policies.

## RPO and RTO

**RPO** is the maximum tolerable data-loss window; **RTO** is the maximum tolerable service-restoration time. They are business decisions that determine backup frequency, replication, automation, and cost. Replication is not backup because logical deletion or corruption can replicate immediately.

## Backup policy

Use encrypted copies, separate permissions, documented retention, and a copy outside the primary account or region. Verify checksums, alert on failed jobs, and ensure decryption keys remain available during a disaster without storing them beside the backup.

## Restore order

Declare the incident, stop or isolate damaging writes, select a recovery point, restore into a clean environment, apply only compatible migrations, verify counts and constraints, send traffic gradually, and compare actual recovery with the RPO and RTO targets.

## A real restore exercise

Restore periodically into an isolated environment. Disable production email and webhooks, use non-production credentials, run smoke and consistency checks, and time every step. A useful game day exposes missing permissions, keys, documentation, and manual dependencies before a real incident.

## PHP application behavior during recovery

Support a documented read-only mode when writes are unsafe. Do not run an old worker against a newer incompatible schema. Retain deployable artifacts, versioned non-secret configuration, and a compatibility map between application and database versions.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is replication not a backup?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Deletion, logical corruption, or ransomware changes may immediately propagate to replicas.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>How do RPO and RTO differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> RPO limits acceptable data loss; RTO limits restoration time.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>How is a successful restore proven?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Through consistency checks, constraints, counts, checksums, smoke tests, and business scenarios—not merely a running database.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>What is a recovery game day for?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It measures the plan and exposes missing permissions, dependencies, and manual steps before a real disaster.</div></details></section>
</div>
