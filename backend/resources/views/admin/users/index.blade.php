@extends('layouts.app')

@section('title', 'Users')

@section('breadcrumbs')
    <x-breadcrumbs :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Users']
    ]" />
@endsection

@section('content')
    <header class="page-header">
        <div>
            <h1 class="page-title">Users</h1>
            <p class="page-subtitle">Manage user accounts, roles, and access details.</p>
        </div>
    </header>

    <section class="c-table-wrap">
        <table class="c-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            @foreach ($users as $user)
                <tr>
                    <td>{{ $user->id }}</td>
                    <td>{{ $user->name }}</td>
                    <td class="c-table__muted">{{ $user->email }}</td>
                    <td>
                        @foreach($user->roles as $role)
                            <span class="c-badge">{{ $role }}</span>
                        @endforeach
                    </td>
                    <td class="c-table__actions">
                        <a href="{{ route('admin.users.edit', $user->id) }}" class="c-btn c-btn--ghost">Edit</a>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </section>
@endsection
