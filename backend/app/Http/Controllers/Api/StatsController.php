<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StatsService;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function __construct(private readonly StatsService $statsService)
    {
    }

    public function index(): JsonResponse
    {
        // TODO: Replace with aggregated metrics from real domain services.
        return response()->json([
            'data' => $this->statsService->getMockedStats(),
            'meta' => ['source' => 'mock'],
        ]);
    }
}
