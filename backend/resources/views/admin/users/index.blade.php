@extends('layouts.app')

@section('content')

    <h1 class="page-title">Users</h1>

    <table class="table">
        <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
        </tr>
        </thead>

        <tbody>
        @foreach ($users as $user)
            <tr>
                <td>{{ $user->id }}</td>
                <td>{{ $user->name }}</td>
                <td>{{ $user->email }}</td>
                <td>
                    @foreach($user->roles as $role)
                        <span class="badge">{{ $role }}</span>
                    @endforeach
                </td>
                <td>
                    <a href="{{ route('admin.users.edit', $user->id) }}">
                        Edit
                    </a>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>

@endsection
