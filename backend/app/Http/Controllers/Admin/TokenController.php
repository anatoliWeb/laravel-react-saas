<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Token management controller.
 *
 * Handles listing, creating and deleting API tokens.
 */
class TokenController extends Controller
{
    /**
     * Display tokens list.
     */
    public function index()
    {
        try {
            $tokens = auth()->user()->tokens;

            return view('admin.tokens.index', compact('tokens'));

        } catch (\Throwable $e) {
            Log::error('Failed to load tokens', [
                'error' => $e->getMessage(),
            ]);

            abort(500);
        }
    }

    /**
     * Create new token.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'abilities' => 'nullable|array'
        ]);

        /**
         * Create token with optional abilities (scopes).
         */
        $token = $request->user()->createToken(
            $request->name,
            $request->input('abilities', ['*'])
        );

        return redirect()
            ->back()
            ->with('token', $token->plainTextToken);
    }

    /**
     * Delete token.
     */
    public function destroy($id)
    {
        $token = auth()->user()->tokens()->findOrFail($id);
        $token->delete();

        return redirect()->back()->with('success', 'Token deleted');
    }
}
