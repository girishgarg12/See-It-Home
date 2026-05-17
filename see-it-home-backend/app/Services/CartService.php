<?php
namespace App\Services;

use App\Models\Cart;
use App\Models\Product;

class CartService
{
    public function getOrCreateCart(string $userId): Cart
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    public function addItem(Cart $cart, string $productId, int $quantity, ?string $color = null): Cart
    {
        $product = Product::findOrFail($productId);

        if ($product->stock_quantity < $quantity) {
            throw new \Exception("Requested quantity exceeds available stock. Available: {$product->stock_quantity}");
        }

        $items = $cart->items ?? [];

        $existingIndex = collect($items)->search(
            fn($item) => $item['product_id'] === $productId
                && ($item['color'] ?? '') === ($color ?? '')
        );

        if ($existingIndex !== false) {
            $items[$existingIndex]['quantity'] += $quantity;
        } else {
            $items[] = [
                'product_id' => $productId,
                'name'       => $product->name,
                'price'      => $product->price,
                'quantity'   => $quantity,
                'color'      => $color,
                'image'      => $product->images[0] ?? null,
            ];
        }

        $cart->update(['items' => $items]);

        return $cart;
    }

    public function clearCart(string $userId): void
    {
        Cart::where('user_id', $userId)->update(['items' => []]);
    }
}
