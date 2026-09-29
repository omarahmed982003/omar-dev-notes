<?php
$composed = "\u{00E9}";
$decomposed = "e\u{0301}";
var_dump($composed === $decomposed);
$normalized = Normalizer::normalize($decomposed, Normalizer::FORM_C);
if ($normalized === false) {
    throw new RuntimeException('Normalization failed');
}
var_dump($composed === $normalized);
echo strlen($decomposed), ' -> ', strlen($normalized), PHP_EOL;
