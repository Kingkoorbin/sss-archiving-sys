<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class ContributionValidator {
    public static function validateUpdateSbrValues($request)
    {
        $validator = Validator::make($request->all(), [
            'ss' => 'required|string',
            'ec' => 'required|string',
            'total' => 'required|string',
            'name' => 'required|string',
            'sss_no' => 'required|string',
            'sbr_no' => 'nullable|numeric',
            'sbr_date' => 'nullable|date',
        ]);

        return $validator;
    }

    public static function validateSaveContributions($request)
    {
        $validator = Validator::make($request->all(), [
            'contributions' => 'required|array',
            'contributions.*.name' => 'required|string',
            'contributions.*.total' => 'required|string',
            'contributions.*.ss' => 'required|string',
            'contributions.*.ec' => 'required|string',
            'contributions.*.sss_no' => 'required|string',
            'contributions.*.batchDate' => 'required|date',
        ]);

        return $validator;
    }
}