<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class ClientValidator {

    public static function validateCreateClient($request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'department' => 'required|string',
            'present_address' => 'required|string',
            'permanent_address' => 'required|string',
            'phone_number' => 'required|string',
            'gender' => 'required|string|in:MALE,FEMALE,OTHERS',
            'birthdate' => 'required|date',
            'personnel_category' => 'required|string',
            'suffix' => 'required|string',
            'civil_status' => 'required|string',
            'blood_type' => 'string',
            'email' => 'required|email',
            'tin' => 'string',
            'sss_no' => 'required|string',
            'philhealth_no' => 'string',
            'pagibig_no' => 'string',
            'rvm_retirement_no' => 'string',
            'bpi_atm_account_no' => 'string',
            'date_hired' => 'required|date',
            'date_resigned' => 'date',
            'main_employer' => 'string',
            'address' => 'string',
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