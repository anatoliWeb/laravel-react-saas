<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use App\Services\UserService;

class UsersController extends Controller
{
    /**
     * User service instance.
     *
     * Handles business logic related to users.
     */
    protected UserService $userService;

    /**
     * Create a new controller instance.
     *
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a list of users.
     *
     * Returns a mocked collection of users.
     * This endpoint is used for initial API integration
     * and frontend development.
     *
     * @return \Illuminate\Http\JsonResponse
     */    
    public function index() {
        try {
            $users = $this->userService->getUsers();

            return response()->json(
                array_map(fn($user) => $user->toArray(), $users)
            );

        } catch (\Throwable $e) {

            /**
             * Log unexpected error.
             */
            Log::error('Failed to fetch users', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Internal Server Error'
            ], 500);
        }
    }
}
