<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Models
use App\Models\PermissionName;

class PermissionNameController extends Controller
{
    /**
     * Constructor for the class.
     *
     * This function sets up the middleware for authentication using the 'auth:api' guard.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Retrieves all permissions for the authenticated user.
     *
     * @throws \Illuminate\Auth\AuthenticationException if the user is not authenticated
     * @return \Illuminate\Http\JsonResponse the JSON response containing the permissions
     */
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

    /**
     * Creates a new permission name for the ADMIN role.
     *
     * @param Request $request The HTTP request object containing the permission name.
     *                        - name: The name of the permission (required, string, unique).
     * @return \Illuminate\Http\JsonResponse The JSON response containing the created permission name.
     *                                       If the user's role is not ADMIN, returns a JSON response with the error message and status code 401.
     *                                       If the validation fails, returns a JSON response with the error message and status code 400.
     *                                       If the permission name is created successfully, returns a JSON response with the created permission name and status code 201.
     */
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

    /**
     * Deletes a permission by its ID if the authenticated user has the ADMIN role.
     *
     * @param int $id The ID of the permission to delete.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the result of the deletion.
     *                                       - If the user's role is not ADMIN, returns a JSON response with the error message and status code 401.
     *                                       - If the permission is not found, returns a JSON response with the error message and status code 404.
     *                                       - If the permission is deleted successfully, returns a JSON response with the success message and status code 200.
     */
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
