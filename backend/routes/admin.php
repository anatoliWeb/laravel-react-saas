<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\TokenController;

/**
 * Admin routes.
 *
 * This file contains all routes related to internal administration panel.
 * Routes are grouped under /admin prefix and protected by authentication middleware.
 */
Route::get('/', function () {
    return view('admin.dashboard');
})->name('dashboard');

/**
 * Users management routes.
 */
Route::get('/users', [UserController::class, 'index'])
    ->name('users.index');

/**
 * Token management routes
 */
Route::get('/tokens', [TokenController::class, 'index'])
    ->name('tokens.index');

Route::post('/tokens', [TokenController::class, 'store'])
    ->name('tokens.store');

Route::delete('/tokens/{id}', [TokenController::class, 'destroy'])
    ->name('tokens.destroy');
