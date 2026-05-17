<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);
        return response()->json(['status' => 'success', 'data' => $cart]);
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|string',
            'quantity'   => 'required|integer|min:1',
            'color'      => 'nullable|string',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'status'    => 'error',
                'message'   => 'Requested quantity exceeds available stock',
                'available' => $product->stock_quantity,
            ], 422);
        }

        $cart  = Cart::firstOrCreate(['user_id' => auth()->id()]);
        $items = $cart->items ?? [];

        // Check if product already in cart
        $existingIndex = collect($items)->search(
            fn($item) => $item['product_id'] === $request->product_id
                && ($item['color'] ?? '') === ($request->color ?? '')
        );

        if ($existingIndex !== false) {
            $items[$existingIndex]['quantity'] += $request->quantity;
        } else {
            $items[] = [
                'product_id' => $request->product_id,
                'name'       => $product->name,
                'price'      => $product->price,
                'quantity'   => $request->quantity,
                'color'      => $request->color,
                'image'      => $product->images[0] ?? null,
            ];
        }

        $cart->update(['items' => $items]);

        return response()->json(['status' => 'success', 'data' => $cart], 201);
    }

    public function updateItem(Request $request, $itemIndex)
    {
        $request->validate(['quantity' => 'required|integer|min:0']);

        $cart  = Cart::where('user_id', auth()->id())->firstOrFail();
        $items = $cart->items ?? [];

        if ($request->quantity === 0) {
            array_splice($items, $itemIndex, 1);
        } else {
            $items[$itemIndex]['quantity'] = $request->quantity;
        }

        $cart->update(['items' => $items]);

        return response()->json(['status' => 'success', 'data' => $cart]);
    }

    public function removeItem($itemIndex)
    {
        $cart  = Cart::where('user_id', auth()->id())->firstOrFail();
        $items = $cart->items ?? [];
        array_splice($items, $itemIndex, 1);
        $cart->update(['items' => $items]);

        return response()->json(['status' => 'success', 'message' => 'Item removed']);
    }

    public function clear()
    {
        Cart::where('user_id', auth()->id())->update(['items' => []]);
        return response()->json(['status' => 'success', 'message' => 'Cart cleared']);
    }
}
