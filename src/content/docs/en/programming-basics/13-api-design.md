---
title: "Designing data interfaces"
description: REST, RPC, GraphQL, resources, status codes, errors, pagination, versioning, and contracts.
sidebar:
  order: 29
prev: {"link":"/en/programming-basics/30-webhook-delivery/","label":"Receive a webhook and handle repeated delivery"}
next: {"link":"/en/programming-basics/16-http2-http3-quic/","label":"How HTTP/2 and HTTP/3 differ"}
---


## One product contract before interface styles

An **API, Application Programming Interface**, defines how programs request data or actions. Its **contract** specifies accepted requests and responses. Test this contract on8766 in the [lab](/en/programming-basics/32-local-network-lab/):

| Request | Status | Content |
|---|---|---|
| GET `/api/products/1` |200|numeric id, text name, numeric price20, currencyEGP|
| GET `/api/products/2` |404|error.code NOT_FOUND|
| GET `/api/products/abc` |400|error.code INVALID_ID|
| POST `/api/products/1` |405|Allow lists GET and HEAD|

GET requests reading; this route rejects POST processing. JSON fields have names and values like the earlier product object. Open the first URL, then run `curl.exe -i -X POST http://127.0.0.1:8766/api/products/1`; `-X` selects the method.

Write expectations before testing. Success includes field types and meaning, not only200. Creating products needs another input, validation, and authorization contract before comparing REST, RPC, and GraphQL.

## Before the details

A good API (Application Programming Interface, a defined contract for requesting data or actions from another component) is a contract clients can predict, not merely endpoints that work today. Design resources, statuses, errors, pagination, and compatibility before dependencies multiply.

An **API, Application Programming Interface**, is a contract another program can use. An **endpoint** combines an address and operation. A **contract** specifies inputs, types, results, and failures.

**CRUD (Create Read Update Delete, the four common data operations)** means Create, Read, Update, Delete. **REST, Representational State Transfer**, organizes around resources and constraints such as client/server separation and stateless requests; a JSON (JavaScript Object Notation, a text format for structured values and lists) endpoint alone does not establish all REST constraints. **RPC, Remote Procedure Call**, requests a named remote operation. **GraphQL** selects fields against a typed **schema**; a **resolver** retrieves a field, and complexity limits bound expensive queries.

## Choose a style for the problem

- **REST** models resources with HTTP (Hypertext Transfer Protocol, the rules for web requests and responses) semantics.
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

Problem Details standardizes HTTP error descriptions. In the example, type links to the error category, title summarizes it, and status matches the HTTP status. errors and request_id are extension fields for validation failures and request tracing. A stack trace lists execution locations; SQL is a database query language, not a suitable public error explanation.

## Pagination and filtering

Pagination divides results into pages; filtering selects records matching conditions. A cursor identifies a position under a stable order, such as date plus unique identifier. An offset counts skipped records. Validate cursor input and authorization; Base64 encoding does not make a cursor trustworthy.

Common statuses include 400 for malformed input, 401 for an authentication requirement, 403 for refusal, 404 for absence or deliberate concealment, 409 for conflict, and 422 for input that cannot be processed under validation rules. Define the precise contract.

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

## Practical problems

<details><summary>When should an API return <code>404</code> versus <code>403</code>?</summary><p>404 means no resource; 403 means it exists but access is denied. A security policy may deliberately use 404 to hide a sensitive resource.</p></details>

<details><summary>Why can cursor pagination be better than offset?</summary><p>It handles changing data and large skips better, but requires stable ordering and a tamper-resistant cursor.</p></details>

<details><summary>Does every change require a new API version?</summary><p>No. Compatible additions often do not; removing a field or changing its meaning requires an explicit version and migration plan.</p></details>

## Test retries and compatibility

**Backward compatible** means old clients continue working under their contract. **Deprecation** announces a transition before removal. **OpenAPI** describes API inputs and outputs in a machine-readable form.

An **Idempotency-Key** identifies a retryable operation. Bind it to the actor, operation, validated input, and saved result, and prevent concurrent duplicate execution. Retention time is part of the contract. **Rate limits** cap requests per interval; **quotas** cap total consumption. A 429 can include **Retry-After**, when to retry. **Observability** uses evidence such as logs and measurements to explain operation.

**Worked check:** Reusing the same key with a different body should produce a documented conflict, for example 409, rather than silently executing a new action. Also test that old clients tolerate an optional added field and do not rely on JSON field order.
