<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Models
use App\Models\PermissionName;

class PermissionNameController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getAll()
    {
        $allowedRoles = ["ADMIN"];
        $user = auth()->user();

        if(!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        $permissions = PermissionName::all();

        return response()->json($permissions);
    }

    public function create(Request $request)
    {
        $allowedRoles = ["ADMIN"];
        $user = auth()->user();

        if(!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        $request->validate([
            'name' => 'required|string|unique:permission_names',
        ]);

        $permission = PermissionName::create([
            'name' => $request->input('name'),
        ]);

        return response()->json($permission, 201);
    }

    public function delete($id)
    {
        $allowedRoles = ["ADMIN"];
        $user = auth()->user();

        if(!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }
        
        $permission = PermissionName::find($id);

        if (!$permission) {
            return response()->json(['message' => 'Permission not found.'], 404);
        }

        $permission->delete();

        return response()->json(['message' => 'Permission deleted successfully.']);
    }
}
