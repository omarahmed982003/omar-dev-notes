# PHP Runtime and production tools verification

Completed 2026-09-27.

## Changes

- Added a committed `composer.lock` to the PHP lab and changed Composer scripts to use `@php`.
- Added a runnable teaching deployment under `examples/php-labs/production`: Nginx, PHP-FPM, OPcache, explicit timeouts, bounded workers, non-root users, read-only filesystems, health checks, and private FPM diagnostic paths.
- Connected the Composer, FPM, FastCGI, CLI, deployment, and supply-chain lessons to concrete verification commands.
- Added the missing English examples so all 17 Arabic/English lesson pairs have the same fenced-language sequence, PHP-block count, and answered-exercise count.
- Corrected the FPM timeout explanation for work after `fastcgi_finish_request()`.
- Made Linux production `curl` commands use `/dev/null` and documented the Windows `NUL` alternative.
- Updated the track description to cover all 17 lessons.
- Expanded the archive generator and verifier to include lock, Compose, Dockerfile, INI, and server configuration files.

## Verified locally

- PHP 8.4.23: 82 commands passed through `scripts/verify-lesson-labs.py`.
- All PHP lab files passed syntax checks.
- 15 core tests passed, including validation, security, database constraints, idempotency, rollback, Unicode, CSV, and date behavior.
- Local HTTP client/server scenarios, concurrent SQLite workers, expected failure paths, configuration fail-fast, cache race model, queue idempotency, profiling fixture, and restore verification passed.
- `composer validate --strict`, `composer audit --locked`, `composer check-platform-reqs --lock --no-dev`, and the production-file Composer script passed.
- Arabic and English each contain 77 fenced examples, including 24 PHP blocks and 26 answered disclosures across the runtime track.
- All 48 PHP blocks across the two editions pass syntax checking.
- Built HTML verification covers 34 lesson pages, 154 rendered blocks, and 36 local links.
- The downloadable archive contains 52 files and is regenerated deterministically and compared byte-for-byte with eligible source files.
- Archive SHA-256: `07937DAD68EE75A742E432E329EDBC9486CFFD578B23C15EC33DCF2E42654E37`.
- The final Astro build completed with 388 pages. Its existing notices concern the home MDX directive, missing docs/404 content entry, and absent sitemap `site` setting.

## Verification boundary

Docker is not installed on this host. The verifier therefore checks required Compose hardening and file presence but could not run `docker compose config`, build the images, or start Nginx/PHP-FPM. When Docker is available, the verifier automatically runs the Compose configuration check. A release environment should additionally run:

```bash
docker compose -f examples/php-labs/production/compose.yaml config --quiet
docker compose -f examples/php-labs/production/compose.yaml up --build -d
curl -fsS http://127.0.0.1:8080/health
curl -fsS http://127.0.0.1:8080/
docker compose -f examples/php-labs/production/compose.yaml down
```

The Redis, queue-broker, OpenTelemetry exporter, TLS, load, and disaster-recovery exercises still require their real target services. The lessons and README label local deterministic models separately from those integration claims.
