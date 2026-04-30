<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;

/**
 * Manage roles and their permissions.
 */
class RoleController extends Controller
{
    /**
     * List all roles.
     */
    public function index()
    {
        $roles = Role::withCount('permissions')->get();

        return view('admin.roles.index', compact('roles'));
    }

    /**
     * Edit role permissions.
     */
    public function edit($id)
    {
        $role = Role::findOrFail($id);
        $permissions = Permission::all();

        return view('admin.roles.edit', compact('role', 'permissions'));
    }

    /**
     * Update role permissions.
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $role->permissions()->sync($request->input('permissions', []));

        return redirect()
            ->route('admin.roles.index')
            ->with('success', 'Permissions updated');
    }
}
