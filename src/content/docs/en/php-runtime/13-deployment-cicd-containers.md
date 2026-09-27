---
title: 13. Deployment, CI/CD, and containers
description: Reproducible artifacts, pipelines, health checks, migrations, zero-downtime rollout, and rollback.
sidebar:
  order: 13
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **Queue:** A line of background jobs waiting to be processed.
- **Worker:** A background process that takes jobs from a queue and runs them.


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

## Operational problem

<details><summary>Why does a successful image not guarantee a successful deployment?</summary><p>Runtime config, secrets, migrations, health checks, and rollback must also fit the real environment.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
docker compose config --quiet
~~~

**Success criterion:** Validation exits 0, then the container runs as non-root and readiness succeeds only after its dependencies are ready.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Build reproducible layered images with a minimal runtime and non-root user. Produce an SBOM, sign the artifact, and deploy by digest. Separate readiness from liveness, use canary or blue/green rollback, and deploy migrations with forward/backward compatibility.

### Try it yourself

Deploy a canary failing readiness and prove it receives no traffic.
