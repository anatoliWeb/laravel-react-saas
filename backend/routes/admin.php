<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\TokenController;

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
        Route::get('/', function () {
            return view('admin.dashboard');
        })->name('admin.dashboard');

        /**
         * Users management
         */
        Route::get('/users', [UserController::class, 'index'])
            ->middleware('permission:manage_users')
            ->name('admin.users.index');

        /**
         * Token management
         */
        Route::get('/tokens', [TokenController::class, 'index'])
            ->middleware('permission:manage_tokens')
            ->name('admin.tokens.index');

        Route::post('/tokens', [TokenController::class, 'store'])
            ->middleware('permission:manage_tokens')
            ->name('admin.tokens.store');

        Route::delete('/tokens/{id}', [TokenController::class, 'destroy'])
            ->middleware('permission:manage_tokens')
            ->name('admin.tokens.destroy');
    });