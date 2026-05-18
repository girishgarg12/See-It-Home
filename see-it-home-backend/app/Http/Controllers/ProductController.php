<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private function mapStorageUrl(string $path): string
    {
        if (str_starts_with($path, 'http')) return $path;
        if (str_starts_with($path, '/storage/')) return $path;
        if (str_starts_with($path, 'storage/')) return '/' . $path;
        return '/storage/' . $path;
    }

    public function index(Request $request)
    {
        $query = Product::where('is_published', true);

        if ($request->search) {
            $term = $request->search;
            $regex = new \MongoDB\BSON\Regex(preg_quote($term, '/'), 'i');
            $query->where(function($q) use ($regex) {
                $q->where('name', 'regex', $regex)
                  ->orWhere('description', 'regex', $regex);
            });
        }
        if ($request->category) {
            $query->category($request->category);
        }
        if ($request->min_price || $request->max_price) {
            $query->priceRange($request->min_price, $request->max_price);
        }
        if ($request->color) {
            $query->where('colors', $request->color);
        }
        if ($request->has('is_featured')) {
            $query->where('is_featured', filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN));
        }

        $sortField = $request->sort_by === 'price' ? 'price' : 'created_at';
        $sortDir   = $request->sort_dir === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortField, $sortDir);

        $products = $query->paginate($request->per_page ?? 12);
        
        $products->getCollection()->transform(function ($product) {
            if (is_array($product->images)) {
                $product->images = array_map(fn($img) => $this->mapStorageUrl($img), $product->images);
            }
            if ($product->model_url) {
                $product->model_url = $this->mapStorageUrl($product->model_url);
            }
            return $product;
        });

        return response()->json(['status' => 'success', 'data' => $products]);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);

        // Generate storage URL for model file
        if ($product->model_url) {
            $product->model_url = $this->mapStorageUrl($product->model_url);
        }

        // Map image paths to full URLs
        if (is_array($product->images)) {
            $product->images = array_map(fn($img) => $this->mapStorageUrl($img), $product->images);
        }

        return response()->json(['status' => 'success', 'data' => $product]);
    }
}
