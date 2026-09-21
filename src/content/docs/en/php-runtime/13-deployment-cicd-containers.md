---
title: 13. Deployment, CI/CD, and containers
description: Reproducible artifacts, pipelines, health checks, migrations, zero-downtime rollout, and rollback.
sidebar:
  order: 13
---

## Reproducible artifact

Build once and promote the same artifact instead of resolving dependencies differently on every server:

```bash
composer install --no-dev --prefer-dist --no-interaction \
  --optimize-autoloader --classmap-authoritative
composer check-platform-reqs
```

Record commit and build IDs. Inject secrets at runtime, never into the image.

## Pipeline

```text
lint -> unit tests -> static analysis -> integration tests
-> dependency audit -> build artifact/image -> scan
-> deploy staging -> smoke test -> production -> verify
```

Fail closed when checks fail. Manual approval is not a substitute for repeatable verification.

## Containers and health

Use a small pinned image, explicit main process, non-root user, runtime config, stdout/stderr logs, resource limits, and graceful shutdown. Separate web and worker lifecycles.

Liveness asks whether a process should restart, readiness whether it can receive traffic, and startup whether warm-up is complete. Do not tie liveness to every external dependency and cause a restart storm.

## Safe rollout and schema changes

Use rolling or blue-green deployment. Follow Expand/Contract: add the new shape, deploy compatible code, backfill, switch reads, then remove the old shape later. Gracefully reload FPM and version queue payloads.

Rollback may not undo a destructive migration. Prepare roll-forward, backups, feature flags, and automatic success metrics, and rehearse the procedure.

