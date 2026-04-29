<?php

use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/users', [UserController::class, 'index']);
Route::get('/stats', [StatsController::class, 'index']);

// TODO: Add Sanctum-protected routes group for authenticated API actions.
