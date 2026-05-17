<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Order::where('status', '!=', 'Cancelled')
                             ->sum('total');

        $totalOrders  = Order::count();
        $totalUsers   = User::where('role', 'customer')->count();

        $lowStockProducts = Product::where('stock_quantity', '<', 10)
                                   ->where('is_published', true)
                                   ->get(['name', 'stock_quantity']);

        return response()->json([
            'status' => 'success',
            'data'   => [
                'total_revenue'      => $totalRevenue,
                'total_orders'       => $totalOrders,
                'total_users'        => $totalUsers,
                'low_stock_products' => $lowStockProducts,
            ],
        ]);
    }
}
