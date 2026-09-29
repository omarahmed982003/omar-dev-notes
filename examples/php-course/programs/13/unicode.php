<?php
declare(strict_types=1);

$samples = [
    'ASCII' => 'Omar',
    'Arabic' => 'عمر',
    'accent' => "e\u{0301}",
    'family' => "👨‍👩‍👧‍👦",
];
foreach ($samples as $label => $text) {
    if (!mb_check_encoding($text, 'UTF-8')) {
        throw new InvalidArgumentException('Invalid UTF-8');
    }
    printf("%s: bytes=%d points=%d graphemes=%d\n",
        $label, strlen($text), mb_strlen($text, 'UTF-8'), grapheme_strlen($text));
}
$text = 'عمر';
echo 'first byte=', bin2hex($text[0]), PHP_EOL;
echo 'first point=', mb_substr($text, 0, 1, 'UTF-8'), PHP_EOL;
