<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Seed initial users (admin + demo users).
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        /**
         * Create admin user (or update if exists).
         */
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        /**
         * Create demo users.
         */
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@test.com',
            ],
            [
                'name' => 'Jane Doe',
                'email' => 'jane@test.com',
            ],
        ];

        foreach ($users as $data) {
            User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'role' => 'user',
                ]
            );
        }
    }
}
