<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// Model Imports
use App\Models\Activity;

class AcitivityController extends Controller
{
    /**
     * Constructor for the AcitivityController class.
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Retrieves all activities with pagination based on the provided request.
     *
     * @param Request $request The HTTP request object.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the paginated activities.
     */
    public function getAll(Request $request)
    {
        $perPage = $request->input('limit', 10); // Number of items per page, default is 10
        $currentPage = $request->input('page', 1); // Current page, default is 1

        $activities = Activity::orderBy('created_at', 'desc')
            ->with('user')
            ->paginate($perPage, ['*'], 'page', $currentPage);

        return response()->json($activities);
    }

}
