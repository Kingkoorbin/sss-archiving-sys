<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class AuthValidator
{
    public static function validateRegistration($request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users|max:100',
            'password' => 'required|string|min:6|max:100|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/',
            'phone_number' => 'required|string|unique:users|min:13|max:13',
            'role' => 'required|string|in:ADMIN,TENANT,USER',
        ]);

        return $validator;
    }

    public static function validateLogin($request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        return $validator;
    }
}
