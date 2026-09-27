<?php
declare(strict_types=1);

foreach (['Values', 'Http', 'Crypto', 'Inventory'] as $module) {
    require_once __DIR__ . '/src/' . $module . '.php';
}
