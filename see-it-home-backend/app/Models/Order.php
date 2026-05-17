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
