<?php
namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlist = Wishlist::firstOrCreate(['user_id' => auth()->id()]);
        
        $products = Product::whereIn('_id', $wishlist->product_ids ?? [])->get();
        
        return response()->json(['status' => 'success', 'data' => $products]);
    }

    public function toggle(Request $request, $productId)
    {
        $wishlist = Wishlist::firstOrCreate(['user_id' => auth()->id()]);
        
        $productIds = $wishlist->product_ids ?? [];
        
        if (in_array($productId, $productIds)) {
            $productIds = array_values(array_diff($productIds, [$productId]));
            $message = 'Removed from wishlist';
            $is_added = false;
        } else {
            $productIds[] = $productId;
            $message = 'Added to wishlist';
            $is_added = true;
        }
        
        $wishlist->product_ids = $productIds;
        $wishlist->save();
        
        return response()->json(['status' => 'success', 'message' => $message, 'is_added' => $is_added]);
    }
}
