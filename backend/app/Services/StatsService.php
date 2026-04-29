<?php

namespace App\Services;

class StatsService
{
    /**
     * Get application statistics.
     *
     * Returns mocked data for dashboard representation.
     *
     * @return array
     */
    public function getStats(): array
    {
        return [
            'users' => 2,
            'active' => 1,
        ];
    }
}