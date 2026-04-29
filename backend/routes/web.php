<?php

use Illuminate\Support\Facades\Route;

Route::view('/admin', 'admin.index');

// TODO: Protect admin routes with auth middleware and dedicated guard.
