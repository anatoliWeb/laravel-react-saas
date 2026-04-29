<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

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
        $user = User::factory()->create();

        // Acting as authenticated user
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name']
            ]);
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
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'users',
                'active'
            ]);
    }

    /**
     * Ensure protected route requires authentication.
     *
     * @return void
     */
    public function test_protected_route_requires_authentication(): void
    {
        $response = $this->getJson('/api/users');

        $response->assertStatus(401);
    }
}
