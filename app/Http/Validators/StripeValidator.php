<?php

namespace App\Http\Validators;

use Illuminate\Support\Facades\Validator;

class StripeValidator {

    public static function validateCreateSubscription($request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|string',
            'price_id' => 'required|string',
        ]);

        return $validator;
    }
}