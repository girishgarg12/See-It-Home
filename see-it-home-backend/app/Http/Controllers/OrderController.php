<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Http\Requests\StoreOrderRequest;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request)
    {

        $cart = Cart::where('user_id', auth()->id())->firstOrFail();

        if (empty($cart->items)) {
            return response()->json(['status' => 'error', 'message' => 'Cart is empty'], 422);
        }

        // Validate stock for all items
        foreach ($cart->items as $item) {
            $product = Product::find($item['product_id']);
            if (!$product || $product->stock_quantity < $item['quantity']) {
                return response()->json([
                    'status'    => 'error',
                    'message'   => "Insufficient stock for: {$item['name']}",
                    'available' => $product->stock_quantity ?? 0,
                ], 422);
            }
        }

        $subtotal     = collect($cart->items)->sum(fn($i) => $i['price'] * $i['quantity']);
        $shippingFee  = 150; // flat rate, customize as needed
        $total        = $subtotal + $shippingFee;

        $order = Order::create([
            'user_id'          => auth()->id(),
            'items'            => $cart->items,
            'subtotal'         => $subtotal,
            'shipping_fee'     => $shippingFee,
            'total'            => $total,
            'shipping_address' => $request->shipping_address,
            'payment_status'   => 'paid', // update based on payment gateway response
            'status'           => 'Pending',
            'status_history'   => [['status' => 'Pending', 'changed_at' => now(), 'note' => 'Order placed']],
        ]);

        // Decrement stock for each product
        foreach ($cart->items as $item) {
            Product::where('_id', $item['product_id'])
                   ->decrement('stock_quantity', $item['quantity']);
        }

        // Clear cart
        $cart->update(['items' => []]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Order placed successfully',
            'data'    => ['order_id' => $order->id, 'total' => $total, 'status' => 'Pending'],
        ], 201);
    }

    public function index(Request $request)
    {
        $orders = Order::where('user_id', auth()->id())
                       ->orderBy('created_at', 'desc')
                       ->paginate(10);

        return response()->json(['status' => 'success', 'data' => $orders]);
    }

    public function show($id)
    {
        $order = Order::where('_id', $id)
                      ->where('user_id', auth()->id())
                      ->firstOrFail();

        return response()->json(['status' => 'success', 'data' => $order]);
    }
}
