<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Log;

/**
 * Observer for user lifecycle events.
 *
 * WHY:
 * Provides automatic audit logging for all critical user actions
 * (create, update, delete) without polluting business logic.
 *
 * This ensures:
 * - consistent activity tracking
 * - centralized audit trail
 * - minimal coupling between domain logic and logging
 */
class UserObserver
{
    /**
     * Handle user creation event.
     *
     * WHY:
     * Creating a user is a key system event that should be logged
     * for auditing, onboarding tracking, and debugging.
     */
    public function created(User $user): void
    {
        // WHY:
        // Internal log helps verify observer execution
        // and diagnose issues in production
        Log::info('UserObserver@created triggered', [
            'user_id' => $user->id
        ]);

        // WHY:
        // Record structured audit event for system-wide tracking
        activity_log('user_created', 'User created', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }

    /**
     * Handle user update event.
     *
     * WHY:
     * Updates are logged with specific changed fields
     * to provide detailed audit history and traceability.
     */
    public function updated(User $user): void
    {
        // WHY:
        // getChanges() returns only modified attributes,
        // allowing us to log precise changes instead of full model state
        $changes = array_keys($user->getChanges());

        Log::info('UserObserver@updated triggered', [
            'user_id' => $user->id,
            'changes' => $changes,
        ]);

        // WHY:
        // Store only changed fields to keep logs concise and meaningful
        activity_log('user_updated', 'User updated', [
            'user_id' => $user->id,
            'changed' => $changes,
        ]);
    }

    /**
     * Handle user deletion event.
     *
     * WHY:
     * Deleting a user is a critical action and must be tracked
     * for security auditing and compliance.
     */
    public function deleted(User $user): void
    {
        Log::info('UserObserver@deleted triggered', [
            'user_id' => $user->id
        ]);

        // WHY:
        // Preserve minimal identifying data after deletion
        // since model will no longer exist in database
        activity_log('user_deleted', 'User deleted', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }
}
