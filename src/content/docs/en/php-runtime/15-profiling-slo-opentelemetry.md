---
title: 15. Profiling, SLI/SLO, and OpenTelemetry
description: Performance profiling, flame graphs, service objectives, and trace-context propagation across services.
sidebar:
  order: 15
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **HTTP:** The rules used to exchange requests and responses on the web.
- **API:** A defined interface through which one program requests data or actions from another.
- **Function:** A named, reusable block of code with one defined job.


## Measure before optimizing

Start with measurable evidence: a slow endpoint, high CPU, memory growth, or a rising error rate. Averages hide tails, so inspect `p50`, `p95`, and `p99` together with request volume and error count. Establish a repeatable baseline before changing code.

## Sampling and instrumentation

A sampling profiler periodically captures call stacks with relatively low overhead. Instrumentation times selected operations precisely but adds code and runtime cost. Use production-like data, representative load, and an appropriate warm-up.

```php
$started = hrtime(true);
try {
    $result = $service->buildReport($request);
} finally {
    $logger->info('report.completed', [
        'duration_ms' => (hrtime(true) - $started) / 1_000_000,
        'memory_peak_bytes' => memory_get_peak_usage(true),
    ]);
}
```

This times one boundary; it is not a full profiler. Avoid manually timing every function when a profiler or APM can preserve the complete call context.

## Reading a flame graph

Frame width represents sample share, not the duration of one invocation. Vertical depth represents call stacks. Investigate wide repeated stacks, then determine whether the cause is CPU, serialization, regex, autoloading, repeated queries, or I/O wait that a CPU profile may not expose. Compare before and after under the same workload.

## SLI, SLO, and error budget

- An **SLI** is a measurement, such as the fraction of valid requests completed successfully below 300ms.
- An **SLO** is a target, such as 99.9% over 30 days.
- The **error budget** is the permitted shortfall; exhausting it should shift attention from feature velocity to reliability.

Define valid traffic and success precisely. Exclude health checks or synthetic traffic only through a documented policy.

## OpenTelemetry and propagation

OpenTelemetry correlates traces, metrics, and logs through context. An incoming request starts a span; database and outbound HTTP operations become children. Propagate W3C `traceparent` to downstream services instead of starting an unrelated trace.

```text
Browser -> API span -> DB span
                    -> HTTP span -- traceparent --> payment span
```

Prefer auto-instrumentation or established libraries. Do not place secrets or personal data in baggage: it crosses service boundaries and may be exported with telemetry.

## Investigating a slow request

Start with a slow trace, locate the longest span, correlate logs by trace ID, inspect a query plan or third-party latency, and use a CPU profile only when time is spent inside application computation. Verify the fix under load and watch the SLI after deployment.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Why is average latency insufficient?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> It can hide a slow tail affecting many users; inspect percentiles, traffic, and errors together.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>What does a wide flame-graph frame mean?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> That stack appeared in many samples; it deserves investigation but does not prove every call was slow.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>How do SLI and SLO differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The SLI is the measurement; the SLO is the target for it over a defined window.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>How does one trace continue across two services?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Inject trace context into the outgoing request and extract it downstream, preferably through tested instrumentation.</div></details></section>
</div>

## Run and verify

The fixed sample yields p50=10ms, p95=100ms, p99=100ms, and mean=28ms. Live measurement and trace export are a separate service exercise.

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php profiling-lab.php
~~~

**Extended integration exercise target:** Compare p50, p95, and p99 before and after the change and connect a trace to a slow operation; the average alone does not satisfy acceptance.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Add real instrumentation for HTTP, database, and queues with an exporter and resource attributes. Histograms need suitable buckets, and percentiles must not be averaged. Connect flame-graph improvements to an SLI change rather than one faster function.

### Try it yourself

Export a trace and metric from staging and connect one span to elevated p95.
