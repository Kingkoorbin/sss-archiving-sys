<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class SpaceValidator {

    public static function validateCreateSpace($request)
    {

        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        return $validator;
    }
}