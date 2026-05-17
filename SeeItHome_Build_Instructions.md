# SeeItHome — Complete Build Instructions
> AR-Powered Furniture Shopping Platform  
> Stack: Laravel (Backend) · React (Frontend) · MongoDB (Database) · model-viewer (AR/3D)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Environment Setup](#4-environment-setup)
5. [Database — MongoDB Collections](#5-database--mongodb-collections)
6. [Backend — Laravel](#6-backend--laravel)
7. [Frontend — React](#7-frontend--react)
8. [AR & 3D Features](#8-ar--3d-features)
9. [Feature Checklist](#9-feature-checklist)
10. [API Reference](#10-api-reference)
11. [Deployment Notes](#11-deployment-notes)

---

## 1. Project Overview

**SeeItHome** is a web-based furniture e-commerce platform where customers can browse furniture products, view them as interactive 3D models, and preview them in their real room using Augmented Reality on mobile devices.

**Core idea:**
- On **laptop/desktop** → users see a 3D viewer (rotate, zoom, inspect)
- On **mobile** → users get a full AR experience (place furniture in their room)
- One library (`model-viewer`) handles both automatically

**Short Description:**
> Visualize furniture in your home before buying — an AR-powered shopping platform built with Laravel, React & MongoDB.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Backend | Laravel 10 (PHP 8.2) | REST API, auth, business logic |
| Frontend | React 18 + Vite | Single page application |
| Database | MongoDB (Atlas) | Document storage |
| Authentication | Laravel Sanctum | Token-based API auth |
| AR / 3D Viewer | `<model-viewer>` by Google | 3D view on desktop, AR on mobile |
| 3D File Format | `.glb` (binary glTF) | Furniture 3D models |
| File Storage | Laravel Storage (local or S3) | Images and .glb files |
| HTTP Client | Axios | Frontend API calls |
| Email | Laravel Mail + SMTP/Mailgun | Notifications |
| Styling | Tailwind CSS | Frontend UI |

---

## 3. Folder Structure

### Laravel Backend
```
see-it-home-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   └── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CartController.php
│   │   │   ├── OrderController.php
│   │   │   ├── ReviewController.php
│   │   │   ├── WishlistController.php
│   │   │   └── Admin/
│   │   │       ├── AdminProductController.php
│   │   │       ├── AdminOrderController.php
│   │   │       ├── AdminUserController.php
│   │   │       └── AdminDashboardController.php
│   │   ├── Middleware/
│   │   │   └── IsAdmin.php
│   │   └── Requests/
│   │       ├── Auth/
│   │       │   ├── RegisterRequest.php
│   │       │   └── LoginRequest.php
│   │       ├── StoreProductRequest.php
│   │       ├── UpdateProductRequest.php
│   │       ├── StoreOrderRequest.php
│   │       └── StoreReviewRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Cart.php
│   │   ├── Order.php
│   │   ├── Review.php
│   │   └── Wishlist.php
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── ProductService.php
│   │   ├── CartService.php
│   │   ├── OrderService.php
│   │   └── PaymentService.php
│   ├── Events/
│   │   └── OrderStatusUpdated.php
│   └── Listeners/
│       └── SendOrderStatusEmail.php
├── routes/
│   └── api.php
├── config/
│   ├── database.php
│   ├── cors.php
│   └── filesystems.php
└── .env
```

### React Frontend
```
see-it-home-frontend/
├── src/
│   ├── api/
│   │   └── axios.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ARViewer.jsx
│   │   ├── CartItem.jsx
│   │   └── ReviewCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductListing.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Products.jsx
│   │       ├── Orders.jsx
│   │       └── Users.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useCart.js
│   └── App.jsx
```

---

## 4. Environment Setup

### Step 1 — Install Laravel Backend

```bash
composer create-project laravel/laravel see-it-home-backend
cd see-it-home-backend

# Install required packages
composer require jenssegers/mongodb
composer require laravel/sanctum
composer require mongodb/laravel-mongodb
```

### Step 2 — Configure .env

```env
APP_NAME=SeeItHome
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# MongoDB Connection
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=seeit_home
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/seeit_home

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=no-reply@seeithome.com
MAIL_FROM_NAME="SeeItHome"

# File Storage
FILESYSTEM_DISK=public
```

### Step 3 — Configure MongoDB in Laravel

In `config/database.php`, add:

```php
'mongodb' => [
    'driver'   => 'mongodb',
    'host'     => env('DB_HOST', '127.0.0.1'),
    'port'     => env('DB_PORT', 27017),
    'database' => env('DB_DATABASE', 'seeit_home'),
    'username' => env('DB_USERNAME', ''),
    'password' => env('DB_PASSWORD', ''),
    'options'  => [
        'database' => env('DB_AUTH_DATABASE', 'admin'),
    ],
],
```

Set default connection:
```php
'default' => env('DB_CONNECTION', 'mongodb'),
```

### Step 4 — Install Sanctum

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

In `app/Http/Kernel.php`, add to `api` middleware group:
```php
\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
```

### Step 5 — Configure CORS

In `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:5173'], // React dev server
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Step 6 — Create React Frontend

```bash
npm create vite@latest see-it-home-frontend -- --template react
cd see-it-home-frontend

# Install dependencies
npm install axios react-router-dom @tailwindcss/forms
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# model-viewer for AR and 3D
npm install @google/model-viewer
```

---

## 5. Database — MongoDB Collections

### users
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (bcrypt hashed)",
  "role": "customer | admin",
  "phone": "string (optional)",
  "addresses": [
    {
      "label": "Home",
      "street": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string",
      "is_default": true
    }
  ],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### products
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "price": "decimal",
  "category": "string (sofa | bed | table | chair | wardrobe)",
  "material": "string",
  "dimensions": { "length": 0, "width": 0, "height": 0, "unit": "cm" },
  "colors": ["string"],
  "images": ["storage/path/image1.jpg"],
  "model_url": "storage/path/model.glb",
  "stock_quantity": "integer",
  "is_published": "boolean",
  "average_rating": "decimal",
  "review_count": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### orders
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "items": [
    {
      "product_id": "ObjectId",
      "name": "string",
      "price": "decimal",
      "quantity": "integer",
      "color": "string",
      "image": "string"
    }
  ],
  "subtotal": "decimal",
  "shipping_fee": "decimal",
  "total": "decimal",
  "shipping_address": { "street": "", "city": "", "state": "", "zip": "", "country": "" },
  "payment_status": "pending | paid | failed | refunded",
  "payment_reference": "string",
  "status": "Pending | Processing | Shipped | Delivered | Cancelled",
  "status_history": [
    { "status": "Pending", "changed_at": "datetime", "note": "string" }
  ],
  "created_at": "datetime"
}
```

### carts
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (unique)",
  "items": [
    {
      "product_id": "ObjectId",
      "name": "string",
      "price": "decimal",
      "quantity": "integer",
      "color": "string",
      "image": "string"
    }
  ],
  "updated_at": "datetime"
}
```

### reviews
```json
{
  "_id": "ObjectId",
  "product_id": "ObjectId",
  "user_id": "ObjectId",
  "rating": "integer (1-5)",
  "comment": "string",
  "created_at": "datetime"
}
```

### wishlists
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (unique)",
  "product_ids": ["ObjectId"],
  "updated_at": "datetime"
}
```

---

## 6. Backend — Laravel

### Step 1 — Create Eloquent Models

**User Model** (`app/Models/User.php`):
```php
<?php
namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone', 'addresses'
    ];

    protected $hidden = ['password'];

    protected $attributes = [
        'role' => 'customer',
    ];
}
```

**Product Model** (`app/Models/Product.php`):
```php
<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'products';

    protected $fillable = [
        'name', 'description', 'price', 'category', 'material',
        'dimensions', 'colors', 'images', 'model_url',
        'stock_quantity', 'is_published', 'average_rating', 'review_count'
    ];

    protected $attributes = [
        'is_published' => false,
        'average_rating' => 0,
        'review_count' => 0,
    ];

    // Scope for full-text search
    public function scopeSearch($query, $term)
    {
        return $query->where(function($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%");
        });
    }

    // Scope for category filter
    public function scopeCategory($query, $category)
    {
        return $category ? $query->where('category', $category) : $query;
    }

    // Scope for price range filter
    public function scopePriceRange($query, $min, $max)
    {
        if ($min) $query->where('price', '>=', (float)$min);
        if ($max) $query->where('price', '<=', (float)$max);
        return $query;
    }
}
```

**Cart Model** (`app/Models/Cart.php`):
```php
<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Cart extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'carts';

    protected $fillable = ['user_id', 'items'];

    protected $attributes = ['items' => []];
}
```

**Order Model** (`app/Models/Order.php`):
```php
<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders';

    protected $fillable = [
        'user_id', 'items', 'subtotal', 'shipping_fee', 'total',
        'shipping_address', 'payment_status', 'payment_reference',
        'status', 'status_history'
    ];

    protected $attributes = [
        'status' => 'Pending',
        'payment_status' => 'pending',
        'status_history' => [],
    ];
}
```

---

### Step 2 — Create Middleware

**IsAdmin Middleware** (`app/Http/Middleware/IsAdmin.php`):
```php
<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }
        return $next($request);
    }
}
```

Register in `app/Http/Kernel.php`:
```php
protected $routeMiddleware = [
    // ...existing...
    'isAdmin' => \App\Http\Middleware\IsAdmin::class,
];
```

---

### Step 3 — Create Form Requests

**RegisterRequest** (`app/Http/Requests/Auth/RegisterRequest.php`):
```php
<?php
namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone'    => 'nullable|string|max:20',
        ];
    }
}
```

**StoreProductRequest** (`app/Http/Requests/StoreProductRequest.php`):
```php
<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'           => 'required|string|max:255',
            'description'    => 'required|string',
            'price'          => 'required|numeric|min:0',
            'category'       => 'required|string',
            'material'       => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'colors'         => 'nullable|array',
            'colors.*'       => 'string',
            'images'         => 'nullable|array|max:5',
            'images.*'       => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'model_file'     => 'nullable|file|max:51200', // 50MB max
        ];
    }
}
```

---

### Step 4 — Build Controllers

**AuthController** (`app/Http/Controllers/Auth/AuthController.php`):
```php
<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Registration successful',
            'data'    => ['user' => $user, 'token' => $token, 'token_type' => 'Bearer'],
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();
        $user->tokens()->delete(); // revoke old tokens
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Login successful',
            'data'    => ['user' => $user, 'token' => $token, 'token_type' => 'Bearer'],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data'   => $request->user(),
        ]);
    }
}
```

**ProductController** (`app/Http/Controllers/ProductController.php`):
```php
<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
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

        $products = $query->paginate($request->per_page ?? 12);

        return response()->json(['status' => 'success', 'data' => $products]);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);

        // Generate storage URL for model file
        if ($product->model_url) {
            $product->model_url = asset('storage/' . $product->model_url);
        }

        // Map image paths to full URLs
        $product->images = collect($product->images)
            ->map(fn($img) => asset('storage/' . $img))
            ->toArray();

        return response()->json(['status' => 'success', 'data' => $product]);
    }
}
```

**CartController** (`app/Http/Controllers/CartController.php`):
```php
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
```

**OrderController** (`app/Http/Controllers/OrderController.php`):
```php
<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Events\OrderStatusUpdated;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address'         => 'required|array',
            'shipping_address.street'  => 'required|string',
            'shipping_address.city'    => 'required|string',
            'shipping_address.state'   => 'required|string',
            'shipping_address.zip'     => 'required|string',
            'shipping_address.country' => 'required|string',
        ]);

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
```

**Admin Product Controller** (`app/Http/Controllers/Admin/AdminProductController.php`):
```php
<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminProductController extends Controller
{
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

    public function update(StoreProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        $data    = $request->validated();

        if ($request->hasFile('images')) {
            foreach ($product->images as $old) Storage::disk('public')->delete($old);
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
        foreach ($product->images as $img) Storage::disk('public')->delete($img);
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
}
```

**Admin Dashboard Controller** (`app/Http/Controllers/Admin/AdminDashboardController.php`):
```php
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
```

---

### Step 5 — Register API Routes

**routes/api.php**:
```php
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminUserController;

Route::prefix('v1')->group(function () {

    // ── Public Auth Routes ──────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password',  [AuthController::class, 'resetPassword']);
    });

    // ── Public Product Routes ───────────────────────
    Route::get('products',      [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);

    // ── Authenticated Routes ────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me',      [AuthController::class, 'me']);

        // Cart
        Route::get('cart',               [CartController::class, 'index']);
        Route::post('cart',              [CartController::class, 'addItem']);
        Route::put('cart/{index}',       [CartController::class, 'updateItem']);
        Route::delete('cart/{index}',    [CartController::class, 'removeItem']);
        Route::delete('cart',            [CartController::class, 'clear']);

        // Orders
        Route::get('orders',      [OrderController::class, 'index']);
        Route::post('orders',     [OrderController::class, 'store']);
        Route::get('orders/{id}', [OrderController::class, 'show']);

        // Reviews
        Route::post('products/{id}/reviews', [ReviewController::class, 'store']);

        // Wishlist
        Route::get('wishlist',              [WishlistController::class, 'index']);
        Route::post('wishlist/{productId}', [WishlistController::class, 'toggle']);
    });

    // ── Admin Routes ────────────────────────────────
    Route::middleware(['auth:sanctum', 'isAdmin'])->prefix('admin')->group(function () {

        Route::get('dashboard', [AdminDashboardController::class, 'index']);

        // Products
        Route::get('products',                       [AdminProductController::class, 'index']);
        Route::post('products',                      [AdminProductController::class, 'store']);
        Route::put('products/{id}',                  [AdminProductController::class, 'update']);
        Route::delete('products/{id}',               [AdminProductController::class, 'destroy']);
        Route::patch('products/{id}/toggle-publish', [AdminProductController::class, 'togglePublish']);

        // Orders
        Route::get('orders',                         [AdminOrderController::class, 'index']);
        Route::get('orders/{id}',                    [AdminOrderController::class, 'show']);
        Route::put('orders/{id}/status',             [AdminOrderController::class, 'updateStatus']);

        // Users
        Route::get('users',          [AdminUserController::class, 'index']);
        Route::patch('users/{id}',   [AdminUserController::class, 'update']);
        Route::delete('users/{id}',  [AdminUserController::class, 'destroy']);
    });
});
```

---

### Step 6 — Events & Listeners (Email Notifications)

**Create Event:**
```bash
php artisan make:event OrderStatusUpdated
php artisan make:listener SendOrderStatusEmail --event=OrderStatusUpdated
```

**Register in** `app/Providers/EventServiceProvider.php`:
```php
protected $listen = [
    OrderStatusUpdated::class => [
        SendOrderStatusEmail::class,
    ],
];
```

**SendOrderStatusEmail Listener:**
```php
public function handle(OrderStatusUpdated $event): void
{
    Mail::to($event->order->user->email)->send(
        new OrderStatusMail($event->order)
    );
}
```

Fire the event in `AdminOrderController@updateStatus`:
```php
$order->update([
    'status' => $request->status,
    'status_history' => array_merge($order->status_history, [[
        'status'     => $request->status,
        'changed_at' => now(),
        'note'       => $request->note ?? '',
    ]]),
]);

event(new OrderStatusUpdated($order));
```

---

## 7. Frontend — React

### Step 1 — Setup Axios

**src/api/axios.js**:
```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

### Step 2 — Auth Context

**src/context/AuthContext.jsx**:
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const logout = async () => {
    await api.delete('/auth/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Step 3 — AR Viewer Component

**src/components/ARViewer.jsx**:
```jsx
import { useEffect } from 'react';

// Import model-viewer as a web component
import '@google/model-viewer';

export default function ARViewer({ modelUrl, productName }) {
  if (!modelUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">3D preview not available for this product.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <model-viewer
        src={modelUrl}
        alt={`3D model of ${productName}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '500px', borderRadius: '12px' }}
      >
        {/* Custom AR button */}
        <button
          slot="ar-button"
          className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          View in Your Room
        </button>

        {/* Loading state */}
        <div slot="progress-bar" className="hidden" />
      </model-viewer>

      <p className="text-sm text-gray-500 mt-2 text-center">
        📱 Open on mobile for full AR experience · 🖥️ Use mouse to rotate on desktop
      </p>
    </div>
  );
}
```

### Step 4 — Product Detail Page

**src/pages/ProductDetail.jsx**:
```jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ARViewer from '../components/ARViewer';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id }                    = useParams();
  const { user }                  = useAuth();
  const [product, setProduct]     = useState(null);
  const [quantity, setQuantity]   = useState(1);
  const [selectedColor, setColor] = useState('');
  const [message, setMessage]     = useState('');

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data.data);
      setColor(res.data.data.colors?.[0] || '');
    });
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post('/cart', { product_id: id, quantity, color: selectedColor });
      setMessage('Added to cart!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding to cart');
    }
  };

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left — 3D / AR Viewer */}
      <div>
        <ARViewer modelUrl={product.model_url} productName={product.name} />
        {/* Image gallery */}
        <div className="flex gap-2 mt-4">
          {product.images?.map((img, i) => (
            <img key={i} src={img} className="w-20 h-20 object-cover rounded border" />
          ))}
        </div>
      </div>

      {/* Right — Product Info */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold text-gray-800">₹{product.price}</p>
        <p className="text-gray-600">{product.description}</p>

        <div>
          <p className="font-medium mb-1">Material: {product.material}</p>
          <p className="font-medium">
            Dimensions: {product.dimensions?.length} × {product.dimensions?.width} × {product.dimensions?.height} {product.dimensions?.unit}
          </p>
        </div>

        {/* Color selector */}
        {product.colors?.length > 0 && (
          <div>
            <p className="font-medium mb-2">Color:</p>
            <div className="flex gap-2">
              {product.colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-3 py-1 rounded border ${selectedColor === c ? 'border-black font-bold' : 'border-gray-300'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 border rounded">-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 border rounded">+</button>
        </div>

        {message && <p className="text-green-600 font-medium">{message}</p>}

        <div className="flex gap-4">
          <button onClick={addToCart} className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800">
            Add to Cart
          </button>
          <button className="px-4 py-3 border border-black rounded-lg">♡ Wishlist</button>
        </div>

        <p className="text-sm text-gray-500">
          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
        </p>
      </div>
    </div>
  );
}
```

---

## 8. AR & 3D Features

### How it works end to end

```
Admin uploads .glb file via admin panel
        ↓
Laravel stores file → storage/app/public/products/models/chair.glb
        ↓
Laravel returns model_url in product API response
        ↓
React receives model_url and passes it to <model-viewer src={model_url}>
        ↓
On Desktop → user sees 3D viewer (rotate, zoom with mouse)
On Mobile  → user sees "View in Your Room" button
              → taps it → camera opens → AR session starts
              → points phone at floor → furniture appears
```

### Getting Free .glb Models

- **Sketchfab.com** — search "furniture", filter by free + downloadable, download as `.glb`
- **Google Poly Archive** (via polycam.io)
- **Market3D.net** — free furniture models
- **Blender** — create your own (export as `.glb`)

### Tips for AR to work well

- Keep `.glb` file size under 5MB for fast loading
- Model must be real-world scale (a chair should be ~0.9m tall in the model)
- Test AR on Chrome Android (best support) and Safari iOS

---

## 9. Feature Checklist

### Must Have (Core)
- [ ] User registration and login (Sanctum)
- [ ] Product catalog with search and filters
- [ ] Product detail page with image gallery
- [ ] 3D model viewer (desktop — rotate/zoom)
- [ ] AR preview (mobile — place in room)
- [ ] Shopping cart (add, update, remove)
- [ ] Checkout and order placement
- [ ] Order history and detail view
- [ ] Admin — product CRUD with image + .glb upload
- [ ] Admin — order status management

### Should Have
- [ ] Wishlist (save for later)
- [ ] Product reviews and ratings
- [ ] Email notifications (order confirmation, status update)
- [ ] Stock management + low stock alerts in admin
- [ ] Password reset via email
- [ ] AR screenshot capture button
- [ ] Admin dashboard with analytics cards

### Nice to Have (Bonus)
- [ ] Recently viewed products
- [ ] Related products section
- [ ] Promo/discount coupon codes
- [ ] Product comparison
- [ ] Social share for AR screenshot

---

## 10. API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/v1/auth/register | No | Register new user |
| POST | /api/v1/auth/login | No | Login, get token |
| DELETE | /api/v1/auth/logout | Yes | Revoke token |
| GET | /api/v1/auth/me | Yes | Get current user |
| GET | /api/v1/products | No | List products (search, filter, paginate) |
| GET | /api/v1/products/{id} | No | Product detail with model_url |
| GET | /api/v1/cart | Yes | Get user cart |
| POST | /api/v1/cart | Yes | Add item to cart |
| PUT | /api/v1/cart/{index} | Yes | Update item quantity |
| DELETE | /api/v1/cart/{index} | Yes | Remove item |
| DELETE | /api/v1/cart | Yes | Clear cart |
| GET | /api/v1/orders | Yes | Order history |
| POST | /api/v1/orders | Yes | Place order |
| GET | /api/v1/orders/{id} | Yes | Order detail |
| POST | /api/v1/products/{id}/reviews | Yes | Submit review |
| GET | /api/v1/wishlist | Yes | Get wishlist |
| POST | /api/v1/wishlist/{productId} | Yes | Toggle wishlist |
| GET | /api/v1/admin/dashboard | Admin | Analytics |
| POST | /api/v1/admin/products | Admin | Create product |
| PUT | /api/v1/admin/products/{id} | Admin | Update product |
| DELETE | /api/v1/admin/products/{id} | Admin | Delete product |
| GET | /api/v1/admin/orders | Admin | All orders |
| PUT | /api/v1/admin/orders/{id}/status | Admin | Update order status |
| GET | /api/v1/admin/users | Admin | All users |

---

## 11. Deployment Notes

### Backend (Laravel)
```bash
# On production server
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan storage:link       # makes public storage accessible
php artisan queue:work         # run in background via Supervisor
```

### Frontend (React)
```bash
# Build for production
npm run build
# Deploy dist/ folder to hosting (Vercel, Netlify, or serve via Nginx)
```

### Environment Variables to Update for Production
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
MONGODB_URI=mongodb+srv://...   # Atlas connection string
FILESYSTEM_DISK=s3              # Use S3 for file storage in production
```

---

> Built by: [Your Name] | SeeItHome | Spring 2025
