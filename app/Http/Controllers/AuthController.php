<?php

namespace App\Http\Controllers;

// Custom Imports
use App\Http\Validators\AuthValidator;

// Laravel Imports
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

// Model Imports
use App\Models\User;

class AuthController extends Controller
{
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
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = JWTAuth::customClaims(['payload' => $user])->fromUser($user);

            return response()->json([
                'status' => 'ok',
                'message' => 'Login successful',
                'data' => $token,
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Invalid credentials',
        ], 401);

    }
    
    public function register(Request $request)
    {
        $validator = AuthValidator::validateRegistration($request);
    
        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }
    
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'role' => $request->role,
        ]);
    
        return response()->json([
            'status' => 'ok',
            'message' => 'User registered successfully'
        ], 201); // Created status code
    }
}
