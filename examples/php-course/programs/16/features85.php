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
