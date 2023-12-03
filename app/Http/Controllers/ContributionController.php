<?php

namespace App\Http\Controllers;

// Custom Imports
use App\Events\UserActivity;
use App\Http\Validators\ContributionValidator;

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
            'deleteContributionById'
        ]);
    }

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
            $query->whereBetween('sbr_date', [$from, $to]);
        }
        
        $contributions = $query->get();
        
        return response()->json($contributions);
    }

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

    public function updateSbrValues(Request $request, $id) {
        $allowedRoles = ["ADMIN"];
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
            'sbr_date' => $request->sbr_date,
            'sbr_no' => $request->sbr_no,
        ]);

        $userId = $user->id;
        event(new UserActivity('SBR value updated.', $userId));

        return response()->json($contribution);
    }

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

}
