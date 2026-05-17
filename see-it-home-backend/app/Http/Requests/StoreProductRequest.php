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
            'is_published'   => 'nullable|in:true,false,1,0,"true","false"',
        ];
    }
}
