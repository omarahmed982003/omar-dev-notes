---
title: 7. Authentication and authorization
description: Secure login, RBAC, ownership policies, IDOR prevention, and least privilege.
sidebar:
  order: 7
---

Authentication asks who the user is; authorization asks whether that identity may perform this action on this resource; auditing records what happened. Login success never grants universal access, and hiding a UI button is not authorization.

A login flow validates input, loads the account, verifies the password, applies rate/risk controls, regenerates the session ID, stores minimal identity state, and redirects. Return generic credential errors and never log passwords or tokens.

RBAC handles broad roles. Ownership and policy checks remain necessary:

```php
function canUpdatePost(array $user, array $post): bool
{
    return $user['role'] === 'admin'
        || ($user['role'] === 'editor'
            && $post['author_id'] === $user['id']);
}
```

Where suitable, scope the query itself:

```sql
SELECT * FROM posts
WHERE id = :post_id AND author_id = :user_id
```

This helps prevent IDOR/BOLA. Middleware may enforce authentication and broad permission, while domain rules must still apply to HTTP, CLI, and queued jobs.

Use 401 for missing/invalid authentication, 403 for authenticated but forbidden, and sometimes 404 to conceal a resource’s existence. Deny by default, apply least privilege, use MFA/step-up auth for sensitive actions, revoke sessions after security changes, protect audit logs, and test cross-user resource access.
