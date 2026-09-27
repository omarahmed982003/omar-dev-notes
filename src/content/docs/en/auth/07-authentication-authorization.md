---
title: 7. Authentication and authorization
description: Secure login, RBAC, ownership policies, IDOR prevention, and least privilege.
sidebar:
  order: 7
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **API:** A defined interface through which one program requests data or actions from another.
- **Session:** Temporary server-side state used to recognize a user across requests.
- **CLI:** A text-based interface controlled by typed commands.
- **Scope:** A named permission requested or granted to a client, such as orders:read; it does not by itself prove ownership of an order.
- **Function:** A named, reusable block of code with one defined job.


## Beginner bridge

Authentication establishes an identity claim; authorization evaluates whether that identity may perform one action on one resource in the current context. A successful login never implies universal access.

Place authorization at the resource boundary and evaluate ownership, tenant, role or policy, and action together. Hiding a button is user experience, not enforcement. Server-side checks must run for every route, API operation, background job, and indirect object reference.

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

## Security scenario

<details><summary>How do authentication and authorization differ?</summary><p>Authentication establishes identity; authorization decides allowed actions on a specific resource.</p></details>

## Threat drill

**Scenario:** An authenticated user changes a resource identifier to read another user’s invoice.

**Negative test:** Send the request as the owner, then as another authenticated account that does not own the resource.

**Expected result:** The owner succeeds; the other request returns 403 or policy-defined 404, independent of whether the UI hides the button.

### Verification source

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## Connect the ideas

Build an authorization matrix with actor, resource, action, context, and expected decision, then convert it into allow and deny tests. Generic middleware is insufficient when ownership changes inside a domain operation. Audit the decision and policy version without leaking resource data, and test direct object references.

### Try it yourself

Run the matrix through HTTP and a background job and prove identical decisions.
