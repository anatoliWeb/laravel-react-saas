<?php

namespace App\Services;

class StatsService
{
    /**
     * TODO: Replace mocked values with computed KPI metrics.
     */
    public function getMockedStats(): array
    {
        return [
            'activeUsers' => 24,
            'monthlyRevenue' => 1250,
            'serverHealth' => 'ok',
        ];
    }
}
