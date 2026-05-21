<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$products = App\Models\Product::all();
foreach ($products as $p) {
    $name = strtolower($p->name);
    if (str_contains($name, 'sofa')) {
        $p->price = rand(29999, 89999);
    } elseif (str_contains($name, 'chair')) {
        $p->price = rand(8999, 24999);
    } elseif (str_contains($name, 'pouf') || str_contains($name, 'ottoman')) {
        $p->price = rand(4999, 9999);
    } elseif (str_contains($name, 'lantern') || str_contains($name, 'lamp')) {
        $p->price = rand(2999, 7999);
    } elseif (str_contains($name, 'candle')) {
        $p->price = rand(999, 2999);
    } else {
        $p->price = rand(9999, 49999);
    }
    $p->save();
    echo $p->name . ': $' . $p->price . "\n";
}

echo "Prices updated successfully\n";
