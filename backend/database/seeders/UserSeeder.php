<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Seed full RBAC demo data.
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        /**
         * Permissions
         */
        $permissions = [
            'access_admin',
            'manage_users',
            'manage_tokens',
        ];

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(
                ['name' => $perm],
                ['description' => ucfirst(str_replace('_', ' ', $perm))]
            );
        }

        /**
         * Roles
         */
        $adminRole = Role::updateOrCreate(
            ['name' => 'admin'],
            ['description' => 'Administrator']
        );

        $managerRole = Role::updateOrCreate(
            ['name' => 'manager'],
            ['description' => 'Manager']
        );

        $userRole = Role::updateOrCreate(
            ['name' => 'user'],
            ['description' => 'User']
        );

        /**
         * Assign permissions to roles
         */
        $adminRole->permissions()->sync(Permission::pluck('id'));

        $managerRole->permissions()->sync(
            Permission::whereIn('name', [
                'access_admin',
                'manage_tokens'
            ])->pluck('id')
        );

        /**
         * Admin user
         */
        $admin = User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
            ]
        );

        $admin->roles()->sync([$adminRole->id]);

        /**
         * Create multiple users
         */
        for ($i = 1; $i <= 15; $i++) {

            $user = User::updateOrCreate(
                ['email' => "user{$i}@test.com"],
                [
                    'name' => "User {$i}",
                    'password' => Hash::make('password'),
                ]
            );

            /**
             * Random role assignment
             */
            $role = match (true) {
                $i <= 2 => $adminRole,
                $i <= 6 => $managerRole,
                default => $userRole,
            };

            $user->roles()->sync([$role->id]);

            /**
             * Direct permissions (occasionally)
             */
            if ($i % 3 === 0) {
                $user->permissions()->syncWithoutDetaching([
                    Permission::where('name', 'manage_tokens')->first()->id
                ]);
            }

            /**
             * Create tokens
             */
            for ($t = 1; $t <= rand(1, 3); $t++) {
                $user->createToken("token_{$i}_{$t}");
            }
        }
    }
}