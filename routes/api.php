<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Authentication
Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
    Route::post('/register', 'register');
}); 

// Client
Route::controller(ClientController::class)->group(function () {
    Route::get('/c/me', 'getClient');
    Route::post('/c/me', 'createClient');
    // Route::get('todo/{id}', 'show');
    // Route::put('todo/{id}', 'update');
    // Route::delete('todo/{id}', 'destroy');
}); 

