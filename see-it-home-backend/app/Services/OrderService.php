<?php
namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;

class OrderService
{
    public function placeOrder(string $userId, array $shippingAddress): Order
    {
        $cart = Cart::where('user_id', $userId)->firstOrFail();

        if (empty($cart->items)) {
            throw new \Exception('Cart is empty');
        }

        // Validate stock
        foreach ($cart->items as $item) {
            $product = Product::find($item['product_id']);
            if (!$product || $product->stock_quantity < $item['quantity']) {
                throw new \Exception("Insufficient stock for: {$item['name']}");
            }
        }

        $subtotal    = collect($cart->items)->sum(fn($i) => $i['price'] * $i['quantity']);
        $shippingFee = 150;
        $total       = $subtotal + $shippingFee;

        $order = Order::create([
            'user_id'          => $userId,
            'items'            => $cart->items,
            'subtotal'         => $subtotal,
            'shipping_fee'     => $shippingFee,
            'total'            => $total,
            'shipping_address' => $shippingAddress,
            'payment_status'   => 'paid',
            'status'           => 'Pending',
            'status_history'   => [['status' => 'Pending', 'changed_at' => now()->toISOString(), 'note' => 'Order placed']],
        ]);

        // Decrement stock
        foreach ($cart->items as $item) {
            Product::where('_id', $item['product_id'])
                   ->decrement('stock_quantity', $item['quantity']);
        }

        // Clear cart
        $cart->update(['items' => []]);

        return $order;
    }

    public function getUserOrders(string $userId, int $perPage = 10)
    {
        return Order::where('user_id', $userId)
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }
}
