<?php

namespace App\Listeners;

use App\Events\SystemActionEvent;
use App\Services\ActivityService;

/**
 * Listener for logging system activity.
 */
class LogActivityListener
{
    protected ActivityService $activityService;

    public function __construct(ActivityService $activityService)
    {
        $this->activityService = $activityService;
    }

    /**
     * Handle event.
     */
    public function handle(SystemActionEvent $event): void
    {
        $this->activityService->log(
            $event->userId,
            $event->action,
            $event->description,
            $event->meta
        );
    }
}
