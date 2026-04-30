@extends('layouts.app')

@section('content')

    <h1 class="page-title">Roles</h1>

    @if(session('success'))
        <div class="alert-success">{{ session('success') }}</div>
    @endif

    <table class="table">
        <thead>
        <tr>
            <th>Name</th>
            <th>Permissions</th>
            <th></th>
        </tr>
        </thead>

        <tbody>
        @foreach($roles as $role)
            <tr>
                <td>{{ $role->name }}</td>
                <td>{{ $role->permissions_count }}</td>
                <td>
                    <a href="{{ route('admin.roles.edit', $role->id) }}">
                        Edit
                    </a>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>

@endsection
