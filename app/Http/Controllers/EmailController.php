<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mail;
use App\Mail\Email;

class EmailController extends Controller
{
    public function send(Request $request) {
        $content = [
            'title' => "$request->status | SSS Archiving System",
            'body' => $request->body
        ];

        Mail::to('madridano.kolya@gmail.com')->send(new Email($content));

        return response()->json([ 'message' => 'success'], 201);
    }
}
