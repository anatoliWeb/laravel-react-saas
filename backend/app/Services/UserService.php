<?php

namespace App\Services;

class UserService
{
    /**
     * Get list of users.
     *
     * This method simulates fetching users from data source.
     * In real application this will interact with database or external services.
     *
     * @return array
     */
    public function getUsers(): array
    {
        return [
            ['id' => 1, 'name' => 'John Doe'],
            ['id' => 2, 'name' => 'Jane Doe'],
        ];
    }
}