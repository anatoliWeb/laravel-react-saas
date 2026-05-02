<?php

namespace App\Observers;

use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Observer for API token lifecycle events.
 *
 * WHY:
 * Automatically logs token-related actions (create/delete)
 * without requiring explicit logging in business logic.
 *
 * This ensures:
 * - consistent audit trail
 * - separation of concerns
 * - minimal coupling between features and logging system
 */
class PersonalAccessTokenObserver
{
    /**
     * Handle token creation event.
     *
     * WHY:
     * Token creation is a sensitive operation (security-related),
     * so it must be tracked for auditing and debugging purposes.
     */
    public function created(PersonalAccessToken $token): void
    {
        // WHY:
        // Internal log helps debug observer execution issues
        // and ensures that observer is properly registered
        Log::info('PersonalAccessTokenObserver@created triggered', [
            'token_id' => $token->id
        ]);

        // WHY:
        // Centralized activity logging keeps audit records consistent
        // and allows future extensions (queues, external logging systems)
        activity_log('token_created', 'API token created', [
            'token_id' => $token->id,
            'token_name' => $token->name,

            // WHY:
            // Store relation info to understand which entity owns the token
            // (usually User, but can be extended to other models)
            'tokenable_id' => $token->tokenable_id,
            'tokenable_type' => $token->tokenable_type,
        ]);
    }

    /**
     * Handle token deletion event.
     *
     * WHY:
     * Token deletion is also critical for security auditing,
     * especially to track revocations or suspicious activity.
     */
    public function deleted(PersonalAccessToken $token): void
    {
        // WHY:
        // Log observer trigger for debugging and traceability
        Log::info('PersonalAccessTokenObserver@deleted triggered', [
            'token_id' => $token->id
        ]);

        // WHY:
        // Persist audit record of token removal
        // to maintain a full lifecycle history
        activity_log('token_deleted', 'API token deleted', [
            'token_id' => $token->id,
            'token_name' => $token->name,
            'tokenable_id' => $token->tokenable_id,
            'tokenable_type' => $token->tokenable_type,
        ]);
    }
}
