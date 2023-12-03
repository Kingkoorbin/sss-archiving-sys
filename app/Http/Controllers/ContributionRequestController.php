<?php

namespace App\Http\Controllers;

// Custom Imports
use App\Http\Validators\ContributionRequestValidator;
use App\Events\UserActivity;

// Laravel Imports
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;

// Models
use App\Models\ContributionRequest;

class ContributionRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only([
            'updateStatusById',
            'getAll',
        ]);;
    }

    public function getAll(Request $request)
    {
        try {
            $status = $request->query('status');
    
            $contributionRequests = ContributionRequest::when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })->get();
    
            return response()->json($contributionRequests);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    

    public function createRequest(Request $request) {
        $validator = ContributionRequestValidator::validateCreateRequest($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        $request = ContributionRequest::create([
            // 'editor' => $id,
            'sss_no' => $request->sss_no,
            'name' => $request->name,
            'date_of_employment' => $request->date_of_employment,
            'date_of_resignation' => $request->date_of_resignation,
            'requester' => $request->requester,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'date_needed' => $request->date_needed,
            'status' => $request->status,
        ]);

        $request->save();

        return response()->json($request, 201);
    }

    public function updateStatusById(Request $request)
    {
        try {
            $allowedRoles = ["ADMIN", "STAFF"];
            $user = auth()->user();

            if(!in_array($user->role, $allowedRoles)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Role not authorized',
                ], 401);
            }

            $validator = ContributionRequestValidator::validateUpdateStatusByNumber($request);

            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json([
                    'status' => 'error',
                    'message' => $errors->all(),
                ], 400);
            }

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 400);
            }

            // Find the contribution request by sss_no
            $contributionRequest = ContributionRequest::find($request->id);

            if (!$contributionRequest) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Contribution request not found.',
                ], 404);
            }

            // Update the status
            $contributionRequest->update([
                'editor' => $user->id,
                'status' => $request->status,
            ]);

            $userId = $user->id;
            event(new UserActivity('Request status updated.', $userId));

            return response()->json($contributionRequest);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e,
            ], 500);
        }
    }
}
