<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class WorkHistoryValidator {

    public static function validateWorkHistory($request)
    {

        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|min:2|max:75',
            'position' => 'required|string|min:6|max:75',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'responsibilities' => 'nullable|string|min:8|max:510',
        ]);

        return $validator;
    }
}