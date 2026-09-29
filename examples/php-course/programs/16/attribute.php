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
