<?php

namespace App\Services;

use App\Models\User;
use App\Models\Permission;
use App\DTO\UserDTO;
use Illuminate\Support\Facades\Hash;

/**
 * User service.
 *
 * WHY:
 * Encapsulates all user-related business logic in one place,
 * keeping controllers thin and focused on request/response handling.
 *
 * Provides a single source of truth for:
 * - user CRUD operations
 * - RBAC synchronization (roles + permissions)
 * - data transformation (DTO)
 */
class UserService
{
    /**
     * Get all users as DTO collection.
     *
     * WHY:
     * DTO isolates API output from internal model structure
     * and prevents accidental data exposure (e.g. passwords, hidden fields).
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
     * Get single user as DTO.
     *
     * WHY:
     * Keeps API response consistent with list endpoint
     * and avoids exposing raw Eloquent models.
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

    /**
     * Get raw user model with relations.
     *
     * WHY:
     * Used internally (e.g. admin forms) where full model access is required.
     * Loads only necessary fields to optimize query performance.
     */
    public function getById(int $id): User
    {
        return User::with('roles:id,name')->findOrFail($id);
    }

    /**
     * Create new user.
     *
     * WHY:
     * Handles:
     * - secure password hashing
     * - role assignment (RBAC)
     * - direct permission assignment
     *
     * Keeps all user creation logic centralized.
     */
    public function create(array $data): User
    {
        // WHY:
        // Password must always be hashed before storing
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // WHY:
        // Sync roles (many-to-many)
        // Using sync ensures full replacement (no duplicates)
        $user->roles()->sync($data['roles'] ?? []);

        // WHY:
        // Permissions are passed as names from frontend
        // Convert them to IDs before syncing to maintain DB integrity
        $user->permissions()->sync(
            Permission::whereIn('name', $data['permissions'] ?? [])->pluck('id')
        );

        // WHY:
        // Reload relations to return fresh state to API
        return $user->load('roles:id,name', 'permissions:id,name');
    }

    /**
     * Update existing user.
     *
     * WHY:
     * Supports partial updates while preserving security:
     * - password updated only if provided
     * - roles and permissions are fully synchronized
     */
    public function update(int $id, array $data): User
    {
        $user = User::findOrFail($id);

        // WHY:
        // Build update payload explicitly to avoid mass-assignment issues
        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        // WHY:
        // Only update password if provided (nullable in request)
        if (!empty($data['password'])) {
            $payload['password'] = Hash::make($data['password']);
        }

        $user->update($payload);

        // WHY:
        // Sync roles to reflect current state exactly
        $user->roles()->sync($data['roles'] ?? []);

        // WHY:
        // Convert permission names to IDs and sync
        $user->permissions()->sync(
            Permission::whereIn('name', $data['permissions'] ?? [])->pluck('id')
        );

        return $user->load('roles:id,name', 'permissions:id,name');
    }

    /**
     * Delete user.
     *
     * WHY:
     * Ensures relations are cleaned up before deletion
     * to maintain database integrity.
     */
    public function delete(int $id): void
    {
        $user = User::findOrFail($id);

        // WHY:
        // Detach roles before delete to avoid orphaned pivot data
        $user->roles()->detach();

        $user->delete();
    }
}
