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
    Route::get('products/{id}/reviews', [ReviewController::class, 'index']);

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
        Route::patch('products/{id}/toggle-featured', [AdminProductController::class, 'toggleFeatured']);

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
