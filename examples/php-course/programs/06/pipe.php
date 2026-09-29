<?php
$slug = ' Hello PHP '
    |> trim(...)
    |> strtolower(...)
    |> (fn (string $s): string => str_replace(' ', '-', $s));
echo $slug, PHP_EOL;
