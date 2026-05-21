<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetMail;

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

    public function login(LoginRequest $request)
    {

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

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email:rfc,dns|max:255',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Don't reveal whether email exists
            return response()->json([
                'status'  => 'success',
                'message' => 'If this email is registered, you will receive a password reset link.',
            ]);
        }

        // Generate a reset token
        $token = Str::random(64);

        // Store token in password_resets collection
        DB::connection('mongodb')->table('password_resets')->where('email', $request->email)->delete();
        DB::connection('mongodb')->table('password_resets')->insert([
            'email'      => $request->email,
            'token'      => Hash::make($token),
            'created_at' => now(),
        ]);

        // Send reset email
        try {
            Mail::to($request->email)->send(new PasswordResetMail($token, $request->email));
        } catch (\Exception $e) {
            \Log::warning('Failed to send password reset email: ' . $e->getMessage());
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'If this email is registered, you will receive a password reset link.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email:rfc,dns|max:255',
            'token'    => 'required|string',
            'password' => [
                'required',
                'confirmed',
                \Illuminate\Validation\Rules\Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
        ]);

        $resetRecord = DB::connection('mongodb')
            ->table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Invalid or expired reset token.',
            ], 422);
        }

        // Check if token is valid
        if (!Hash::check($request->token, $resetRecord['token'])) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Invalid or expired reset token.',
            ], 422);
        }

        // Check if token is not older than 60 minutes
        $createdAt = $resetRecord['created_at'];
        if (now()->diffInMinutes($createdAt) > 60) {
            DB::connection('mongodb')->table('password_resets')->where('email', $request->email)->delete();
            return response()->json([
                'status'  => 'error',
                'message' => 'Reset token has expired. Please request a new one.',
            ], 422);
        }

        // Update password
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User not found.',
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Revoke all tokens
        $user->tokens()->delete();

        // Remove reset record
        DB::connection('mongodb')->table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Password reset successfully. Please log in with your new password.',
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
