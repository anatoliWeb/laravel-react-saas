<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UsersController extends Controller
{
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
