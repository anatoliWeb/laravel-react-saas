<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MetaController;

Route::post('/token', [AuthController::class, 'token']);
Route::post('/login', [AuthController::class, 'token']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:users.view');
    Route::get('/users/{user}', [UserController::class, 'show'])
        ->middleware('permission:users.view');
    Route::post('/users', [UserController::class, 'store'])
        ->middleware('permission:users.create');
    Route::put('/users/{user}', [UserController::class, 'update'])
        ->middleware('permission:users.edit');
    Route::patch('/users/{user}', [UserController::class, 'update'])
        ->middleware('permission:users.edit');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->middleware('permission:users.delete');

    Route::get('/stats', [StatsController::class, 'index']);
    Route::get('/meta', [MetaController::class, 'index']);
});
