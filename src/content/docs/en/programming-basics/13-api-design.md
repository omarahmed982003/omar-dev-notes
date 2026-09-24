---
title: 12. API design
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

## Lesson map

<div class="lesson-diagram" role="img" aria-label="Concept map: API design">
<p class="lesson-diagram-title">Concept map: API design</p>
<div class="diagram-flow">
<div class="diagram-node input"><span>Choose a style for the problem</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Resources and HTTP</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node process"><span>Validation and Problem Details</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node decision"><span>Pagination and filtering</span></div>
<span class="diagram-arrow" aria-hidden="true">→</span>
<div class="diagram-node output"><span>Compatibility and versions</span></div>
</div>
</div>

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">01</span><p>Explain “Choose a style for the problem” as if reviewing a real implementation. What is its goal and most important constraint?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> REST models resources with HTTP semantics. RPC exposes explicit operations such as calculateShipping. GraphQL lets clients select fields through a schema, but needs complexity controls and resolver-level authorization. A label does not guarantee quality. Clear contracts, compatibility, security, and observability matter more. In practice, a successful happy path is insufficient: document assumptions and validate the values and states that can break this behavior.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">02</span><p>Compare “Choose a style for the problem” with “Resources and HTTP”. Why does neither replace the other in “API design”?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> For “Choose a style for the problem”: REST models resources with HTTP semantics. RPC exposes explicit operations such as calculateShipping. GraphQL lets clients select fields through a schema, but needs complexity controls and resolver-level authorization. A label does not guarantee quality. Clear contracts, compatibility, security, and observability matter more. For “Resources and HTTP”: Use consistent nouns. Return 201 and Location for creation, 204 when no body is needed, and distinguish authentication, permission, absence, conflict, and validation failures instead of returning 200 for everything. The first covers one part of the design while the second completes the behavior or constraints required for a correct implementation.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">03</span><p>Assume a system ignores “Validation and Problem Details”. What failure or risk should you expect, and how would a test expose it?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Keep a stable error shape and never expose stack traces or SQL. Test a valid path, an exact boundary, and invalid input, then inspect output, side effects, and logs rather than treating the absence of an exception as success.</div></details>
</section>
<section class="quiz-card" role="listitem">
<div class="quiz-question-row"><span class="quiz-number">04</span><p>Turn “Pagination and filtering” into a reviewable engineering decision. What should be documented and tested?</p></div>
<details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Explained answer:</strong> Set a maximum page size. Cursor pagination usually behaves better for large changing datasets; offset pagination is simpler for limited navigation. Record the rationale, alternatives, and limits; test normal behavior, minimum and maximum boundaries, partial failure, and retry or repetition when applicable.</div></details>
</section>
</div>
