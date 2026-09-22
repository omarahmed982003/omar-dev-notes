---
title: 1. PDO and prepared statements
description: PDO connections, error handling, prepared statements, fetching, and injection prevention.
sidebar:
  order: 1
---

PDO provides one interface for several database drivers, but SQL and capabilities remain driver-specific.

```php
$pdo = new PDO(
    'mysql:host=127.0.0.1;dbname=shop;charset=utf8mb4',
    getenv('DB_USER'),
    getenv('DB_PASSWORD'),
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
);
```

Keep credentials out of Git, specify charset in the DSN, and never expose exception details to users.

```php
$stmt = $pdo->prepare(
    'SELECT id, name FROM users
     WHERE email = :email AND status = :status'
);
$stmt->execute(['email' => $email, 'status' => 'active']);
$user = $stmt->fetch();
```

Placeholders separate values from SQL structure. They cannot represent table/column names, keywords, sort direction, or a whole `IN` list. Allow-list identifiers and create one placeholder per list value.

`fetch()` returns one row or false; `fetchAll()` may use substantial memory; `fetchColumn()` returns one column. `rowCount()` behavior for SELECT is driver-specific. Stream large results and select only needed columns.

`bindValue` binds the current value; `bindParam` binds a variable by reference. Passing an array to `execute` is often simplest. Log database details securely while returning a generic error and request ID.

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: PDO and prepared statements">
<p class="lesson-diagram-title">Concept map: PDO and prepared statements</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>PDO provides one interface for several database drivers,</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Keep credentials out of Git, specify charset in</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Placeholders separate values from SQL structure</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>fetch() returns one row or false; fetchAll() may</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>bindValue binds the current value; bindParam binds a</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “PDO provides one interface for several database drivers,” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> PDO provides one interface for several database drivers, but SQL and capabilities remain driver-specific. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “PDO provides one interface for several database drivers,” with “Keep credentials out of Git, specify charset in”. Why does neither replace the other in “PDO and prepared statements”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “PDO provides one interface for several database drivers,”: PDO provides one interface for several database drivers, but SQL and capabilities remain driver-specific. For “Keep credentials out of Git, specify charset in”: Keep credentials out of Git, specify charset in the DSN, and never expose exception details to users. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Placeholders separate values from SQL structure”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Placeholders separate values from SQL structure. They cannot represent table/column names, keywords, sort direction, or a whole IN list. Allow-list identifiers and create one placeholder per list value. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “fetch() returns one row or false; fetchAll() may” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> fetch() returns one row or false; fetchAll() may use substantial memory; fetchColumn() returns one column. rowCount() behavior for SELECT is driver-specific. Stream large results and select only needed columns. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
