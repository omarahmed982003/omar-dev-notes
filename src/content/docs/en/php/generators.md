---
title: "Generators and incremental processing"
prev: {"link":"/en/php/","label":"PHP guide"}
next: {"link":"/en/php/16-modern-php-features/","label":"Modern PHP 8.0–8.5 roadmap"}
description: "Generators and incremental processing"
sidebar:
  order: 16.2
---

Requires functions, arrays, foreach, and files. A generator represents a function suspended at yield and resumes on demand. Iteration visits elements; eager processing prepares all results, whereas lazy processing delays work until needed. Lazy does not always mean faster; materializing an array consumes the results.

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


## Independent exercise

Compare iterator_to_array(batches()) with iterator_to_array(batches(), false), predicting the repeated key 0.

<details><summary>Review after trying</summary>

Default key preservation overwrites earlier values for a repeated key. false reindexes and keeps every value. Use a fresh generator for each trial.

</details>

## Predict and diagnose

<details><summary>When does begin appear if you only call batches?</summary><p>Not until iteration begins. Generators are deferred; converting to an array consumes all elements and can use substantial memory.</p></details>

<div class="quiz-list" role="list">
<section class="quiz-card" role="listitem"><div class="quiz-question-row"><span class="quiz-number">01</span><p>Write a generator that yields even numbers from 2 to a maximum.</p></div><details class="quiz-answer"><summary><span class="quiz-show">Show answer</span><span class="quiz-hide">Hide answer</span></summary><div class="quiz-answer-body"><strong>Solution outline:</strong> Start a loop at 2, increment by 2, and <code>yield</code> each number while it is below or equal to the maximum.</div></details></section>
</div>

[Return to the PHP guide](/en/php/).

