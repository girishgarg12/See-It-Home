<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'           => 'sometimes|string|max:255',
            'description'    => 'sometimes|string',
            'price'          => 'sometimes|numeric|min:0',
            'category'       => 'sometimes|string',
            'material'       => 'nullable|string',
            'dimensions'     => 'nullable|string',
            'stock_quantity' => 'sometimes|integer|min:0',
            'colors'         => 'nullable|array',
            'colors.*'       => 'string',
            'images'         => 'nullable|array|max:5',
            'images.*'       => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'model_file'     => 'nullable|file|max:51200',
            'is_published'   => 'nullable|in:true,false,1,0,"true","false"',
        ];
    }
}
