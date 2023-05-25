<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class TenantValidator {

    public static function validateCreateTenant($request)
    {

        $validator = Validator::make($request->all(), [
            'company_name' => 'required|unique:tenants|string|min:2|max:25',
            'description' => 'required|string|min:6|max:125',
            'address' => 'required|string|min:6|max:125',
            'subscription_plan' => 'required',
        ]);

        return $validator;
    }
}