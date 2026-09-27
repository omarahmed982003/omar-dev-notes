---
title: 2. ORM and data-access patterns
description: Active Record, Data Mapper, relationships, N+1 queries, and abstraction limits.
sidebar:
  order: 2
---

## Beginner bridge

An ORM maps application objects to database operations, but it does not remove SQL costs or transactional boundaries. Every convenient property access can still become a query, and object graphs can hide large result sets.

Use repositories or query services to make important access patterns visible. Inspect generated SQL, count queries, and decide deliberately between lazy loading, eager loading, joins, and projections. The model used for writing a transaction does not have to be the best model for reading a report.

An ORM maps rows and relationships to objects. It reduces repetitive SQL but does not remove query cost or database semantics.

Active Record combines row state and persistence; Laravel Eloquent is a PHP example. It is convenient for CRUD but can couple domain and storage concerns.

Data Mapper keeps entities closer to domain logic while a mapper/repository handles persistence; Doctrine is a PHP example. It offers stronger separation with more concepts such as Unit of Work and Identity Map. Django is a Python comparison, not a PHP package.

Model one-to-one, one-to-many, and many-to-many relationships while preserving database foreign-key constraints. Configure cascades deliberately.

N+1 occurs when loading a relation triggers one query per parent. Use eager loading or a tailored join/select, but measure because eager-loading everything can over-fetch.

Never mass-assign raw `$_POST`; allow-list validated fields so attackers cannot set `is_admin`. Do not serialize entities containing hashes/secrets.

Use direct SQL or a query builder for complex reports, bulk operations, database-specific features, and measured hot paths. ORM, query builder, and PDO can coexist.

## Lesson-specific problems

<details><summary>What is the N+1 problem?</summary><p>One query loads a list and one more runs per item; use suitable eager loading or joins and monitor query count.</p></details>

<details><summary>Does an ORM remove the need to understand SQL?</summary><p>No. Query plans, indexes, transactions, and boundaries still determine correctness and performance.</p></details>

## Run and verify

The PDO model demonstrates N+1 with naive_queries=21 and batch_queries=2; it does not test a particular ORM’s lazy-loading behavior.

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php orm-query-lab.php
~~~

**Extended integration exercise target:** The query counter proves that loading 20 records does not issue 21 queries, and no lazy loading occurs after the unit of work closes.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.
