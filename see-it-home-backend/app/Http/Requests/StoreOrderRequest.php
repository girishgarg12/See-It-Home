<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'shipping_address'         => 'required|array',
            'shipping_address.street'  => 'required|string',
            'shipping_address.city'    => 'required|string',
            'shipping_address.state'   => 'required|string',
            'shipping_address.zip'     => 'required|string',
            'shipping_address.country' => 'required|string',
        ];
    }
}
