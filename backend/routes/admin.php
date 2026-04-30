<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\TokenController;
use App\Http\Controllers\Admin\DashboardController;

/**
 * Admin routes.
 *
 * All routes are:
 * - prefixed with /admin (in bootstrap/app.php)
 * - protected by auth + permission middleware
 */
Route::middleware(['permission:access_admin'])
    ->group(function () {

        /**
         * Dashboard
         */
        Route::get('/', [DashboardController::class, 'index'])
            ->name('dashboard');

        /**
         * Users management
         */
        Route::get('/users', [UserController::class, 'index'])
            ->middleware('permission:manage_users')
            ->name('users.index');

        /**
         * Token management
         */
        Route::get('/tokens', [TokenController::class, 'index'])
            ->middleware('permission:manage_tokens')
            ->name('tokens.index');

        Route::post('/tokens', [TokenController::class, 'store'])
            ->middleware('permission:manage_tokens')
            ->name('tokens.store');

        Route::delete('/tokens/{id}', [TokenController::class, 'destroy'])
            ->middleware('permission:manage_tokens')
            ->name('tokens.destroy');
    });
