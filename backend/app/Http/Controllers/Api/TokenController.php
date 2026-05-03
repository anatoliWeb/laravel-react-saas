<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class TokenController extends Controller
{
    public function index(Request $request)
    {
        $owner = $request->user();

        $tokens = $owner
            ->tokens()
            ->select(['id', 'name', 'created_at'])
            ->orderByDesc('id')
            ->get()
            ->map(function ($token) use ($owner) {
                return [
                    'id' => $token->id,
                    'name' => $token->name,
                    'created_at' => $token->created_at,
                    'owner' => [
                        'id' => $owner->id,
                        'name' => $owner->name,
                    ],
                ];
            })
            ->values();

        return response()->json([
            'data' => $tokens,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $token = $request->user()->createToken($validated['name']);

        // WHY:
        // Token value is returned only once for security reasons.
        return response()->json([
            'data' => [
                'id' => $token->accessToken->id,
                'name' => $token->accessToken->name,
                'created_at' => $token->accessToken->created_at,
                'owner' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                ],
            ],
            'token' => $token->plainTextToken,
        ], 201);
    }

    public function destroy(Request $request, int $id)
    {
        $token = PersonalAccessToken::findOrFail($id);

        // WHY:
        // Tokens are user-scoped to prevent cross-user access.
        if ((int) $token->tokenable_id !== (int) $request->user()->id || $token->tokenable_type !== get_class($request->user())) {
            abort(403);
        }

        $token->delete();

        return response()->json([
            'message' => 'Token deleted successfully',
        ]);
    }
}
