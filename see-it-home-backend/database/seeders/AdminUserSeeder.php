<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Check if admin already exists
        $admin = User::where('email', 'admin@seeithome.com')->first();
        
        if (!$admin) {
            User::create([
                'name' => 'Super Admin',
                'email' => 'admin@seeithome.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]);
        }
    }
}
