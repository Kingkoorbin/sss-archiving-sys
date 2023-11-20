<?php

namespace App\Http\Controllers;

// Custom Imports
use App\Http\Validators\ClientValidator;
use App\Http\Validators\WorkHistoryValidator;
use App\Events\UserActivity;

// Laravel Imports
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;

// Model Imports
use App\Models\Client;
use App\Models\User;
use App\Models\WorkHistory;

class ClientController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function createClient(Request $request, $id)
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

            $validator = ClientValidator::validateCreateClient($request);

            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json([
                    'status' => 'error',
                    'message' => $errors->all(),
                ], 400);
            }

            // Check if a client with the same school_id already exists
            $existingClient = Client::where('school_id', $id)->first();

            if ($existingClient) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Employee already exists.',
                ], 400);
            }

            // Create a new client
            $client = Client::create([
                'school_id' => $id,
                'first_name' => $request->first_name,
                'middle_name' => $request->middle_name,
                'last_name' => $request->last_name,
                'present_address' => $request->present_address,
                'permanent_address' => $request->permanent_address,
                'department' => $request->department,
                'phone_number' => $request->phone_number,
                'gender' => $request->gender,
                'birthdate' => $request->birthdate,
            ]);

            $client->save();

            $userId = $user->id;
            event(new UserActivity('Employee info. added', $userId));

            return response()->json($client, 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e,
            ], 500);
        }
    }

    public function createWorkHistory(Request $request, $id) {
        $allowedRoles = ["ADMIN", "EMPLOYEE"];
        $user = auth()->user();

        if(!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        $validator = WorkHistoryValidator::validateWorkHistory($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        $client = Client::where('school_id', $id)->first();

        $workHistory = WorkHistory::create([
            'client_id' => $client->id,
            'company_name' => $request->company_name,
            'position' => $request->position,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'responsibilities' => $request->responsibilities,
        ]);

        $workHistory->save();

        $userId = $user->id;
        event(new UserActivity('Work History added', $userId));

        return response()->json($workHistory, 201);
    }

    public function deleteWorkHistoryById($id)
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

            // Find the work history by ID
            $workHistory = WorkHistory::find($id);

            if (!$workHistory) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Work History not found.',
                ], 404);
            }

            // Delete the work history
            $workHistory->delete();

            $userId = $user->id;
            event(new UserActivity('Work History deleted', $userId));

            return response()->json([
                'status' => 'success',
                'message' => 'Work History deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteClientById($id) {
        try {
            $allowedRoles = ["ADMIN"];
            $user = auth()->user();

            if(!in_array($user->role, $allowedRoles)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Role not authorized',
                ], 401);
            }

            $client = Client::where('school_id', $id)->first();

            if (!$client) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Employee Not found.',
                ], 404);
            }

            // Delete the Employee
            $client->delete();

            $userId = $user->id;
            event(new UserActivity('Employee deleted.', $userId));
                        
            return response()->json([
                'status' => 'success',
                'message' => 'Employee deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getClient(Request $request, $id)
    {
        $user = auth()->user();

        $allowedRoles = ["ADMIN", "EMPLOYEE"];

        if(!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        // Assuming 'school_id' is the column name, adjust it based on your actual column name
        $client = Client::where('school_id', $id)
            ->with('workHistory')
            ->first();

        if ($client) {
            return response()->json($client);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee Not found.',
            ], 404);
        }
    }

    public function getAll(Request $request)
    {
        $allowedRoles = ["ADMIN"];
        $user = auth()->user();

        if(!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        $clients = Client::with('workHistory')->get();

        return response()->json($clients);
    }

    public function updateClient(Request $request, $id)
    {
        $user = auth()->user();

        $allowedRoles = ["ADMIN"];

        if(!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        // Validate the request data
        $validator = ClientValidator::validateUpdateClient($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        // Find the client by ID
        // Find the client by school_id
        $client = Client::where('school_id', $id)->first();

        if (!$client) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee Not found.',
            ], 404);
        }

        // Update client data
        $client->update([
            'school_id' => $id,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'present_address' => $request->present_address,
            'permanent_address' => $request->permanent_address,
            'phone_number' => $request->phone_number,
            'gender' => $request->gender,
            'department' => $request->department,
            'birthdate' => $request->birthdate,
        ]);

        $userId = $user->id;
        event(new UserActivity('Employee info. updated', $userId));

        return response()->json($client);
    }

}
