<?php

namespace App\Services;

use App\DTO\StatsDTO;

class StatsService
{
    /**
     * Get application statistics.
     *
     * Returns mocked data for dashboard representation.
     *
     * @return StatsDTO
     */
    public function getStats(): StatsDTO
    {
        return new StatsDTO(2, 1);
    }
}