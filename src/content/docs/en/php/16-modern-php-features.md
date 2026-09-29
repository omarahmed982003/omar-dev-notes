---
title: 16. Modern PHP 8.0–8.5 roadmap
description: A versioned roadmap covering WeakMap, Fibers, DNF types, readonly classes, property hooks, and later PHP features.
sidebar:
  order: 16
---

## The problem: valid code that your server cannot parse

A new syntax feature can make a file fail **before execution** on an older PHP version. An `if (PHP_VERSION_ID >= ...)` in that same file cannot protect syntax its parser does not understand. Declare a minimum in Composer, actually test it, and adopt a feature to solve a concrete problem.

Read in two passes: generators, WeakMap, and fibers explain execution/memory; then recognize newer type/object features. Detailed OOP belongs in [its track](/en/oop/), without building a framework here.

## A timeline of released versions

These are each series' initial release dates, not advice to install the old .0 builds. PHP 8.5 shipped on November 20, 2025; it is not a future RFC. Choose a supported patch release when installing.

| Version | Release date | Features |
|---|---|---|
| [8.0](https://www.php.net/releases/8.0/en.php) | 2020-11-26 | Named arguments, attributes, constructor promotion, union types, match, nullsafe, WeakMap, ValueError, mixed, JIT |
| [8.1](https://www.php.net/releases/8.1/en.php) | 2021-11-25 | Enums, fibers, first-class callables, intersection types, never, readonly properties, array_is_list |
| [8.2](https://www.php.net/releases/8.2/en.php) | 2022-12-08 | DNF types, readonly classes, standalone true/false/null, SensitiveParameter, dynamic-property deprecation |
| [8.3](https://www.php.net/releases/8.3/en.php) | 2023-11-23 | Typed class constants, Override, json_validate, readonly reinitialization during cloning, dynamic class-constant access |
| [8.4](https://www.php.net/releases/8.4/en.php) | 2024-11-21 | Property hooks, asymmetric visibility, lazy objects, array_find/array_any/array_all, Deprecated attribute |
| [8.5](https://www.php.net/releases/8.5/en.php) | 2025-11-20 | Pipe, URI extension, clone with, NoDiscard, array_first/array_last, partitioned cookie option |


Dates are recorded in the [changelog](https://www.php.net/ChangeLog-8.php). The table locates features rather than demanding memorization. **Historical distinction:** generators and `yield` arrived in 5.5; `yield from` in 7.0. Appearing in this lesson does not make them PHP 8 features. **JIT** compiles during execution but does not guarantee a faster website; measure your application.

`require: {"php":"^8.3"}` means `>=8.3.0 <9.0.0`, so do not put 8.4 hooks in a file claiming 8.3 support. `composer check-platform-reqs` checks the actual platform. Review migration/deprecation notes and test your minimum and maximum supported versions; a newer number does not replace tests.

## Generators: an item on demand, not a complete array

A **generator** function contains yield. Calling it returns an iterator object; its body advances during foreach and retains its position/local variables between elements. `yield from` delegates element production to another iterable. Save `generator.php`; its syntax is compatible with PHP 7.0+, but run it on a supported PHP installation:

~~~php
<?php
function batches(): Generator
{
    echo "begin", PHP_EOL;
    yield from [10, 20];
    yield from [30];
    echo "end", PHP_EOL;
}
$items = batches();
echo "created", PHP_EOL;
foreach ($items as $key => $value) {
    echo "{$key}:{$value}", PHP_EOL;
}
echo implode(',', iterator_to_array(batches(), false)), PHP_EOL;
~~~

~~~text
created
begin
0:10
1:20
0:30
end
begin
end
10,20,30
~~~

created before begin proves that calling did not build the sequence. Key 0 repeats because yield from preserves source keys. `iterator_to_array(..., false)` renumbers and avoids losing 10; its default key-preserving behavior can overwrite duplicates. Materializing an array loads every element, losing the memory advantage. For another pass, create a new generator rather than assuming a consumed one can rewind.

For large files, read lines inside try/finally and close the handle when iteration completes or the generator is destroyed. Retaining a suspended generator retains its resources. `yield from` does not make I/O asynchronous.

## WeakMap from 8.0: metadata tied to an object's lifetime

A **strong reference** keeps an object alive. WeakMap uses object keys without itself keeping those keys alive; it suits temporary **metadata**, additional information about an object. Save `weak.php` for PHP 8.0+:

~~~php
<?php
$map = new WeakMap();
$request = new stdClass();
$map[$request] = 'checked';
$alias = $request;
echo count($map), PHP_EOL;
unset($request);
echo count($map), PHP_EOL;
unset($alias);
echo count($map), PHP_EOL;
~~~

~~~text
1
1
0
~~~

Removing request alone leaves alias as a strong reference. Removing both drops the entry in this cycle-free example. A stored value that itself references the key may keep it alive; weak keys do not promise deletion of every object graph. Do not make critical business decisions depend on collection timing or use WeakMap as durable caching. See the [reference](https://www.php.net/manual/en/class.weakmap.php).

## Fibers from 8.1: suspend and resume a call stack

A **fiber** is an execution context that can suspend a call stack and continue it later. **Cooperative** means code explicitly yields control; it is not a thread or CPU parallelism. Save `fiber.php` for PHP 8.1+:

~~~php
<?php
$fiber = new Fiber(function (): string {
    echo "fiber entered", PHP_EOL;
    $reply = Fiber::suspend('need input');
    echo "fiber resumed", PHP_EOL;
    return strtoupper($reply);
});
echo "main before", PHP_EOL;
echo $fiber->start(), PHP_EOL;
echo "main between", PHP_EOL;
$fiber->resume('done');
echo $fiber->getReturn(), PHP_EOL;
~~~

~~~text
main before
fiber entered
need input
main between
fiber resumed
DONE
~~~

Constructing a fiber does not run it. start enters its body until suspend returns need input to the caller. resume sends done back as the suspended expression's value in `$reply`. Once terminated, getReturn reads DONE; the final return is not necessarily resume's result. Do not resume before starting or after termination. `isStarted/isSuspended/isTerminated` expose state.

An event-loop library decides which operation resumes when I/O becomes ready. Fibers alone provide neither a scheduler nor nonblocking file_get_contents. Use a suitable library for asynchronous work. See the [fiber reference](https://www.php.net/manual/en/language.fibers.php).

## DNF types and readonly classes from 8.2

A **union** accepts one of several types, A or B. An **intersection** requires the same object to satisfy both A and B. **DNF** combines them as “(A and B) or C,” requiring parentheses around the intersection. Complete `dnf.php` needs PHP 8.2+:

~~~php
<?php
function describe((Countable&Stringable)|array $value): string
{
    return is_array($value) ? 'array:' . count($value) : (string) $value;
}
$items = new class implements Countable, Stringable {
    public function count(): int { return 2; }
    public function __toString(): string { return $this->count() . ' items'; }
};
echo describe([10, 20]), PHP_EOL;
echo describe($items), PHP_EOL;

readonly class Amount
{
    public function __construct(public int $minorUnits) {}
}
$amount = new Amount(500);
echo $amount->minorUnits, PHP_EOL;
try {
    $amount->minorUnits = 600;
} catch (Error) {
    echo "readonly blocked reassignment", PHP_EOL;
}
~~~

~~~text
array:2
2 items
500
readonly blocked reassignment
~~~

The array uses one union branch; the object satisfies both Countable and Stringable. A readonly class makes typed instance properties readonly and disallows dynamic properties. It is not deep immutability: an object stored in a property may still mutate internally. Constructor promotion, shorthand for defining and receiving properties, arrived in 8.0; readonly classes arrived in 8.2.

PHP 8.1 enums represent a closed set of cases. Backed enums use from, which throws ValueError for unknown values, or tryFrom, which returns null. Readonly properties also arrived in 8.1; never marks functions that do not return normally, such as those always terminating or throwing. See [OOP](/en/oop/) and [types](/en/php/03-types/).

## Attributes: metadata needs a reader

**Reflection** inspects code definitions at runtime. Run `attribute.php` on PHP 8.0+:

~~~php
<?php
#[Attribute(Attribute::TARGET_FUNCTION)]
final class Label
{
    public function __construct(public string $text) {}
}
#[Label('Preview')]
function preview(): void {}
$definition = new ReflectionFunction('preview');
$label = $definition->getAttributes(Label::class)[0]->newInstance();
echo $label->text, PHP_EOL;
~~~

~~~text
Preview
~~~

An attribute does not automatically enforce a permission or route. Reflection reads it here and we use its text. PHP 8.2's `#[SensitiveParameter]` redacts parameter values in traces, not manually written logs. PHP 8.3's `#[Override]` detects methods claimed to override a nonexistent parent/interface method. Typed class constants such as `public const int LIMIT = 10;` and dynamic `ClassName::{$name}` access arrived in 8.3.

## 8.4: hooks, asymmetric visibility, and lazy objects

A **hook** runs when a property is read/written. **Asymmetric visibility** gives reading and writing different access rules. `contact.php` requires 8.4+:

~~~php
<?php
final class Contact
{
    public private(set) string $email {
        set {
            $clean = trim($value);
            if (filter_var($clean, FILTER_VALIDATE_EMAIL) === false) {
                throw new InvalidArgumentException('Invalid email');
            }
            $this->email = strtolower($clean);
        }
    }
    public function __construct(string $email) { $this->email = $email; }
}
$contact = new Contact(' OMAR@EXAMPLE.COM ');
echo $contact->email, PHP_EOL;
~~~

~~~text
omar@example.com
~~~

The constructor may write while callers may read; outside writes are rejected. Lowercasing the entire email is this demonstration's policy, not a rule for every mail system. A **lazy object** defers initialization until state is needed; Reflection supports ghost/proxy variants. DI containers and ORMs commonly use them. Lazy does not mean every method immediately triggers initialization. Prefer named methods for complex operations rather than hidden property logic. See [lazy objects](https://www.php.net/manual/en/language.oop5.lazy-objects.php).

## 8.5: a program using features that have shipped

Save `features85.php` and run it with PHP 8.5. A **URI** identifies a resource; the new extension offers APIs for RFC 3986 and WHATWG rules. Clone with copies an object and updates properties during cloning; it does not automatically rerun the constructor, so do not rely on constructor validation being repeated:

~~~php
<?php
readonly class Page
{
    public function __construct(public string $title) {}
    public function withTitle(string $title): self
    {
        return clone($this, ['title' => $title]);
    }
}
$draft = new Page('Draft');
$published = $draft->withTitle('Published');
$slug = ' Learn PHP ' |> trim(...) |> strtolower(...);
$uri = new Uri\Rfc3986\Uri('https://example.com/notes?sort=new');
echo $draft->title, ' / ', $published->title, PHP_EOL;
echo $slug, PHP_EOL;
echo $uri->getHost(), PHP_EOL;
echo array_first(['A', 'B']), '/', array_last(['A', 'B']), PHP_EOL;
~~~

~~~text
Draft / Published
learn php
example.com
A/B
~~~

The original Draft remains unchanged. Clone with runs inside a method with write access; readonly properties have implicit protected(set) since 8.4, so global-scope updates are not automatically allowed. Pipe passes one argument to each callable; lesson 6 explains it. array_first/last return null for an empty array, but null may itself be an element value, so distinguish cases when required.

`#[NoDiscard]` warns when a marked return value is ignored; `(void)` explicitly discards it in 8.5. Other additions include attributes on constants, callable/static closures in constant expressions, expanded asymmetric visibility, and the `partitioned` cookie option. Consult the [official 8.5 release](https://www.php.net/releases/8.5/en.php) before adopting an API; availability is not a requirement to use it.

## Predict, debug, complete

<details><summary>Predict WeakMap count after unset(request) while alias remains</summary><p>1: alias is a strong reference. Weak keys do not remove other references.</p></details>

<details><summary>Debug a pipe expression inside an if version check on PHP 8.4</summary><p>Parsing fails before if runs. Isolate the example in an 8.5-only file, or use older syntax and deliberately plan a minimum-version increase.</p></details>

<details><summary>Complete a type accepting an array or an object both Countable and Stringable</summary><p><code>(Countable&amp;Stringable)|array</code> requires 8.2. The same object must satisfy both interfaces; a union between them changes the contract.</p></details>

<details><summary>When does begin appear if you only call batches?</summary><p>Not until iteration begins. Generators are deferred; converting to an array consumes all elements and can use substantial memory.</p></details>

<details><summary>Does a fiber automatically accelerate a CPU-heavy calculation?</summary><p>No threads or parallel execution are created. Without suspend, the calculation retains control. Fibers organize suspension with a scheduler and suitable I/O.</p></details>

Run each file on its declared baseline and use `php -l` before execution. `php modern-features-lab.php` from the [lab](/en/php/00-lab-setup/) adds enum, readonly, and match failure cases. Check [current support](https://www.php.net/supported-versions.php) before deployment.
