<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService)
    {
    }

    public function index(): JsonResponse
    {
        // TODO: Replace with DB-backed user list once repository layer is implemented.
        return response()->json([
            'data' => $this->userService->getMockedUsers(),
            'meta' => ['source' => 'mock'],
        ]);
    }
}
