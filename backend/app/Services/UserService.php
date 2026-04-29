<?php

namespace App\Services;

class UserService
{
    /**
     * TODO: Replace mocked payload with repository-driven query.
     */
    public function getMockedUsers(): array
    {
        return [
            ['id' => 1, 'name' => 'Alice Founder', 'email' => 'alice@example.com'],
            ['id' => 2, 'name' => 'Bob Operator', 'email' => 'bob@example.com'],
        ];
    }
}
