<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mail;
use App\Mail\Email;

class EmailController extends Controller
{
    /**
     * Sends an email using the provided request data.
     *
     * @param Request $request The request object containing the email data.
     *                        - status: The status of the email.
     *                        - body: The body of the email.
     *                        - email: The recipient's email address.
     * @return \Illuminate\Http\JsonResponse The JSON response indicating the success of the email sending process.
     */
    public function send(Request $request) {
        $content = [
            'title' => "$request->status | SSS Archiving System",
            'body' => $request->body
        ];

        Mail::to($request->email)->send(new Email($content));

        return response()->json([ 'message' => 'success'], 201);
    }
}
