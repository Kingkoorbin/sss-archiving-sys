<?php

namespace App\Http\Controllers;

// Custom Imports
use App\Events\UserActivity;
use App\Http\Validators\ContributionValidator;
use Carbon\Carbon;

// Laravel Imports
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;

// Models
use App\Models\Contributions;

class ContributionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only([
            'updateSbrValues', 
            'getAll',
            'deleteContributionById',
        ]);
    }

    /**
     * Retrieves all contributions based on the provided query parameters.
     *
     * @param Request $request The HTTP request object containing the query parameters.
     *                        - name: The name to filter contributions by (optional).
     *                        - sssNo: The SSS number to filter contributions by (optional).
     *                        - from: The start date to filter contributions by (optional).
     *                        - to: The end date to filter contributions by (optional).
     * @return \Illuminate\Http\JsonResponse The JSON response containing the retrieved contributions.
     */
    public function getAll(Request $request)
    {
        $name = $request->query('name');
        $sssNo = $request->query('sssNo');
        $from = $request->query('from');
        $to = $request->query('to');

        $query = Contributions::query();

        if ($sssNo) {
            $query->where('sss_no', $sssNo);
        }
        
        if ($name) {
            $query->where('name', 'ILIKE', "%$name%");
        }
        
        if ($from && $to) {
            $query->whereBetween('batchDate', [$from, $to]);
        }
        
        // Add orderBy clause for the latest update
        $query->orderBy('updated_at', 'desc');

        $contributions = $query->get();

        $contributions = $query->get();

        // Get the total count of JSON objects
        $count = $contributions->count();
    
        $totalSum = $contributions->reduce(function ($carry, $contribution) {
            // Remove comma separators from the 'total' string and then cast to float
            $total = (float) str_replace(',', '', $contribution->total);
            return $carry + $total;
        }, 0);
        
    
        // Attach the total count and total sum in headers
        $headers = [
            'nodex-generated-count' => $count,
            'nodex-generated-total' => $totalSum,
        ];
    
        return response()->json($contributions, 200, $headers);    
    }

    /**
     * Saves contributions from a request.
     *
     * @param Request $request The HTTP request object containing the contributions data.
     *                        - contributions: The array of contributions data.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the saved contributions data or an error message.
     */
    public function saveContributions(Request $request) {
        $validator = ContributionValidator::validateSaveContributions($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        $contributionsData = $request->contributions;
        $timestamp = now();

        foreach ($contributionsData as &$contribution) {
            $contribution['created_at'] = $timestamp;
            $contribution['updated_at'] = $timestamp;
        }

        Contributions::insert($contributionsData);

        return response()->json($contributionsData, 201);
    }

    /**
     * Saves a contribution based on the provided request data.
     *
     * @param Request $request The HTTP request object containing the contribution data.
     * @return \Illuminate\Http\JsonResponse The JSON response indicating the result of the contribution save operation.
     */
    public function saveContribution(Request $request) {
        $validator = ContributionValidator::validateSaveContribution($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        $contribution = Contributions::create($request->all());

        return response()->json([
            'message' => 'Contribution created successfully',
            'data' => $contribution
        ], 201);
    }

    /**
     * Updates the SBR values of a contribution.
     *
     * @param Request $request The HTTP request object containing the updated SBR values.
     * @param int $id The ID of the contribution to update.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the updated contribution or an error message.
     */
    public function updateSbrValues(Request $request, $id) {
        $allowedRoles = ["ADMIN", "STAFF"];
        $user = auth()->user();

        if(!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

        $validator = ContributionValidator::validateUpdateSbrValues($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        // Find the contribution by ID
        $contribution = Contributions::find($id);
        $contribution->update([
            'ss' => $request->ss,
            'ec' => $request->ec,
            'total' => $request->total,
            'name' => $request->name,
            'sss_no' => $request->sss_no,
            'sbr_date' => $request->sbr_date,
            'sbr_no' => $request->sbr_no,
        ]);

        $userId = $user->id;
        event(new UserActivity('SBR value updated.', $userId));

        return response()->json($contribution);
    }

    /**
     * Deletes a contribution by its ID.
     *
     * @param datatype $id The ID of the contribution to delete.
     * @throws \Exception If an error occurs during the deletion process.
     * @return \Illuminate\Http\JsonResponse The JSON response indicating the result of the deletion operation.
     */
    public function deleteContributionById($id)
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

            $contribution = Contributions::find($id);

            if (!$contribution) {
                return response()->json(['message' => 'Record not found.'], 404);
            }

            $contribution->delete();

            return response()->json(['message' => 'Record deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check if a batch date exists with the same year and month.
     *
     * @param Request $request The HTTP request object.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the existence status.
     */
    public function checkBatchDateExists(Request $request)
    {
        $batchDate = $request->query('batchDate');
        $year = date('Y', strtotime($batchDate));
        $month = date('m', strtotime($batchDate));

        // Check if any batch date exists with the same year and month
        $exists = Contributions::whereYear('batchDate', $year)
                               ->whereMonth('batchDate', $month)
                               ->exists();
                               
        return response()->json(['exists' => $exists]);
    }

    /**
     * Deletes contributions by batch.
     *
     * @param Request $request The request object containing the date to delete contributions for.
     * @throws \Exception If an error occurs during the deletion process.
     * @return \Illuminate\Http\JsonResponse The JSON response indicating the result of the deletion operation.
     */
    public function deleteContributionsByBatch(Request $request) {
        try {
            $validator = ContributionValidator::validateDeleteContributionsByBatch($request);
            if ($validator->fails()) {
                $errors = $validator->errors();
                return response()->json([
                    'status' => 'error',
                    'message' => $errors->all(),
                ], 400);
            }
            $inputDate = $request->input('date');
            $parsedDate = Carbon::parse($inputDate);

            $month = $parsedDate->format('m');
            $year = $parsedDate->format('Y');

            // Now use $month and $year in your database query
            Contributions::whereMonth('batchDate', '=', $month)
                     ->whereYear('batchDate', '=', $year)
                     ->delete();
            return response()->json(['message' => 'Rows deleted successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
