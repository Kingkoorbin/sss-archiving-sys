<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class UserValidator
{
    public static function createPermissionById($request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'permission_name_id' => 'required'
        ]);

        return $validator;
    }
}
