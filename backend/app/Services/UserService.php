<?php

namespace App\Services;

use App\Models\User;
use App\DTO\UserDTO;

/**
 * User service.
 *
 * Handles user-related business logic.
 */
class UserService
{
    /**
     * Get all users as DTO collection.
     *
     * @return array<int, UserDTO>
     */
    public function getUsers(): array
    {
        return User::with('roles')
            ->get()
            ->map(function ($user) {
                return new UserDTO(
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->roles->pluck('name')->toArray()
                );
            })
            ->toArray();
    }

    /**
     * Get single user DTO.
     */
    public function getUser(int $id): UserDTO
    {
        $user = User::with('roles')->findOrFail($id);

        return new UserDTO(
            $user->id,
            $user->name,
            $user->email,
            $user->roles->pluck('name')->toArray()
        );
    }
}
