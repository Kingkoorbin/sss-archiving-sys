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
            'blood_type' => 'nullable|string',
            'email' => 'required|email',
            'tin' => 'nullable|string',
            'sss_no' => 'required|string',
            'philhealth_no' => 'nullable|string',
            'pagibig_no' => 'nullable|string',
            'rvm_retirement_no' => 'nullable|string',
            'bpi_atm_account_no' => 'nullable|string',
            'date_hired' => 'required|date',
            'date_resigned' => 'nullable|date',
            'main_employer' => 'required|string',
            'address' => 'required|string',
        ]);

        return $validator;
    }
}