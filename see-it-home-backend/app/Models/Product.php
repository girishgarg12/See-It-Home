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
        'stock_quantity', 'is_published', 'average_rating', 'review_count', 'is_featured'
    ];

    protected $attributes = [
        'is_published' => false,
        'is_featured' => false,
        'average_rating' => 0,
        'review_count' => 0,
    ];

    protected $casts = [
        'price' => 'float',
        'stock_quantity' => 'integer',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'average_rating' => 'float',
        'review_count' => 'integer',
    ];

    public function setIsPublishedAttribute($value)
    {
        $this->attributes['is_published'] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    public function setIsFeaturedAttribute($value)
    {
        $this->attributes['is_featured'] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = (float) $value;
    }

    public function setStockQuantityAttribute($value)
    {
        $this->attributes['stock_quantity'] = (int) $value;
    }


    // Scope for full-text search
    public function scopeSearch($query, $term)
    {
        return $query->where(function($q) use ($term) {
            $regex = new \MongoDB\BSON\Regex(preg_quote($term, '/'), 'i');
            $q->where('name', 'regex', $regex)
              ->orWhere('description', 'regex', $regex);
        });
    }

    public function scopeCategory($query, $category)
    {
        if (!$category || $category === 'All') return $query;
        
        // Map room categories to product categories
        $roomMapping = [
            'living-room' => ['Sofa', 'Chair', 'Table', 'Lamp', 'Decor'],
            'bedroom' => ['Bed', 'Wardrobe', 'Lamp', 'Decor'],
            'dining-room' => ['Table', 'Chair', 'Decor'],
            'home-office' => ['Desk', 'Chair', 'Bookshelf', 'Lamp']
        ];
        
        $categorySlug = strtolower(str_replace(' ', '-', $category));
        
        if (array_key_exists($categorySlug, $roomMapping)) {
            $mappedCategories = $roomMapping[$categorySlug];
            return $query->whereIn('category', $mappedCategories);
        }
        
        $singularCategory = rtrim($category, 'sS');
        $regex = new \MongoDB\BSON\Regex('^' . preg_quote($singularCategory, '/') . 's?$', 'i');
        
        return $query->where('category', 'regex', $regex);
    }

    // Scope for price range filter
    public function scopePriceRange($query, $min, $max)
    {
        if ($min) $query->where('price', '>=', (float)$min);
        if ($max) $query->where('price', '<=', (float)$max);
        return $query;
    }
}
