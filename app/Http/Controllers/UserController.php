<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

// Laravel Imports
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;

// Model Imports
use App\Models\User;
use App\Models\UserPermission;
use App\Models\PermissionName;
use App\Http\Validators\UserValidator;

// Custom Imports
use App\Events\UserActivity;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getByUserId() {
        try {
            // Get the authenticated user
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found.',
                ], 404);
            }

            // Load the user_permissions relationship
            $user = User::with('userPermissions.permissionName:id,name,created_at,updated_at')->find($user->id);

            return response()->json($user);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteUserById($id) {
        try {
            $allowedRoles = ["ADMIN"];
    
            $currentUser = auth()->user();
    
            // Check if the role is authorized to delete a user
            if (!in_array($currentUser->role, $allowedRoles)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Role not authorized',
                ], 401);
            }

            // Retrieve the user by ID
            $user = User::where('id', $id)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found.',
                ], 404);
            }
    
            // Delete the user
            $user->delete();
    
            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    

    public function createPermissionById(Request $request) {
        try {
            $allowedRoles = ["ADMIN"];
            $user = auth()->user();

            if(!in_array($user->role, $allowedRoles)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Role not authorized',
                ], 401);
            }

            $validator = UserValidator::createPermissionById($request);
            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json([
                    'status' => 'error',
                    'message' => $errors->all(),
                ], 400);
            }

            // Validate user existence
            $userExists = User::find($request->user_id);
            if (!$userExists) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found.',
                ], 404);
            }

            // Validate permission existence
            $permissionExists = PermissionName::find($request->permission_name_id);
            if (!$permissionExists) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Permission not found.',
                ], 404);
            }

            $userId = $user->id;

            // Create a user permission
            $userPermission = UserPermission::create([
                'user_id' => $request->user_id,
                'permission_name_id' => $request->permission_name_id,
            ]);

            $userPermission->save();

            event(new UserActivity('User permission added', $userId));

            return response()->json($userPermission, 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteUserPermissionById($id)
    {
       try {
            $allowedRoles = ["ADMIN"];
            $user = auth()->user();

            if(!in_array($user->role, $allowedRoles)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Role not authorized',
                ], 401);
            }

            $userPermission = UserPermission::find($id);

            if (!$userPermission) {
                return response()->json(['message' => 'User permission not found.'], 404);
            }

            $userPermission->delete();

            return response()->json(['message' => 'User permission deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

}
