<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Events\OrderStatusUpdated;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $orders]);
    }

    public function show($id)
    {
        $order = Order::find($id);
        
        if (!$order) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $order]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:Pending,Processing,Shipped,Delivered,Cancelled',
            'note'   => 'nullable|string',
        ]);

        $order = Order::find($id);
        
        if (!$order) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        $order->update([
            'status' => $request->status,
            'status_history' => array_merge($order->status_history ?? [], [[
                'status'     => $request->status,
                'changed_at' => now()->toISOString(),
                'note'       => $request->note ?? '',
            ]]),
        ]);

        // Dispatch Email Event
        try {
            event(new OrderStatusUpdated($order));
        } catch (\Exception $e) {
            // Don't fail the request if email fails
            \Log::warning('Failed to send order status email: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success', 
            'message' => 'Order status updated successfully',
            'data' => $order
        ]);
    }
}
