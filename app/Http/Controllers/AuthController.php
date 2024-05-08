<?php

namespace App\Http\Controllers;

// Custom Imports
use App\Http\Validators\AuthValidator;
use App\Events\UserActivity;

// Laravel Imports
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Event;

// Model Imports
use App\Models\User;

class AuthController extends Controller
{

    /**
     * Constructor for the class.
     *
     * This function sets up the middleware for authentication using the 'auth:api' guard.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api')->only('register');
    }

    /**
     * Logs in a user.
     *
     * @param Request $request The request object containing the login credentials.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the login result.
     */
    public function login(Request $request)
    {
        $validator = AuthValidator::validateLogin($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        // Extract email and password only from client
        $credentials = $request->only('username', 'password');
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = JWTAuth::customClaims(['payload' => $user])->fromUser($user);

            $userId = $user->id;
            event(new UserActivity('Sign in', $user->id));

            return response()->json([
                'status' => 'success',
                'code' => '00',
                'role' => $user->role,
                'access_token' => $token,
            ]);
        }


        return response()->json([
            'status' => 'error',
            'code' => '9001',
            'message' => 'Email and/or Password is Incorrect.',
        ], 401);

    }

    /**
     * Registers a new user.
     *
     * This function checks if the authenticated user has the role of "ADMIN". If not, it returns a JSON response with an error message.
     * Then, it validates the registration request using the `AuthValidator::validateRegistration()` method. If the validation fails, it returns a JSON response with the validation errors.
     * If the validation passes, it creates a new user in the database with the provided username, role, and password.
     * It generates a JWT token for the newly created user using the `JWTAuth::customClaims()` method.
     * It triggers a `UserActivity` event with the message "Registered an account." and the ID of the authenticated user.
     * Finally, it returns a JSON response with the user's role and the generated access token. The response status code is 201 (Created).
     *
     * @param Request $request The request object containing the registration data.
     * @throws JWTException If there is an error generating the JWT token.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the user's role and access token.
     */
    public function register(Request $request)
    {
        $allowedRoles = ["ADMIN"];

        if(!in_array(auth()->user()->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not authorized',
            ], 401);
        }
        $validator = AuthValidator::validateRegistration($request);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors->all(),
            ], 400);
        }

        $user = User::create([
            'username' => $request->username,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        $token = JWTAuth::customClaims(['payload' => $user])->fromUser($user);

        $userId = $user->id;
        event(new UserActivity('Registered an account.', auth()->user()->id));

        return response()->json([
            'role' => $user->role,
            'access_token' => $token,
        ], 201); // Created status code
    }
}
