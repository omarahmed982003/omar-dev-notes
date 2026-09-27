---
title: "SQL foundations before PDO and ORM"
description: "Tables, constraints, joins, grouping and safe changes."
sidebar:
  order: 0.5
---

Before PDO or an ORM, understand the question you ask the database. Build learners and attempts, then report every learner’s attempt count and average score, including learners with no attempts.

## Model two tables

A table contains rows with defined columns. A row represents one learner or one attempt. A primary key identifies a row; names are insufficient because two people can share a name. A foreign key links an attempt to an existing learner. This is a one-to-many relationship: one learner has many attempts, each attempt belongs to one learner.

`NOT NULL` requires a value, while `CHECK` enforces a rule such as a score from zero through 100. PHP validation provides a helpful message; database constraints also protect writes made by other programs.

## State the question before SQL

Start with all learners, attach their attempts, then summarize each learner’s group. `SELECT` chooses output columns; `FROM` selects the starting table. `LEFT JOIN` preserves learners without attempts, while `INNER JOIN` excludes them. `ON` states which rows match; `AS` provides a short table alias or a clear output name.

```sql
CREATE TABLE learners (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE attempts (
    id INTEGER PRIMARY KEY,
    learner_id INTEGER NOT NULL REFERENCES learners(id),
    score INTEGER NOT NULL CHECK(score BETWEEN 0 AND 100)
);
INSERT INTO learners VALUES (1, 'Omar'), (2, 'Mona'), (3, 'Ali');
INSERT INTO attempts VALUES (1, 1, 80), (2, 1, 100), (3, 2, 60);
SELECT l.id, l.name, COUNT(a.id) AS attempts, AVG(a.score) AS average
FROM learners AS l
LEFT JOIN attempts AS a ON a.learner_id = l.id
GROUP BY l.id, l.name
ORDER BY l.id;
```

Run the complete implementation with `php sql-foundations.php` in the [lab](/en/php/00-lab-setup/). It creates an in-memory SQLite database, enables foreign-key enforcement, executes the same SQL, and prints JSON. PDO is PHP’s database connection interface; the next lesson explains connection setup and prepared queries.

| Learner | Attempts | Average |
|---|---:|---:|
| Omar | 2 | 90 |
| Mona | 1 | 60 |
| Ali | 0 | NULL |

`GROUP BY` groups learner rows before `COUNT` and `AVG`. `COUNT(a.id)` ignores the missing attempt in a LEFT JOIN result; `COUNT(*)` would count Ali’s preserved row as one attempt. `AVG` ignores NULL and returns NULL, not zero, when no scores exist. `ORDER BY` guarantees the requested ordering; insertion order does not guarantee query output order.

## Filter and modify

`WHERE` filters rows before grouping; `HAVING` filters groups afterward. Add `HAVING AVG(a.score) > 70` after GROUP BY and before ORDER BY: only Omar remains. A WHERE condition on the optional table after LEFT JOIN can accidentally remove learners with no attempts.

`NULL` means missing or unknown. Test it with `IS NULL`, not `= NULL`: a comparison with NULL does not yield true, and WHERE retains only true conditions.

```sql
UPDATE attempts SET score = 85 WHERE id = 1;
DELETE FROM attempts WHERE id = 3;
```

Run these only after creating the tables. The first changes one attempt; the second deletes one. Before important mutations, inspect a SELECT using the same WHERE, and use a transaction when several changes must succeed together. Omitting WHERE can change every row. In application code, bind values through placeholders rather than concatenating user input into SQL.

## An index is not a correctness rule

An index is an extra structure that can speed up lookups at the cost of storage and writes. An index on `attempts(learner_id)` may help the join. A normal index does not prevent duplicates; UNIQUE enforces uniqueness according to the engine’s rules. Inspect the execution plan on realistic data before judging performance.

## Try and explain

Add a fourth learner without attempts: expect count zero and average NULL. Insert score 101 or `learner_id=999`: constraints reject both. Change LEFT JOIN to INNER JOIN: Ali disappears. Trace rows before joining, after joining, and after grouping instead of memorizing syntax.

SQLite makes this lab easy to run. Column types, foreign-key activation, identity syntax, locking, and isolation differ across engines; continue with PDO and transaction lessons before moving the example to MySQL or PostgreSQL.


[SQLite transactions](https://www.sqlite.org/lang_transaction.html)
