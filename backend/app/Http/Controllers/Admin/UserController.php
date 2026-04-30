<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

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
     * Show user edit form.
     *
     * Loads user roles and direct permissions
     * for editing access control settings.
     */
    public function edit($id)
    {
        $user = User::with(['roles', 'permissions'])->findOrFail($id);

        $roles = Role::all();
        $permissions = Permission::all();

        return view('admin.users.edit', compact(
            'user',
            'roles',
            'permissions'
        ));
    }

    /**
     * Update user data, roles and permissions.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        /**
         * Validate input
         */
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        /**
         * Update basic info
         */
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        /**
         * Sync roles (replace existing)
         */
        $user->roles()->sync($validated['roles'] ?? []);

        /**
         * Sync direct permissions
         */
        $user->permissions()->sync($validated['permissions'] ?? []);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User updated successfully');
    }
}
