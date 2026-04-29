<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\StatsController;

Route::get('/users', [UsersController::class, 'index']);
Route::get('/stats', [StatsController::class, 'index']);