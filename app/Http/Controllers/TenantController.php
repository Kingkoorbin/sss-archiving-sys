<?php

namespace App\Http\Controllers;

// Custom Imports
use App\Http\Validators\TenantValidator;

use Illuminate\Http\Request;

// Model Imports
use App\Models\Tenant;


class TenantController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function createTenant(Request $request)
    {
        if(auth()->user()->role !== "TENANT") {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }
        // Validate the request data
        
        $validator = TenantValidator::validateCreateTenant($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }
    
        // Check if a client with the same user_id already exists
        $existingClient = Tenant::where('user_id', auth()->user()->id)->first();
        if ($existingClient) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tenant already exists',
                'data' => null,
            ], 400);
        }

        // Create a new client
        $client = Tenant::create([
            'company_name' => $request->input('company_name'),
            'description' => $request->input('description'),
            'address' => $request->input('address'),
            'subscription_plan' => json_encode($request->input('subscription_plan')),
            'verified' => false,
            'user_id' => auth()->user()->id,
        ]);
        $client->save();

        return response()->json([
            'status' => 'ok',
            'message' => 'Profile created successfully',
            'data' => $client,
        ], 201);
    }

    public function me(Request $request)
    {
        if(auth()->user()->role !== "TENANT") {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        $user = auth()->user();
        $tenant = $user->tenant;

        if ($tenant) {
            return response()->json([
                'status' => 'ok',
                'message' => 'Success',
                'data' => [
                    'user' => $user,
                ]
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Tenant not found for the user.',
            ], 400);
        }
    }
}
