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
