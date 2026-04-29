<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    /**
     * Display basic application statistics.
     *
     * Returns mocked statistical data used
     * for dashboard representation.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        return response()->json([
            'users' => 2,
            'active' => 1,
        ]);
    }
}
