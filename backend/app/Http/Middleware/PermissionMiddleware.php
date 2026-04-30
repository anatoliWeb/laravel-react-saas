<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Check user permissions.
 *
 * Usage:
 * - permission:manage_users
 * - permission:manage_users|manage_tokens  (any)
 * - permission:manage_users,manage_tokens (all)
 */
class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, string $permissions)
    {
        $user = auth()->user();

        if (!$user) {
            abort(401);
        }

        /**
         * ALL permissions (comma separated)
         * Example: permission:a,b
         */
        if (str_contains($permissions, ',')) {
            $required = explode(',', $permissions);

            foreach ($required as $permission) {
                if (!$user->hasPermission(trim($permission))) {
                    abort(403);
                }
            }

            return $next($request);
        }

        /**
         * ANY permissions (pipe separated)
         * Example: permission:a|b
         */
        if (str_contains($permissions, '|')) {
            $required = explode('|', $permissions);

            foreach ($required as $permission) {
                if ($user->hasPermission(trim($permission))) {
                    return $next($request);
                }
            }

            abort(403);
        }

        /**
         * Single permission
         */
        if (!$user->hasPermission($permissions)) {
            abort(403);
        }

        return $next($request);
    }
}