<?php

namespace App\Http\Controllers;

// Custom Imports
use App\Http\Validators\ClientValidator;

// Laravel Imports
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

// Model Imports
use App\Models\Client;

class ClientController extends Controller
{
    
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    
    public function createClient(Request $request)
    {
        // Validate the request data
 
        $validator = ClientValidator::validateCreateClient($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }
    
        // Check if a client with the same user_id already exists
        $existingClient = Client::where('user_id', auth()->user()->id)->first();
        if ($existingClient) {
            return response()->json([
                'status' => 'error',
                'message' => 'Client already exists for the user',
                'data' => null,
            ], 400);
        }

        // Create a new client
        $client = Client::create([
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'present_address' => $request->input('present_address'),
            'permanent_address' => $request->input('permanent_address'),
            'birthdate' => $request->input('birthdate'),
            'user_id' => auth()->user()->id,
        ]);
        $client->save();

        return response()->json([
            'status' => 'ok',
            'message' => 'Client created successfull',
            'data' => $client,
        ], 201);
    }

    public function getClient(Request $request)
    {
        if (!request()->header('Authorization')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Access Token is required',
                'data' => null
            ], 401);
        }
        $user = auth()->user();
        $client = $user->client;

        if ($client) {
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
                'message' => 'Client not found for the user.',
            ], 400);
        }
    }
}
