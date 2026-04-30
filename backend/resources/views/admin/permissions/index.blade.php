@extends('layouts.app')

@section('title', 'Permissions')

@section('breadcrumbs')
    <x-breadcrumbs :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Permissions']
    ]" />
@endsection

@section('content')
    <header class="page-header">
        <div>
            <h1 class="page-title">Permissions</h1>
            <p class="page-subtitle">Access control capabilities used by roles and users.</p>
        </div>

        <a href="{{ route('admin.permissions.create') }}" class="c-btn c-btn--primary">Add Permission</a>
    </header>

    <section class="c-table-wrap">
        <table class="c-table">
            <thead>
            <tr>
                <th>Name</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            @foreach($permissions as $permission)
                <tr>
                    <td>{{ $permission->name }}</td>
                    <td class="c-table__actions">
                        <a href="{{ route('admin.permissions.edit', $permission->id) }}" class="c-btn c-btn--ghost">Edit</a>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </section>
@endsection
