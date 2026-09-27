---
title: 3. Data types and the type system
description: "Types from first principles: strings, numbers, booleans, null, arrays, objects, declarations, and advanced callable and iterable types."
sidebar:
  order: 3
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **Runtime:** The period when a program is actually running.
- **Unicode:** A standard that assigns consistent numbers to characters and symbols.
- **Boolean:** A logical value with only two states: true or false.
- **Loop:** A structure that repeats instructions according to a condition.
- **Function:** A named, reusable block of code with one defined job.


## What is a data type?

The integer `10` and the string `'10'` look similar but mean different things. The first is ready for arithmetic; the second is a sequence of characters, perhaps received from a form. A **data type** tells PHP and the programmer what a value represents and which operations make sense.

```php
$quantity = 10;       // int
$input = '10';        // string
$price = 19.95;       // float
$isAvailable = true;  // bool
$discount = null;     // no value at present
```

Ignoring types can make a program calculate with invalid text, confuse missing data with zero, or compare values unexpectedly. Do not merely memorize type names; ask what value you have, where it came from, and which operations are safe.

## The type map

- **Scalar:** one value—`bool`, `int`, `float`, or `string`.
- **Compound:** values and behavior—`array` and `object`.
- **Special:** `null` and `resource`.
- **Function-contract types:** `callable`, `iterable`, `mixed`, `void`, and `never`.
- **User-defined:** classes, interfaces, and enums.
- **Combinations:** a union such as `int|string` or an intersection such as `Countable&Iterator`.

You do not need every advanced type immediately. Master scalars and arrays first; revisit callables and intersections after functions and OOP.

## `bool`: true or false

Booleans represent decisions:

```php
$isLoggedIn = true;
$hasPermission = false;

if ($isLoggedIn && $hasPermission) {
    echo 'Allowed';
} else {
    echo 'Denied';
}
```

Names such as `$isActive`, `$hasAccess`, and `$canEdit` reveal that a variable answers a yes/no question.

PHP treats these values as false in a Boolean context: `false`, `0`, `0.0`, `''`, `'0'`, `[]`, and `null`. Therefore do not rely on truthiness when zero and absence have different meanings.

## `null`: no value

`null` means no value is currently present. It is different from zero, an empty string, and `false`:

```php
$middleName = null;

if ($middleName === null) {
    echo 'No middle name was provided';
}
```

`isset($array['key'])` is false for a missing key and for a key whose value is `null`. Use `array_key_exists()` when key presence matters even if its value is null.

## Loose and strict comparison

`==` may convert types; `===` requires the same type and value:

```php
var_dump(0 == false);    // true
var_dump(0 === false);   // false
var_dump('10' == 10);    // true
var_dump('10' === 10);   // false
```

Start with `===` and `!==` in application code. Use loose comparison only with a deliberate understanding of its conversion rules.

## `int`: whole numbers

```php
$decimal = 42;
$octal = 0o52;
$hex = 0x2A;
$binary = 0b101010;
```

All four values equal 42. Binary and hexadecimal forms appear in masks, colors, and protocols.

```php
echo 7 / 2;        // 3.5
echo intdiv(7, 2); // 3
echo 7 % 2;        // 1

echo (int) 3.9;    // 3: truncation
echo round(3.9);   // 4: rounding
```

Integer size depends on the platform; inspect `PHP_INT_MAX` and `PHP_INT_MIN`. Overflow can produce a float and lose exact integer precision.

## `float`: decimal-looking values

Floats use finite binary fractions, so many decimal fractions are approximate:

```php
$result = 0.1 + 0.2;

var_dump($result === 0.3); // usually false
```

For scientific comparisons, use an appropriate tolerance:

```php
$epsilon = 0.000001;

if (abs($result - 0.3) < $epsilon) {
    echo 'Close enough';
}
```

For money, a simple safe model is often an integer in the smallest unit:

```php
$priceCents = 1999;
$quantity = 3;
$totalCents = $priceCents * $quantity; // 5997
```

Use an appropriate decimal library when the domain requires exact fractional units or very large numbers.

## `string`: text stored as bytes

```php
$name = 'Omar';
$message = "Hello {$name}";
$joined = 'PHP' . ' ' . '8';
```

The string-concatenation operator is `.`, not `+`.

A PHP string is a sequence of bytes. Byte indexing works predictably for basic ASCII but not for splitting arbitrary Unicode text:

```php
$english = 'PHP';
echo $english[0];  // P
echo $english[-1]; // P
```

Use `mb_strlen()` and `mb_substr()` when working with multibyte text and the `mbstring` extension.

## Heredoc and nowdoc

```php
$name = 'Omar';

$heredoc = <<<TEXT
Hello $name
This value is interpolated.
TEXT;

$nowdoc = <<<'TEXT'
$name stays exactly as written.
TEXT;
```

Heredoc behaves like a double-quoted string; nowdoc behaves like a single-quoted one.

## Numeric text is not validated data

Forms and query strings normally provide strings. Validate before conversion:

```php
$rawAge = $_GET['age'] ?? null;
$age = filter_var($rawAge, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 120],
]);

if ($age === false) {
    echo 'Invalid age';
} else {
    echo "Next year you will be ", $age + 1;
}
```

`is_numeric()` recognizes numeric syntax but does not enforce your business rule. `-20` is numeric but not a valid human age.

## `array`: list and map

A PHP array is an ordered map and can represent a list:

```php
$colors = ['red', 'blue'];
echo $colors[0];
```

or keyed data:

```php
$user = [
    'id' => 7,
    'name' => 'Omar',
    'active' => true,
];

echo $user['name'];
```

It can also nest:

```php
$orders = [
    ['id' => 101, 'total_cents' => 5000],
    ['id' => 102, 'total_cents' => 7500],
];

echo $orders[1]['total_cents']; // 7500
```

Use `??` when a missing key is expected: `$country = $user['country'] ?? 'Unknown';`.

## Objects and classes

An object is an instance of a class that combines state and behavior:

```php
final class Product
{
    public function __construct(
        public string $name,
        public int $priceCents,
    ) {}
}

$product = new Product('Keyboard', 150000);
echo $product->name;
```

The important point now is that the value's type is `Product` and can carry meaningful properties and methods. The OOP track develops the full model.

## Enums define allowed states

An enum replaces error-prone free text with a closed set:

```php
enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
}

$status = OrderStatus::Paid;
echo $status->value;
```

An accidental status such as `'paied'` can no longer silently enter typed domain code.

## Resources are handles

Some functions return a `resource` handle to an external stream or connection:

```php
$handle = fopen(__FILE__, 'rb');

if ($handle === false) {
    throw new RuntimeException('Could not open the file');
}

echo get_debug_type($handle); // resource (stream)
fclose($handle);
```

The handle is not the file contents. Modern extensions increasingly return objects instead, so check current documentation and runtime types.

## Type declarations and strict types

Function contracts can declare inputs and output:

```php
function calculateTotal(int $priceCents, int $quantity): int
{
    return $priceCents * $quantity;
}
```

At a file's start:

```php
<?php
declare(strict_types=1);
```

Without strict mode, PHP may coerce compatible scalar arguments. With strict mode, passing `'3'` to an `int` parameter generally throws `TypeError`. Strictness is chosen by the **calling file**. PHP still accepts an `int` for a `float` parameter.

## Nullable and union types

```php
function findUser(int $id): ?array
{
    return $id === 7 ? ['id' => 7, 'name' => 'Omar'] : null;
}
```

`?array` means `array|null`. A union supports other explicit alternatives:

```php
function normalizeId(int|string $id): int
{
    if (is_string($id) && !ctype_digit($id)) {
        throw new InvalidArgumentException('Invalid ID');
    }

    return (int) $id;
}
```

Do not broaden a type merely for convenience; every alternative creates behavior that must be defined and tested.

## `mixed`, `void`, and `never`

- `mixed` accepts any type, including `null`; prefer a narrower contract when possible.
- `void` returns no useful value.
- `never` cannot return normally because it throws, exits, or never terminates.

```php
function logMessage(string $message): void
{
    error_log($message);
}

function fail(string $message): never
{
    throw new RuntimeException($message);
}
```

## Callables and closures

A callable is a value PHP can invoke. A callback is a callable passed for later invocation:

```php
$double = function (int $number): int {
    return $number * 2;
};

$shortDouble = fn (int $number): int => $number * 2;

echo $double(4);      // 8
echo $shortDouble(5); // 10
```

A Closure is an object representing an anonymous function. PHP also supports first-class callable syntax:

```php
function clean(string $value): string
{
    return trim($value);
}

$cleaner = clean(...);
```

An object becomes callable by defining `__invoke()`.

## Iterables and generators

`iterable` accepts an array or an object implementing `Traversable`:

```php
function printValues(iterable $values): void
{
    foreach ($values as $value) {
        echo $value, PHP_EOL;
    }
}
```

A generator yields values one at a time:

```php
function numbers(int $maximum): iterable
{
    for ($number = 1; $number <= $maximum; $number++) {
        yield $number;
    }
}

printValues(numbers(3));
```

`yield` suspends execution and preserves function state until the next value is requested. Every generator is an Iterator, but not every Iterator is a generator.

## Intersection and DNF types: recognize them for now

`Countable&Iterator` requires an object to satisfy both interfaces. DNF types combine unions and intersections with allowed parentheses, such as `(A&B)|null`.

These contracts matter in advanced library design, but do not force them into beginner code. Return after learning interfaces and OOP.

## Complete example: order total

```php
<?php
declare(strict_types=1);

function readPositiveInt(mixed $value): ?int
{
    $result = filter_var($value, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1],
    ]);

    return $result === false ? null : $result;
}

$priceCents = readPositiveInt($_GET['price_cents'] ?? null);
$quantity = readPositiveInt($_GET['quantity'] ?? null);

if ($priceCents === null || $quantity === null) {
    http_response_code(400);
    echo 'price_cents and quantity must be positive integers';
    exit;
}

$totalCents = $priceCents * $quantity;
echo "Total: {$totalCents} cents";
```

Test a valid request, alphabetic price, zero quantity, and a missing value. The example connects untrusted `mixed` input, validation, nullable results, strict comparison, and integer money.

## Common mistakes

- Using `==` and being surprised by coercion.
- Storing money in floats without a precision decision.
- Assuming every `$_GET` value is one string; a client can send an array.
- Byte-indexing Arabic or other multibyte text.
- Accepting `mixed` everywhere instead of narrowing at boundaries.
- Adding a broad union to hide unclear design.
- Building a huge array when values could be streamed.

## Check your understanding

<div class="lesson-quiz" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>How do <code>0</code>, <code>'0'</code>, <code>false</code>, and <code>null</code> differ?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> They are integer, string, Boolean, and null values. Some Boolean contexts or loose comparisons make them look similar, but their types and domain meanings differ.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">02</span><p>Predict <code>var_dump('5' === 5); var_dump('5' == 5);</code>.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> The strict comparison is <code>false</code>; the loose comparison is <code>true</code> after coercion.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">03</span><p>Why can <code>0.1 + 0.2 === 0.3</code> be false?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Finite binary floating-point cannot exactly represent every decimal fraction. Compare with a domain-appropriate tolerance or use exact decimal/integer representation.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">04</span><p>When should you use <code>array_key_exists()</code> rather than <code>isset()</code>?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> When key presence matters even if the stored value is <code>null</code>.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">05</span><p>How should an application narrow a <code>mixed</code> price from an external request?</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Answer:</strong> Accept uncertainty only at the boundary, validate and convert to an integer number of cents, and let internal domain functions require that clear <code>int</code> contract.</div></details></section>
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">06</span><p>Write a generator that yields even numbers from 2 to a maximum.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Solution outline:</strong> Start a loop at 2, increment by 2, and <code>yield</code> each number while it is below or equal to the maximum.</div></details></section>
</div>

## Summary

A type gives a value meaning and defines useful operations. Prefer strict comparison, validate strings before conversion, and make an explicit money-precision choice. Arrays model lists and maps; objects and enums introduce domain-specific types. Declarations and strict types clarify function boundaries, while advanced types should be used when their problem actually appears.

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
php types-lab.php
~~~

**Success criterion:** Valid cases pass and strict mode rejects the wrong type rather than silently coercing it; record the error type and exit code.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Study in three passes: scalar/null, arrays/objects/enums, then advanced declarations such as union/intersection/never. Test numeric limits, numeric strings, NaN, and INF, and do not use an advanced type without a contract requiring it. Serialization is a separate storage and trust concern.

### Try it yourself

Create a case matrix showing value and type before and after each conversion.
