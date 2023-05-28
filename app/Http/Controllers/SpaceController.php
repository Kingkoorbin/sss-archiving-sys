<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// Custom Imports
use App\Http\Validators\SpaceValidator;

// Model Imports
use App\Models\Space;


class SpaceController extends Controller
{
  
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function create(Request $request)
    {
        if(auth()->user()->role !== "TENANT") {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }
        // Validate the request data
        $validator = SpaceValidator::validateCreateSpace($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        // Create a new space
        $space = Space::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'user_id' => auth()->user()->id,
        ]);
        $space->save();

        return response()->json([
            'status' => 'ok',
            'message' => 'Space created successfully',
            'data' => $space,
        ], 201);
    }

    public function getAll() {
    $spaces = Space::where('user_id', auth()->user()->id)
    ->orderBy('id', 'desc')
    ->get();
    return response()->json([
        'status' => 'success',
        'message' => 'Space retrieved successfully',
        'data' => $spaces,
    ], 200);
    }

}
