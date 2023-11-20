<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class AuthValidator
{
    public static function validateRegistration($request)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|in:EMPLOYEE,STAFF',
            'username' => 'required|unique:users|max:100',
            'password' => 'required|string|min:6|max:100|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/',
        ]);

        return $validator;
    }

    public static function validateLogin($request) {
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);

        return $validator;
    }
}
