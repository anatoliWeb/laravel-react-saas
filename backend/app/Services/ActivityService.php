<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Throwable;

/**
 * Activity service.
 *
 * Handles logging and retrieving activity data.
 */
class ActivityService
{
    /**
     * Log new activity.
     */
    public function log(?int $userId, string $action, ?string $description = null, array $meta = []): void
    {
        try {
            Log::info('ActivityService::log called', [
                'action' => $action,
                'user_id' => $userId,
                'has_activity_logs_table' => Schema::hasTable('activity_logs'),
            ]);

            ActivityLog::create([
                'user_id' => $userId,
                'action' => $action,
                'description' => $description,
                'meta' => $meta,
            ]);
        } catch (Throwable $exception) {
            Log::error('ActivityService::log failed', [
                'action' => $action,
                'user_id' => $userId,
                'error' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * Get recent activity for dashboard.
     *
     * @return Collection<int, ActivityLog>
     */
    public function getRecent(int $limit = 10): Collection
    {
        try {
            if (!Schema::hasTable('activity_logs')) {
                Log::warning('ActivityService::getRecent skipped: activity_logs table is not visible on current connection');
                return collect();
            }

            return ActivityLog::with('user')
                ->latest()
                ->limit($limit)
                ->get();
        } catch (Throwable $exception) {
            Log::error('ActivityService::getRecent failed', [
                'error' => $exception->getMessage(),
            ]);

            return collect();
        }
    }
}
