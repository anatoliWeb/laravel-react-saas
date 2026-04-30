<?php

namespace App\Observers;

use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

class PersonalAccessTokenObserver
{
    public function created(PersonalAccessToken $token): void
    {
        Log::info('PersonalAccessTokenObserver@created triggered', ['token_id' => $token->id]);

        activity_log('token_created', 'API token created', [
            'token_id' => $token->id,
            'token_name' => $token->name,
            'tokenable_id' => $token->tokenable_id,
            'tokenable_type' => $token->tokenable_type,
        ]);
    }

    public function deleted(PersonalAccessToken $token): void
    {
        Log::info('PersonalAccessTokenObserver@deleted triggered', ['token_id' => $token->id]);

        activity_log('token_deleted', 'API token deleted', [
            'token_id' => $token->id,
            'token_name' => $token->name,
            'tokenable_id' => $token->tokenable_id,
            'tokenable_type' => $token->tokenable_type,
        ]);
    }
}
