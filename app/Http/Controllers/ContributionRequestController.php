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
    /**
     * Constructor for the class.
     *
     * This function sets up the middleware for authentication using the 'auth:api' guard.
     * It applies the middleware to the 'updateStatusById' and 'getAll' methods.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api')->only([
            'updateStatusById',
            'getAll',
        ]);;
    }

    /**
     * Retrieves all contribution requests based on the provided query parameters.
     *
     * @param Request $request The HTTP request object containing the query parameters.
     *                        - status: The status to filter contribution requests by (optional).
     * @return \Illuminate\Http\JsonResponse The JSON response containing the retrieved contribution requests.
     *                                       If an error occurs, a JSON response with the error message and status code 500 is returned.
     */
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
    

    /**
     * Creates a new contribution request.
     *
     * @param Request $request The HTTP request object containing the contribution request data.
     *                        - sss_no: The SSS number of the contributor.
     *                        - name: The name of the contributor.
     *                        - date_of_employment: The date of employment of the contributor.
     *                        - date_of_resignation: The date of resignation of the contributor.
     *                        - requester: The name of the requester.
     *                        - email: The email address of the requester.
     *                        - phone_number: The phone number of the requester.
     *                        - date_needed: The date needed for the request.
     *                        - all: Indicates if all contributions are requested.
     *                        - status: The status of the request.
     *                        - relationship: The relationship of the contributor to the requester.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the created contribution request.
     *                                       If validation fails, a JSON response with the error message and status code 400 is returned.
     */
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
            'all' => $request->all,
            'status' => $request->status,
            'relationship' => $request->relationship,
        ]);

        $request->save();

        return response()->json($request, 201);
    }

    /**
     * Updates the status of a contribution request by ID.
     *
     * @param Request $request The HTTP request object containing the contribution request data.
     * @throws \Exception If an error occurs during the update process.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the updated contribution request.
     */
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
