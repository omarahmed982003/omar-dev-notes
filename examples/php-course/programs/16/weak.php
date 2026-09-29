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
