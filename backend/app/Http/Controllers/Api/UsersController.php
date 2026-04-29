<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        return response()->json([
            ['id' => 1, 'name' => 'John Doe'],
            ['id' => 2, 'name' => 'Jane Doe'],
        ]);
    }
}
