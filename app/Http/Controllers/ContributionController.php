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
        $this->middleware('auth:api');
    }

    public function getAll(Request $request)
    {
        $allowedRoles = ["ADMIN"];
        $user = auth()->user();
    
        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }
        
        $name = $request->query('name');
        $sssNo = $request->query('sssNo');
        $from = $request->query('from');
        $to = $request->query('to');

        if ($sssNo) {
            $contributions = Contributions::where('sss_no', $sssNo)->get();
            return response()->json($contributions);
        } 
        else if ($name) {
            $contributions = Contributions::where('name', 'ILIKE', "%$name%")->get();
            return response()->json($contributions);
        }
        else if($from && $to) {
            $contributions = Contributions::whereBetween('sbr_date', [$from, $to])->get();
            return response()->json($contributions);
        }
        return response()->json(Contributions::all());
    }
    
    public function saveContributions(Request $request) {
        $allowedRoles = ["ADMIN"];
        $user = auth()->user();

        if(!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }

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

        $userId = $user->id;
        event(new UserActivity('Contribution added.', $userId));
        
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

}
