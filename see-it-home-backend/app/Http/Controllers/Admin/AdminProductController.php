<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminProductController extends Controller
{
    private function mapStorageUrl(string $path): string
    {
        if (str_starts_with($path, 'http')) return $path;
        if (str_starts_with($path, '/storage/')) return $path;
        if (str_starts_with($path, 'storage/')) return '/' . $path;
        return '/storage/' . $path;
    }

    public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->paginate(10);
        
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

    public function store(StoreProductRequest $request)
    {
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('products/images', 'public');
            }
        }

        $modelPath = null;
        if ($request->hasFile('model_file')) {
            $modelPath = $request->file('model_file')->store('products/models', 'public');
        }

        $product = Product::create([
            ...$request->validated(),
            'images'    => $imagePaths,
            'model_url' => $modelPath,
        ]);

        return response()->json(['status' => 'success', 'data' => $product], 201);
    }

    public function update(UpdateProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        $data    = $request->validated();

        if ($request->hasFile('images')) {
            if (is_array($product->images)) {
                foreach ($product->images as $old) Storage::disk('public')->delete($old);
            }
            $data['images'] = [];
            foreach ($request->file('images') as $image) {
                $data['images'][] = $image->store('products/images', 'public');
            }
        }

        if ($request->hasFile('model_file')) {
            if ($product->model_url) Storage::disk('public')->delete($product->model_url);
            $data['model_url'] = $request->file('model_file')->store('products/models', 'public');
        }

        $product->update($data);

        return response()->json(['status' => 'success', 'data' => $product]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if (is_array($product->images)) {
            foreach ($product->images as $img) Storage::disk('public')->delete($img);
        }
        if ($product->model_url) Storage::disk('public')->delete($product->model_url);
        $product->delete();

        return response()->json(['status' => 'success', 'message' => 'Product deleted']);
    }

    public function togglePublish($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['is_published' => !$product->is_published]);

        return response()->json(['status' => 'success', 'data' => $product]);
    }

    public function toggleFeatured($id)
    {
        $product = Product::findOrFail($id);
        $currentStatus = $product->is_featured ?? false;
        $product->is_featured = !$currentStatus;
        $product->save();

        return response()->json(['status' => 'success', 'data' => $product]);
    }
}
