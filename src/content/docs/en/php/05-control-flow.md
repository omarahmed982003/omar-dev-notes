---
title: 5. Conditions and loops
description: if, switch, match, for, while, do-while, and foreach with important differences.
sidebar:
  order: 5
---

```php
if ($score >= 90) {
    $grade = 'A';
} elseif ($score >= 75) {
    $grade = 'B';
} else {
    $grade = 'C';
}

$label = $active ? 'active' : 'inactive';
$username = $_GET['username'] ?? 'guest';
$postId = $user?->latestPost()?->id;
```

Alternative `if: ... endif;` syntax is useful in templates. `??` checks existence/non-null like `isset`; the nullsafe operator is `?->`.

```php
switch ($role) {
    case 'admin':
        $permissions = ['all'];
        break;
    default:
        $permissions = ['read'];
}
```

`switch` historically uses loose comparison and falls through without `break`.

```php
$message = match ($status) {
    200, 201 => 'success',
    404 => 'not found',
    default => 'unexpected',
};

$category = match (true) {
    $age < 13 => 'child',
    $age < 18 => 'teen',
    default => 'adult',
};
```

`match` returns a value, compares strictly, has no fall-through, and throws `UnhandledMatchError` when no arm/default matches.

```php
for ($i = 0; $i < 5; $i++) {
    echo $i;
}

while ($attempts < 3) {
    $attempts++;
}

do {
    $input = readline();
} while ($input === '');
```

A `while` body may never run; `do-while` runs once before checking.

```php
foreach ($users as ['id' => $id, 'name' => $name]) {
    echo "{$id}: {$name}";
}

foreach ($prices as &$price) {
    $price *= 1.14;
}
unset($price);
```

Always unset a reference variable after a by-reference `foreach`. Use `continue` to skip an iteration, `break` to leave a loop, and `break 2` for two nested levels.
