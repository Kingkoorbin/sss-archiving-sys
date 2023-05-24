<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class ClientValidator {

    public static function validateCreateClient($request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'present_address' => 'required|string',
            'permanent_address' => 'required|string',
            'birthdate' => 'required|date',
        ]);

        return $validator;
    }
}