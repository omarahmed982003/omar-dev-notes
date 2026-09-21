---
title: 2. ORM and data-access patterns
description: Active Record, Data Mapper, relationships, N+1 queries, and abstraction limits.
sidebar:
  order: 2
---

An ORM maps rows and relationships to objects. It reduces repetitive SQL but does not remove query cost or database semantics.

Active Record combines row state and persistence; Laravel Eloquent is a PHP example. It is convenient for CRUD but can couple domain and storage concerns.

Data Mapper keeps entities closer to domain logic while a mapper/repository handles persistence; Doctrine is a PHP example. It offers stronger separation with more concepts such as Unit of Work and Identity Map. Django is a Python comparison, not a PHP package.

Model one-to-one, one-to-many, and many-to-many relationships while preserving database foreign-key constraints. Configure cascades deliberately.

N+1 occurs when loading a relation triggers one query per parent. Use eager loading or a tailored join/select, but measure because eager-loading everything can over-fetch.

Never mass-assign raw `$_POST`; allow-list validated fields so attackers cannot set `is_admin`. Do not serialize entities containing hashes/secrets.

Use direct SQL or a query builder for complex reports, bulk operations, database-specific features, and measured hot paths. ORM, query builder, and PDO can coexist.
