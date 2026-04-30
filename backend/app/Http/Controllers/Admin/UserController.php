<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

/**
 * Admin users management controller.
 *
 * Responsible for displaying users list in admin panel.
 */
class UserController extends Controller
{
    /**
     * User service instance.
     */
    protected UserService $userService;

    /**
     * Inject dependencies.
     *
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display users list.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        try {
            $users = $this->userService->getUsers();

            return view('admin.users.index', [
                'users' => $users
            ]);

        } catch (\Throwable $e) {

            Log::error('Failed to load users for admin', [
                'error' => $e->getMessage(),
            ]);

            abort(500);
        }
    }

    /**
     * Edit user roles.
     */
    public function edit($id)
    {
        $user = User::with('roles')->findOrFail($id);
        $roles = Role::all();

        return view('admin.users.edit', compact('user', 'roles'));
    }

    /**
     * Update user roles.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // sync roles (replace existing)
        $user->roles()->sync($request->input('roles', []));

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User roles updated');
    }
}
