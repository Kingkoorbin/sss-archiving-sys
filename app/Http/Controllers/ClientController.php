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
                'suffix' => $request->suffix,
                'present_address' => $request->present_address,
                'permanent_address' => $request->permanent_address,
                'department' => $request->department,
                'phone_number' => $request->phone_number,
                'gender' => $request->gender,
                'birthdate' => $request->birthdate,
                'address' => $request->address,
                'main_employer' => $request->main_employer,
                'date_hired' => $request->date_hired,            
                'date_resigned' => $request->date_resigned,
                'bpi_atm_account_no' => $request->bpi_atm_account_no,
                'rvm_retirement_no' => $request->rvm_retirement_no,
                'pagibig_no' => $request->pagibig_no,
                'philhealth_no' => $request->philhealth_no,
                'sss_no' => $request->sss_no,
                'tin' => $request->tin,
                'email' => $request->email,
                'blood_type' => $request->blood_type,
                'civil_status' => $request->civil_status,
                'personnel_category' => $request->personnel_category,
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
            $allowedRoles = ["ADMIN", "STAFF"];
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

    public function getClient(Request $request)
    {
        $user = auth()->user();
        $allowedRoles = ["ADMIN", "STAFF"];
        $searchKeyword = $request->query('searchKeyword');

        if(!$searchKeyword) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee Not found.',
            ], 404);
        }
        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        $query = Client::query();

        if ($searchKeyword) {
            $query->where(function ($subQuery) use ($searchKeyword) {
                $subQuery->where('department', 'ILIKE', '%' . $searchKeyword . '%')
                    ->orWhere('school_id', 'ILIKE', '%' . $searchKeyword . '%')
                    ->orWhere(function ($nameQuery) use ($searchKeyword) {
                        $nameQuery->where('first_name', 'ILIKE', '%' . $searchKeyword . '%')
                            ->orWhere('middle_name', 'ILIKE', '%' . $searchKeyword . '%')
                            ->orWhere('last_name', 'ILIKE', '%' . $searchKeyword . '%');
                    })
                    ->orWhere('sss_no', 'ILIKE', '%' . $searchKeyword . '%');
            });
        }

        $client = $query->with('workHistory')->first();

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
        $allowedRoles = ["ADMIN", "STAFF"];
        $user = auth()->user();

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        $type = $request->query('role');
        $department = $request->query('department');

        if ($type && strtoupper($type) === 'STAFF') {
            // Fetch STAFF from the users table
            $staff = User::orderBy('created_at', 'desc')
                ->where('role', '=', 'STAFF')
                ->with('userPermissions.permissionName:id,name,created_at,updated_at')
                ->get();
            return response()->json($staff);
        }

        else if ($type && strtoupper($type) === 'EMPLOYEE') {
            // Fetch STAFF from the users table
            $employees = Client::orderBy('created_at', 'desc')
                ->where('department', 'ILIKE', "%$department%")
                ->with('workHistory')
                ->with('contributions') // Use the custom contributions method
                ->get();

            return response()->json($employees);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Incomplete query parameters.',
        ], 404);
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
            'suffix' => $request->suffix,
            'present_address' => $request->present_address,
            'permanent_address' => $request->permanent_address,
            'department' => $request->department,
            'phone_number' => $request->phone_number,
            'gender' => $request->gender,
            'birthdate' => $request->birthdate,
            'address' => $request->address,
            'main_employer' => $request->main_employer,
            'date_hired' => $request->date_hired,
            'date_resigned' => $request->date_resigned,
            'bpi_atm_account_no' => $request->bpi_atm_account_no,
            'rvm_retirement_no' => $request->rvm_retirement_no,
            'pagibig_no' => $request->pagibig_no,
            'philhealth_no' => $request->philhealth_no,
            'sss_no' => $request->sss_no,
            'tin' => $request->tin,
            'email' => $request->email,
            'blood_type' => $request->blood_type,
            'civil_status' => $request->civil_status,
            'personnel_category' => $request->personnel_category,
        ]);

        $userId = $user->id;
        event(new UserActivity('Employee info. updated', $userId));

        return response()->json($client);
    }

}
