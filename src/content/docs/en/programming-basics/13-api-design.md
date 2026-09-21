---
title: 13. API design
description: REST, RPC, GraphQL, resources, status codes, errors, pagination, versioning, and contracts.
sidebar:
  order: 13
---

## Choose a style for the problem

- **REST** models resources with HTTP semantics.
- **RPC** exposes explicit operations such as `calculateShipping`.
- **GraphQL** lets clients select fields through a schema, but needs complexity controls and resolver-level authorization.

A label does not guarantee quality. Clear contracts, compatibility, security, and observability matter more.

## Resources and HTTP

```text
GET    /api/orders/42
POST   /api/orders
PATCH  /api/orders/42
DELETE /api/orders/42
```

Use consistent nouns. Return `201` and `Location` for creation, `204` when no body is needed, and distinguish authentication, permission, absence, conflict, and validation failures instead of returning `200` for everything.

## Validation and Problem Details

```json
{
  "type": "https://docs.example/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "errors": {"email": ["Invalid format"]},
  "request_id": "req_01J..."
}
```

Keep a stable error shape and never expose stack traces or SQL.

## Pagination and filtering

```text
GET /api/orders?status=paid&limit=20&cursor=eyJpZCI6OTAwfQ
```

Set a maximum page size. Cursor pagination usually behaves better for large changing datasets; offset pagination is simpler for limited navigation.

## Compatibility and versions

- Prefer backward-compatible additions.
- Never silently change an existing field's meaning.
- Announce deprecation and removal dates.
- Contract-test consumers.
- Path or header versioning can work; consistency matters most.

## Contract and operations

Publish a testable OpenAPI/schema contract. Include authentication, rate limits, idempotency, request IDs, timeouts, and observability. Design for partial failure and retries, not only the happy path.

## References

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)

