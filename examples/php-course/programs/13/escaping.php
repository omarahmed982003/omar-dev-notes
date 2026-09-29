<?php
$name = '<Omar & Mona>';
echo htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'), PHP_EOL;
echo '/search?q=', rawurlencode($name), PHP_EOL;
echo json_encode(['name' => $name], JSON_THROW_ON_ERROR), PHP_EOL;
