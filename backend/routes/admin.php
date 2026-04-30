<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\TokenController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;

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

        Route::get('/users/{id}', [UserController::class, 'edit'])
            ->middleware('permission:manage_users')
            ->name('users.edit');

        Route::put('/users/{id}', [UserController::class, 'update'])
            ->middleware('permission:manage_users')
            ->name('users.update');

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

        /**
         * Roles management
         */
        Route::get('/roles', [RoleController::class, 'index'])
            ->middleware('permission:manage_users')
            ->name('roles.index');

        Route::get('/roles/{id}', [RoleController::class, 'edit'])
            ->middleware('permission:manage_users')
            ->name('roles.edit');

        Route::put('/roles/{id}', [RoleController::class, 'update'])
            ->middleware('permission:manage_users')
            ->name('roles.update');

        /**
         * Permissions management
         */
        Route::resource('permissions', PermissionController::class)
            ->middleware('permission:manage_users')
            ->names('permissions');
    });
