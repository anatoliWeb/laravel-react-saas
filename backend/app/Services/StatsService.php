<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Stats service.
 *
 * Provides dashboard metrics.
 */
class StatsService
{
    /**
     * Get dashboard statistics.
     *
     * @return array<string, int>
     */
    public function getStats(): array
    {
        return [
            'users_total' => User::count(),

            'admins' => User::whereHas('roles', fn($q) =>
            $q->where('name', 'admin')
            )->count(),

            'managers' => User::whereHas('roles', fn($q) =>
            $q->where('name', 'manager')
            )->count(),

            'tokens_total' => PersonalAccessToken::count(),

            'users_with_direct_permissions' => User::whereHas('permissions')->count(),
        ];
    }
}
