<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Admin dashboard controller.
 */
class DashboardController extends Controller
{
    public function index()
    {
        return view('admin.dashboard', [
            'usersCount' => User::count(),

            'adminsCount' => User::whereHas('roles', fn($q) => $q->where('name', 'admin'))->count(),

            'managersCount' => User::whereHas('roles', fn($q) => $q->where('name', 'manager'))->count(),

            'tokensCount' => PersonalAccessToken::count(),

            'usersWithDirectPermissions' => User::whereHas('permissions')->count(),
        ]);
    }
}
