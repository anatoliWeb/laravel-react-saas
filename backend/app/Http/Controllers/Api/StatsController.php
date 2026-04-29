<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
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
        try {
            $stats = $this->statsService->getStats();

            return response()->json($stats->toArray());

        } catch (\Throwable $e) {

            Log::error('Failed to fetch stats', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Internal Server Error'
            ], 500);
        }
    }
}
