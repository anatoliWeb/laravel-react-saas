<?php

use Illuminate\Support\Facades\Route;

/**
 * Admin routes.
 *
 * This file contains all routes related to internal administration panel.
 * Routes are grouped under /admin prefix and protected by authentication middleware.
 */
Route::get('/', function () {
    return view('admin.dashboard');
})->name('admin.dashboard');