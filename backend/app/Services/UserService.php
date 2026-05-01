<?php

namespace App\Services;

use App\Models\User;
use App\DTO\UserDTO;
use Illuminate\Support\Facades\Hash;

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

    public function getById(int $id): User
    {
        return User::with('roles:id,name')->findOrFail($id);
    }

    public function create(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->roles()->sync($data['roles'] ?? []);

        return $user->load('roles:id,name');
    }

    public function update(int $id, array $data): User
    {
        $user = User::findOrFail($id);

        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        if (!empty($data['password'])) {
            $payload['password'] = Hash::make($data['password']);
        }

        $user->update($payload);
        $user->roles()->sync($data['roles'] ?? []);

        return $user->load('roles:id,name');
    }

    public function delete(int $id): void
    {
        $user = User::findOrFail($id);
        $user->roles()->detach();
        $user->delete();
    }
}
