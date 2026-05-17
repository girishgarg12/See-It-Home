<?php
namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Product;
use App\Http\Requests\StoreReviewRequest;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request, $productId)
    {

        $product = Product::findOrFail($productId);

        $review = Review::create([
            'product_id' => $productId,
            'user_id'    => auth()->id(),
            'user_name'  => auth()->user()->name,
            'rating'     => $request->rating,
            'comment'    => $request->comment,
        ]);

        // Recalculate average rating
        $allReviews = Review::where('product_id', $productId)->get();
        $avgRating  = $allReviews->avg('rating');

        $product->update([
            'average_rating' => round($avgRating, 1),
            'review_count'   => $allReviews->count(),
        ]);

        return response()->json(['status' => 'success', 'data' => $review], 201);
    }
    
    public function index($productId)
    {
        $reviews = Review::where('product_id', $productId)->orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $reviews]);
    }
}
