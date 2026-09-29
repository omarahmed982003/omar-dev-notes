# PHP Runtime expansion verification

Date: 2026-09-27

## Delivered

- Expanded the bilingual PHP Runtime & Production path from 17 to 20 lessons.
- Added sessions and shared state, database connection operations, and long-running PHP worker runtimes.
- Deepened PHP upgrades and extension ABI, production error handling, contract/integration and mutation testing, CI/CD and resource limits, supply-chain provenance, real OpenTelemetry, and systemd hardening.
- Added a five-step practice cycle to every lesson in Arabic and English.
- Expanded the production lab with Redis sessions, PostgreSQL, a Redis-backed queue worker, OpenTelemetry SDK + OTLP Collector, a load probe, and a long-running-state leakage check.
- Updated Composer dependencies and lock file, verification automation, the deterministic downloadable archive, and bilingual indexes.

## Content measurements

- Arabic: 20 lessons, 14,400 whitespace-delimited words, 95 fenced blocks, 38 answer details.
- English: 20 lessons, 14,719 whitespace-delimited words, 95 fenced blocks, 38 answer details.
- Every numbered lesson contains the practice cycle.
- Arabic and English lesson filenames, fenced block languages, PHP-block counts, and answer-detail counts match.

## Verification

- `scripts/verify-lesson-labs.py`: 92 commands passed on PHP 8.4.
- Composer validate, audit, platform requirements, and production fixture checks passed.
- OpenTelemetry SDK produced a real nonzero trace ID through its console exporter.
- Astro production build passed with 394 generated pages and 413 indexed HTML files.
- `git diff --check` reported no whitespace errors; only the repository's Windows line-ending notices.
- The regenerated `php-labs.zip` contains 63 files. SHA-256: `BA3454EBCFDF7257412D5BC13ECE1CCAF2839860B5BE10ED843D43F106AA663D`.

## Environment limitation

Docker CLI is unavailable on this host. Both Compose files and the Collector configuration receive static invariant checks, and the base/full Compose commands are documented, but container image build, service startup, Redis/PostgreSQL outage drills, and OTLP delivery to the Collector could not be executed here.
