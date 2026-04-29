<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ApiTest extends TestCase
{
    /**
     * Ensure the /api/users endpoint returns a valid response.
     *
     * This test verifies:
     * - HTTP status is 200
     * - Response structure matches expected user format
     * - At least one user is returned
     *
     * @return void
     */
    public function test_users_endpoint_returns_valid_data(): void
    {
        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name']
            ])
            ->assertJsonCount(2); // expecting mocked dataset
    }

    /**
     * Ensure the /api/stats endpoint returns correct statistics structure.
     *
     * This test verifies:
     * - HTTP status is 200
     * - Required fields exist in response
     * - Data format is suitable for dashboard usage
     *
     * @return void
     */
    public function test_stats_endpoint_returns_valid_data(): void
    {
        $response = $this->getJson('/api/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'users',
                'active'
            ]);
    }
}
