<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$images = [
    "sofa_cream.png",
    "dining_table.png",
    "office_chair.png",
    "king_bed.png",
    "wardrobe_white.png",
    "coffee_table.png",
    "accent_chair.png",
    "bookshelf.png"
];

$products = App\Models\Product::all();
foreach ($products as $i => $product) {
    $img = $images[$i % count($images)];
    $product->images = ["/storage/products/images/" . $img];
    $product->save();
}

echo "Done\n";
