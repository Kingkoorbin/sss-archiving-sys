<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class ContributionRequestValidator {

    public static function validateCreateRequest($request)
    {

        $validator = Validator::make($request->all(), [
            'sss_no' => 'required|string|min:2|max:75',
            'name' => 'required|string|min:2|max:75',
            'date_of_employment' => 'required|date',
            'date_of_resignation' => 'required|date',
            'requester' => 'required|string',
            'email' => 'required|email',
            'phone_number' => 'required|string|unique:clients|min:13|max:13',
            'date_needed' => 'required|date',
            'status' => 'required|string|in:PENDING,PROCESSING,REJECTED,DONE',
        ]);

        return $validator;
    }

    public static function validateUpdateStatusByNumber($request)
    {

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:PENDING,PROCESSING,REJECTED,DONE',
        ]);

        return $validator;
    }
}