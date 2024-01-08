<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SpaceController;
use App\Http\Controllers\ContributionRequestController;
use App\Http\Controllers\AcitivityController;
use App\Http\Controllers\ContributionController;
use App\Http\Controllers\PermissionNameController;
use App\Http\Controllers\EmailController;

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
    Route::post('/auth/v1/login', 'login');
    Route::post('/auth/v1/register', 'register');
});

// User
Route::controller(UserController::class)->group(function () {
    Route::post('/user/v1/permission', 'createPermissionById');
    Route::get('/user/v1', 'getByUserId');
    Route::delete('/user/v1/permission/{id}', 'deleteUserPermissionById');
    Route::delete('/user/v1/{id}', 'deleteUserById');
});

// Permission Names
Route::controller(PermissionNameController::class)->group(function () {
    Route::get('/permission/v1', 'getAll');
    Route::post('/permission/v1', 'create');
    Route::delete('/permission/v1/{id}', 'delete');
});

// Client
Route::controller(ClientController::class)->group(function () {
    Route::post('/client/v1/{id}', 'createClient');
    Route::delete('/client/v1/{id}', 'deleteClientById');
    Route::post('/client/v1/{id}/workhistory', 'createWorkHistory');
    Route::get('/client/v1/{id}/information', 'getClient');
    Route::get('/client/v1', 'getAll');
    Route::put('/client/v1/{id}', 'updateClient');
    Route::delete('/client/v1/{id}/workhistory', 'deleteWorkHistoryById');
});

// Contributions Requests
Route::controller(ContributionRequestController::class)->group(function () {
    Route::get('/contribution/v1', 'getAll');
    Route::post('/contribution/v1', 'createRequest');
    Route::put('/contribution/v1', 'updateStatusById');
});

// Contributions (Records)
Route::controller(ContributionController::class)->group(function () {
    Route::get('/record/v1', 'getAll');
    Route::post('/record/v1', 'saveContributions');
    Route::put('/record/v1/{id}/sbr', 'updateSbrValues');
    Route::delete('/record/v1/{sssNo}', 'deleteContributionById');
});

/// Services
Route::controller(EmailController::class)->group(function () {
    Route::post('/email/v1', 'send');
});

// Activities
Route::controller(AcitivityController::class)->group(function () {
    Route::get('/activities/v1', 'getAll');
});