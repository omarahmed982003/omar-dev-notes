---
title: 1. PDO and prepared statements
description: PDO connections, error handling, prepared statements, fetching, and injection prevention.
sidebar:
  order: 1
---

## Beginner bridge

Treat a database connection as a boundary with two contracts: connection configuration and query execution. Configure the character set, exception mode, and fetch behavior explicitly so the same code does not change meaning across environments.

Prepared statements separate SQL structure from data values. They do not validate business rules and placeholders normally cannot represent table or column names. Dynamic identifiers must come from a small allowlist, while values should remain bound parameters.

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

## Lesson-specific problems

<details><summary>Why not rely on escaping instead of prepared statements?</summary><p>Prepared statements separate SQL structure from values; manual escaping is error-prone and context-sensitive.</p></details>

<details><summary>Can a parameter represent a table name?</summary><p>Normally no; placeholders represent values. Select identifiers from an allowlist.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php pdo-lab.php
~~~

**Success criterion:** Valid input succeeds, a value such as <code>1 OR 1=1</code> remains data rather than SQL, and only the expected row count is returned.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.
