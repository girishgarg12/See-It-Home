<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Wishlist extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'wishlists';

    protected $fillable = ['user_id', 'product_ids'];

    protected $attributes = [
        'product_ids' => [],
    ];
}
