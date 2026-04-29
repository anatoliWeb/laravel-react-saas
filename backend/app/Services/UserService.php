<?php

namespace App\Services;

use App\DTO\UserDTO;

class UserService
{
    /**
     * Get list of users.
     *
     * This method simulates fetching users from data source.
     * In real application this will interact with database or external services.
     *
     * @return array<int, UserDTO>
     */
    public function getUsers(): array
    {
        return [
            new UserDTO(1, 'John Doe'),
            new UserDTO(2, 'Jane Doe'),
        ];
    }
}