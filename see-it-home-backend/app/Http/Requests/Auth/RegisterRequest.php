<?php
namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'     => 'required|string|min:3|max:50|regex:/^[a-zA-Z\s]+$/',
            'email'    => 'required|email:rfc,dns|max:255|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers()->symbols()
            ],
            'phone'    => 'nullable|string|digits:10',
        ];
    }
}
