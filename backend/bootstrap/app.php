<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

use App\Http\Middleware\CorsMiddleware;
use App\Http\Middleware\PermissionMiddleware;
use App\Http\Middleware\RoleMiddleware;

/**
 * Application bootstrap configuration.
 *
 * This file is responsible for:
 * - routing setup (web, api, console, custom routes)
 * - global middleware registration
 * - exception handling configuration
 *
 * Acts as the central entry point for application configuration in modern Laravel.
 */
return Application::configure(basePath: dirname(__DIR__))

    /**
     * ------------------------------------------------------------
     * Routing Configuration
     * ------------------------------------------------------------
     *
     * Registers all route groups used in the application:
     * - web routes (session, CSRF, views)
     * - API routes (stateless, JSON)
     * - console commands
     * - health check endpoint
     */
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',

        /**
         * Register additional route groups AFTER Laravel
         * finishes its internal routing setup.
         *
         * Used for admin panel with custom middleware stack.
         */
        then: function (): void {
            Route::middleware(['web', 'auth', 'permission:access_admin'])
                ->prefix('admin')
                ->name('admin.')
                ->group(base_path('routes/admin.php'));
        },
    )

    /**
     * ------------------------------------------------------------
     * Middleware Configuration
     * ------------------------------------------------------------
     *
     * Registers global and aliased middleware.
     */
    ->withMiddleware(function (Middleware $middleware): void {

        /**
         * Global CORS middleware
         *
         * Must run FIRST to:
         * - handle preflight (OPTIONS) requests
         * - attach CORS headers before any other middleware
         *
         * This replaces nginx-based CORS handling.
         */
        $middleware->prepend(CorsMiddleware::class);

        /**
         * Middleware aliases
         *
         * Allows using short names in routes:
         * - permission: check specific permission
         * - role: check user role
         */
        $middleware->alias([
            'permission' => PermissionMiddleware::class,
            'role' => RoleMiddleware::class,
        ]);
    })

    /**
     * ------------------------------------------------------------
     * Exception Handling
     * ------------------------------------------------------------
     *
     * Customize how exceptions are handled and rendered.
     * (currently default behavior is used)
     */
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })

    /**
     * Create and return application instance
     */
    ->create();
