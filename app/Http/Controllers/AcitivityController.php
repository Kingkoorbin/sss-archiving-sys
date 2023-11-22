<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// Model Imports
use App\Models\Activity;

class AcitivityController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

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
