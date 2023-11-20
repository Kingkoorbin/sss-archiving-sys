<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class ClientValidator {

    public static function validateCreateClient($request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|min:2|max:75',
            'middle_name' => 'required|string|min:2|max:75',
            'last_name' => 'required|string|min:2|max:75',
            'department' => 'required|string|min:2|max:75',
            'present_address' => 'required|string',
            'permanent_address' => 'required|string',
            'phone_number' => 'required|string|unique:clients|min:13|max:13',
            'gender' => 'required|string|in:MALE,FEMALE,OTHERS',
            'birthdate' => 'required|date',
        ]);

        return $validator;
    }

    public static function validateUpdateClient($request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|min:2|max:75',
            'middle_name' => 'required|string|min:2|max:75',
            'last_name' => 'required|string|min:2|max:75',
            // 'department' => 'required|string|min:2|max:75',
            'present_address' => 'required|string',
            'permanent_address' => 'required|string',
            'phone_number' => 'required|string|min:13|max:13',
            'gender' => 'required|string|in:MALE,FEMALE,OTHERS',
            'birthdate' => 'required|date',
        ]);

        return $validator;
    }
}