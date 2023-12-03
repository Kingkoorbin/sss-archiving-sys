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

    public function deleteUserById($id) {
        try {
            $allowedRoles = ["ADMIN"];
            $user = auth()->user();

            if(!in_array($user->role, $allowedRoles)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Role not authorized',
                ], 401);
            }

            $user = User::where('id', $id)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found.',
                ], 404);
            }

            // Delete the Employee
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
