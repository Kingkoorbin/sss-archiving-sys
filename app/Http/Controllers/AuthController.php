<?php

namespace App\Http\Controllers;

// Custom Imports
use App\Http\Validators\AuthValidator;
use App\Events\UserActivity;

// Laravel Imports
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Event;

// Model Imports
use App\Models\User;

class AuthController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api')->only('register');
    }

    public function login(Request $request)
    {
        $validator = AuthValidator::validateLogin($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        // Extract email and password only from client
        $credentials = $request->only('username', 'password');
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = JWTAuth::customClaims(['payload' => $user])->fromUser($user);

            $userId = $user->id;
            event(new UserActivity('Sign in', $user->id));

            return response()->json([
                'status' => 'success',
                'code' => '00',
                'role' => $user->role,
                'access_token' => $token,
            ]);
        }


        return response()->json([
            'status' => 'error',
            'code' => '9001',
            'message' => 'Email and/or Password is Incorrect.',
        ], 401);

    }

    public function register(Request $request)
    {
        $allowedRoles = ["ADMIN"];

        if(!in_array(auth()->user()->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        $validator = AuthValidator::validateRegistration($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        $user = User::create([
            'username' => $request->username,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        $token = JWTAuth::customClaims(['payload' => $user])->fromUser($user);

        return response()->json([
            'role' => $user->role,
            'access_token' => $token,
        ], 201); // Created status code
    }
}
