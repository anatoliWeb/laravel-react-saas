<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MetaController;

Route::post('/token', [AuthController::class, 'token']);
Route::post('/login', [AuthController::class, 'token']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::get('/stats', [StatsController::class, 'index']);
    Route::get('/meta', [MetaController::class, 'index']);
});
