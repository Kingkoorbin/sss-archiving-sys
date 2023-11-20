<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class WorkHistoryValidator {

    public static function validateWorkHistory($request)
    {

        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|min:8|max:75',
            'position' => 'required|string|min:8|max:75',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'responsibilities' => 'required|string|min:8|max:255',
        ]);

        return $validator;
    }
}