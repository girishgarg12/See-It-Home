<?php
namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getPublishedProducts(Request $request)
    {
        $query = Product::where('is_published', true);

        if ($request->search) {
            $query->search($request->search);
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

        $sortField = $request->sort_by === 'price' ? 'price' : 'created_at';
        $sortDir   = $request->sort_dir === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortField, $sortDir);

        return $query->paginate($request->per_page ?? 12);
    }

    private function mapStorageUrl(string $path): string
    {
        if (str_starts_with($path, 'http')) return $path;
        if (str_starts_with($path, '/storage/')) return $path;
        if (str_starts_with($path, 'storage/')) return '/' . $path;
        return '/storage/' . $path;
    }

    public function getProductWithUrls($id): Product
    {
        $product = Product::findOrFail($id);

        if ($product->model_url) {
            $product->model_url = $this->mapStorageUrl($product->model_url);
        }

        if (is_array($product->images)) {
            $product->images = array_map(
                fn($img) => $this->mapStorageUrl($img),
                $product->images
            );
        }

        return $product;
    }

    public function storeProduct(array $validatedData, $imageFiles = [], $modelFile = null): Product
    {
        $imagePaths = [];
        foreach ($imageFiles as $image) {
            $imagePaths[] = $image->store('products/images', 'public');
        }

        $modelPath = $modelFile?->store('products/models', 'public');

        return Product::create([
            ...$validatedData,
            'images'    => $imagePaths,
            'model_url' => $modelPath,
        ]);
    }

    public function deleteProductFiles(Product $product): void
    {
        if (is_array($product->images)) {
            foreach ($product->images as $img) {
                Storage::disk('public')->delete($img);
            }
        }
        if ($product->model_url) {
            Storage::disk('public')->delete($product->model_url);
        }
    }
}
