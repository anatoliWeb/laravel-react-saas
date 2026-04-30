<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserObserver
{
    public function created(User $user): void
    {
        Log::info('UserObserver@created triggered', ['user_id' => $user->id]);

        activity_log('user_created', 'User created', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }

    public function updated(User $user): void
    {
        Log::info('UserObserver@updated triggered', [
            'user_id' => $user->id,
            'changes' => array_keys($user->getChanges()),
        ]);

        activity_log('user_updated', 'User updated', [
            'user_id' => $user->id,
            'changed' => array_keys($user->getChanges()),
        ]);
    }

    public function deleted(User $user): void
    {
        Log::info('UserObserver@deleted triggered', ['user_id' => $user->id]);

        activity_log('user_deleted', 'User deleted', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }
}
