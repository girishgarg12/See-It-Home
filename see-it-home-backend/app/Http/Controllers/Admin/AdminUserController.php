<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $users]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'role' => 'nullable|string|in:customer,admin',
            'name' => 'nullable|string|max:255',
        ]);

        $user = User::findOrFail($id);

        if ($request->has('role')) {
            $user->role = $request->role;
        }
        if ($request->has('name')) {
            $user->name = $request->name;
        }

        $user->save();

        return response()->json(['status' => 'success', 'message' => 'User updated', 'data' => $user]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting yourself
        if ($user->_id === auth()->id()) {
            return response()->json(['status' => 'error', 'message' => 'Cannot delete your own account'], 422);
        }

        $user->delete();

        return response()->json(['status' => 'success', 'message' => 'User deleted']);
    }
}
