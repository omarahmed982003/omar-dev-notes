---
title: "PHP: Language, Applications & Production"
prev: false
next: {"link":"/en/php/00-lab-setup/","label":"Set up the labs and run examples"}
description: "One staged PHP track: language fundamentals, web applications, runtime tools, testing, performance, and production."
sidebar:
  order: 0
---

# PHP: from the language to running applications

This path starts with PHP fundamentals and builds each idea on the previous one until you can read a web program and understand its parts. Lessons include runnable examples, common cases, and mistakes with their causes and fixes.

## Follow stages, not one long checklist

This card combines PHP and its runtime tools without requiring production expertise before your first program. **Runtime** means the code's execution environment; **production** is the environment serving real users.

1. **Learn the language:** first file, values, variables, types, output, operators, decisions, loops, functions, arrays, and strings. Existing lesson numbers remain reference labels: read operators before control flow and arrays before file-processing applications.
2. **Build a small application:** files, errors, basic Composer, forms, sessions, time, requests/responses, and the notebook project. Web work assumes HTML, HTTP, and functions. Advanced object features in lesson16 are a reference after OOP, not a prerequisite for finishing the project.
3. **Run and verify it:** [CLI, configuration, and extensions](/en/php-runtime/08-cli-ini-extensions/), [application configuration](/en/php-runtime/07-environment-configuration/), [production dependencies](/en/php-runtime/01-composer-dependencies/), and [testing](/en/php-runtime/10-testing-quality/). With a working project and Linux basics, continue to [web servers](/en/php-runtime/06-web-servers-fastcgi/), [FPM](/en/php-runtime/05-php-fpm-processes/), [OPcache](/en/php-runtime/03-opcache-preloading/), [logging](/en/php-runtime/09-logging-observability/), and [deployment](/en/php-runtime/13-deployment-cicd-containers/).
4. **Return for depth when needed:** Redis, queues, scaling, profiling, recovery, and long-running workers require a tested application. Database-dependent labs also need SQL and transactions; they are not prerequisites for a first PHP program.

**First-stage stop:** can you run a small project, explain an entire request, and prove that invalid input is rejected without a write? Proceed through runtime topics gradually. Reading pages is neither a passed assessment nor permission to deploy a real service.

[Open the runtime and production guide within this same track](/en/php-runtime/). Lesson10 introduces Composer through a first project; its runtime counterpart deepens release and optimized-autoload concerns. Testing starts early and is expanded later. The shared lab also contains experiments for other tracks: select only the current lesson's experiment.

## Staged learning path

Each topic appears once in navigation. Finish the first project before production depth; advanced types return after OOP.

### Start here

- [Set up the labs and run examples](/en/php/00-lab-setup/)

### Language foundations

- [PHP introduction and syntax](/en/php/01-introduction-and-syntax/)
- [Variables and references](/en/php/02-variables-scope-superglobals/)
- [Data types and the type system](/en/php/03-types/)
- [Output and debugging](/en/php/04-output-debugging-constants/)
- [Constants and their scope](/en/php/constants/)
- [Expressions and operators](/en/php/06-expressions-operators/)
- [Conditions and loops](/en/php/05-control-flow/)
- [CLI: Input / Output](/en/php/cli-input-output/)
- [Functions and callbacks](/en/php/07-functions-and-includes/)
- [Variable scope and lifetime](/en/php/scope/)
- [Errors and exceptions](/en/php/11-errors-exceptions/)
- [Arrays and transformation tools](/en/php/12-arrays-functional-tools/)
- [Input validation: turn external data into trusted values](/en/php/input-validation/)
- [Strings and Unicode](/en/php/13-strings-unicode-regex/)
- [Regex: validate a string shape](/en/php/regex/)
- [CLI project: expenses before the web](/en/php/cli-expenses-project/)
- [Your first automated test](/en/php/first-tests/)

### From a small program to the web

- [Program organization and entry points](/en/php/program-organization/)
- [Files, streams, JSON, and CSV](/en/php/08-files-streams-data/)
- [Namespaces, Composer, and quality tools](/en/php/10-namespaces-autoloading/)
- [Date, time, and timezones](/en/php/14-datetime-timezones/)
- [Request input and superglobals](/en/php/request-input/)
- [Cookies and sessions](/en/php/09-uploads-cookies-sessions/)
- [File uploads and private storage](/en/php/file-uploads/)
- [From HTTP request to router and response](/en/php/15-request-router-response/)
- [Notebook project and practical debugging](/en/php/17-integrated-programs-debugging/)

### Run and verify the application

- [Runtime & Production Section — PHP](/en/php-runtime/)
- [PHP CLI, php.ini, and extensions](/en/php-runtime/08-cli-ini-extensions/)
- [Environment variables and configuration](/en/php-runtime/07-environment-configuration/)
- [Composer and dependency management](/en/php-runtime/01-composer-dependencies/)
- [Testing and code quality](/en/php-runtime/10-testing-quality/)
- [Dependency and supply-chain security](/en/php-runtime/14-dependency-supply-chain-security/)
- [cURL and HTTP clients](/en/php-runtime/02-curl-http-clients/)
- [Apache, Nginx, and FastCGI](/en/php-runtime/06-web-servers-fastcgi/)
- [PHP-FPM and process management](/en/php-runtime/05-php-fpm-processes/)
- [OPcache and preloading](/en/php-runtime/03-opcache-preloading/)
- [Logging and observability](/en/php-runtime/09-logging-observability/)
- [Deployment, CI/CD, and containers](/en/php-runtime/13-deployment-cicd-containers/)

### Return for depth after practice

- [Generators and incremental processing](/en/php/generators/)
- [Modern PHP 8.0–8.5 roadmap](/en/php/16-modern-php-features/)
- [PHP memory and garbage collection](/en/php-runtime/04-memory-garbage-collection/)
- [Data caching and Redis](/en/php-runtime/11-data-caching-redis/)
- [Queues, workers, and scheduling](/en/php-runtime/12-queues-workers-scheduling/)
- [Profiling, SLI/SLO, and OpenTelemetry](/en/php-runtime/15-profiling-slo-opentelemetry/)
- [Resilience and worker management](/en/php-runtime/16-resilience-workers/)
- [Disaster recovery and restore testing](/en/php-runtime/17-disaster-recovery/)
- [Sessions and shared state at scale](/en/php-runtime/18-sessions-shared-state/)
- [Database connections and runtime operations](/en/php-runtime/19-database-runtime-operations/)
- [Long-running PHP and worker runtimes](/en/php-runtime/20-long-running-php/)

:::tip[How to study]
Run every example, change its inputs, and predict the result before running it again. The security notes are part of correct PHP usage, not optional extras.
:::

```php
<?php

echo 'Hello PHP', PHP_EOL;
```

Save as `hello.php` and run `php hello.php` after setting up PHP CLI, the command-line way to run PHP. `<?php` starts PHP code; `echo` displays the text and `PHP_EOL` adds a line ending. Expect one line: `Hello PHP`. You need neither functions nor a database for this first step.

> Examples target PHP 8.x. Features requiring a newer minor release are labelled explicitly.


[Set up the downloadable labs and runnable examples](/en/php/00-lab-setup/).

## A project that grows with you

Begin with the small CLI programs in Language foundations, then follow the web stage: the Composer project, API, and notebook. [Download the complete files](/downloads/php-course.zip): beginner CLI programs, lesson programs, session/upload forms, a locked Composer project with tests, and the notebook. Follow the stages above and in the sidebar; historical numbers in URLs are not the required study order.
