---
title: 16. ABAC, ReBAC, and tenant isolation
description: Attribute and relationship policies, multi-tenant boundaries, deny-by-default decisions, and testing.
sidebar:
  order: 16
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **HTTP:** The rules used to exchange requests and responses on the web.
- **Cache:** A temporary copy that reduces waiting and repeated work.
- **Queue:** A line of background jobs waiting to be processed.
- **CLI:** A text-based interface controlled by typed commands.


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

## Security scenario

<details><summary>Where must a tenant boundary be enforced?</summary><p>In every query, cache key, job, and object path, preferably with a data-layer control that cannot be forgotten.</p></details>

## Threat drill

**Scenario:** A user from tenant A supplies tenant B’s identifier in the route or request body.

**Negative test:** Repeat both read and write requests with a valid resource identifier owned by another tenant.

**Expected result:** No data is returned and no update occurs; tenant context comes from trusted identity and is enforced inside the query.

### Verification source

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## Connect the ideas

A policy engine needs versioned policy, explainable decisions, and cache invalidation when relationships or roles change. Model hierarchies explicitly rather than scattering conditions. Derive tenant from trusted identity and enforce it in queries, storage keys, cache keys, and logs, including side-channel tests for counts, timing, and 404 behavior.

### Try it yourself

Change a relationship while authorization is cached and prove the old decision disappears.
