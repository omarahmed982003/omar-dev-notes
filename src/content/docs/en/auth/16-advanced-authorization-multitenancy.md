---
title: 16. ABAC, ReBAC, and tenant isolation
description: Attribute and relationship policies, multi-tenant boundaries, deny-by-default decisions, and testing.
sidebar:
  order: 16
---

## Beyond RBAC

RBAC uses roles, ABAC uses subject/resource/context attributes, and ReBAC uses relationships such as owner, member, or manager. Adopt complexity only when it represents real policy.

Centralize decisions in policy objects or an authorization service. A UI may hide a button, but the server must authorize every HTTP, CLI, and queue path.

## Tenant isolation

Derive tenant context from trusted identity, not only request data. Enforce it in queries, cache keys, object paths, queue messages, search indexes, exports, and administrative tooling.

Shared database, schema-per-tenant, and database-per-tenant models have different isolation and operational trade-offs; none is secure automatically.

## Deny and test

Deny unknown actions by default. Define allow/deny precedence and record policy version plus an internal decision reason without exposing sensitive details.

Test same-tenant owners, unrelated users, cross-tenant ID collisions, privileged roles, missing resources, and every background path. Explicitly test IDOR by swapping identifiers.

## Reference

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

