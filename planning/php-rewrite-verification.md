# PHP lessons 5–17: rewrite verification

Completed 2026-09-27. The Git working tree was clean at the initial check.

## Scope

- Rewrote lessons 5–17 in Arabic and English: 26 lesson pages, with equivalent examples, outputs, concepts, and exercises.
- Updated both PHP track indexes and retained all existing lesson URLs and ordering. Lessons 1–4 and the original setup lab remain unchanged.
- Each language contains 55 answered exercises across these lessons. Automated parity checks compare every fenced block and exercise count; prose equivalence was handled during the paired rewrite, not inferred from character ratios.
- Added complete downloadable examples, a PSR-4 Composer project, HTTP and session/upload demos, and a cumulative notebook application.
- The notebook combines validation, CSRF, sessions, private per-session file storage, routing, output escaping, flash messages, and Post/Redirect/Get. It is a local teaching application, not an account system or crash-durable database.

## Verification evidence

| Check | Result |
|---|---|
| PHP syntax in both lesson editions | 106 PHP blocks passed lint |
| Executed programs with fixed expected output | 40 matched |
| Bilingual parity | 13 lesson pairs; identical fenced code/output and matching exercise counts |
| Live HTTP checks | 143 assertions passed across API, session, upload, and notebook flows |
| Standalone notebook suite | 15 checks passed after the final storage changes |
| Composer demo | Printed 4500 |
| PHPUnit on actual PHP 8.3.32 | 5 tests, 5 assertions passed |
| PHPStan | Level 6, no errors |
| PHP-CS-Fixer | PSR-12 dry run, no changes needed |
| Composer audit | No security advisories at verification time |
| Composer platform requirements | Passed on actual PHP 8.3.32 |
| Composer validation | Passed without publish checks; advisory about missing license metadata remains |
| Built lesson content | 26 pages, 208 fenced blocks, 110 exercise disclosures, 50 local links checked |
| Copy buttons | Copied text matches displayed code; filename comments rendered as titles are checked explicitly |
| Download ZIP | 62 files independently opened with .NET ZipFile and compared byte-for-byte against source |
| Astro production build | Passed: 388 pages, 36.31 seconds |
| Git whitespace check | Passed; lessons 1–4 unchanged |

Machine-readable results:

- [PHP and HTTP checks](audit-results/php-course-checks.json)
- [Rendered content and counts](audit-results/php-course-render-checks.json)

The 143 HTTP assertions include multiple assertions within scenarios; they are not 143 distinct user journeys. Covered cases include invalid JSON and form input, size/type limits, 404/405 and Allow headers, CSRF, separate browser sessions, one-time flash messages, PRG, actual multipart uploads, Unicode boundaries, escaped hostile text, a 100-note limit, and corrupt/unreadable/unwritable storage error paths.

## Runtime and reproduction

Verification used PHP 8.4.23 for the common examples and HTTP flows, PHP 8.5.8 for the PHP 8.5 syntax examples, and PHP 8.3.32 for the Composer project's minimum supported minor release. Required extensions include mbstring, intl, and fileinfo as specified by the relevant lessons.

Run from the repository root:

~~~sh
node scripts/export-php-course.mjs
node scripts/package-php-course.mjs
node scripts/verify-php-course.mjs
php examples/php-course/notebook/tests.php
npm run build
node scripts/verify-php-course-render.mjs
git diff --check
~~~

The executable verifier defaults to php on PATH. Use PHP_BINARY to select the main interpreter (PHP 8.4+ for all common examples) and PHP85_BINARY for a separate PHP 8.5+ interpreter; otherwise both use php, which must then be 8.5+. These are environment variables, not personal paths committed to the repository. It creates its temporary directory, starts PHP development servers bound to 127.0.0.1, exercises them, and closes the servers in cleanup.

From examples/php-course/composer-demo, using PHP 8.3+ and Composer 2:

~~~sh
composer install
composer demo
composer check
composer audit
composer check-platform-reqs
composer validate --no-check-publish
~~~

composer.lock is included; vendor, caches, generated storage, and user data are excluded. Composer scripts use @php so the tools run with the same PHP interpreter as Composer.

Download: [php-course.zip](../public/downloads/php-course.zip)

SHA-256: F259859C4D339C66FAEB57B2AE03C727CCB6A512D725FBE762DCADE2C2AA57CF

## Navigation and counting

Starlight already generates the PHP sidebar from the php content directory, and the homepage already counts eligible content files. No configuration change was needed. The final Arabic and English homepage cards both display 18 PHP pages: the setup lab plus 17 numbered lessons.

Using the homepage's existing inclusion/exclusion rules, the current count is 174 pages per language across seven tracks. No new numbered PHP lesson was added.

## Verification boundaries and build notices

- Xdebug installation, breakpoint configuration, call-stack inspection, and development/production guidance are documented against the official documentation. Xdebug is not installed in the available runtimes, so an interactive debugger attachment was not tested.
- The render verification checks built HTML, exact code/copy text, exercise elements, and local links. It does not claim a browser screenshot or a complete accessibility audit.
- The final build emitted notices about the existing home MDX use astro:head-inject directive, a missing docs/404 entry, and the sitemap integration lacking a site option. These files/settings were outside this rewrite.
- A Composer license metadata recommendation remains because this task did not choose or change the repository's license.
- The notebook uses the default file-session lock during count-and-save and documents why PRG is not request idempotency. Tests do not establish multi-host concurrency or crash durability.
- PHP 8.0–8.5 historical feature coverage does not mean every old PHP branch is supported for deployment.

## Primary references reviewed

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/) and [internationalization](https://docs.astro.build/en/guides/internationalization/).
- PHP release announcements: [8.0](https://www.php.net/releases/8.0/en.php), [8.1](https://www.php.net/releases/8.1/en.php), [8.2](https://www.php.net/releases/8.2/en.php), [8.3](https://www.php.net/releases/8.3/en.php), [8.4](https://www.php.net/releases/8.4/en.php), [8.5](https://www.php.net/releases/8.5/en.php).
- PHP manuals for [session security management](https://www.php.net/manual/en/features.session.security.management.php), [file uploads](https://www.php.net/manual/en/features.file-upload.php), [streams](https://www.php.net/manual/en/book.stream.php), and [graphemes](https://www.php.net/manual/en/ref.intl.grapheme.php).
- [Composer basic usage](https://getcomposer.org/doc/01-basic-usage.md), [version constraints](https://getcomposer.org/doc/articles/versions.md), and [configuration](https://getcomposer.org/doc/06-config.md).
- [PHPUnit 11.5](https://docs.phpunit.de/en/11.5/), [PHPStan](https://phpstan.org/user-guide/getting-started), [PHP-CS-Fixer](https://cs.symfony.com/), and [Xdebug step debugging](https://xdebug.org/docs/step_debug).

Lesson-level links provide the references adjacent to the material they explain.
