<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StatsService;

class StatsController extends Controller
{
    /**
     * Stats service instance.
     *
     * Handles business logic for application statistics.
     */
    protected StatsService $statsService;

    /**
     * Create a new controller instance.
     *
     * @param StatsService $statsService
     */
    public function __construct(StatsService $statsService)
    {
        $this->statsService = $statsService;
    }


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
