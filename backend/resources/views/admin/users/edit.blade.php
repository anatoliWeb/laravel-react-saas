@extends('layouts.app')

@section('content')

    <h1 class="page-title">Edit User: {{ $user->name }}</h1>

    <form method="POST" action="{{ route('admin.users.update', $user->id) }}">
        @csrf
        @method('PUT')

        <div class="roles-grid">

            @foreach($roles as $role)
                <label class="role-item">
                    <input
                        type="checkbox"
                        name="roles[]"
                        value="{{ $role->id }}"
                        {{ $user->roles->contains($role->id) ? 'checked' : '' }}
                    >
                    {{ $role->name }}
                </label>
            @endforeach

        </div>

        <br>

        <button class="auth-button">Save</button>

    </form>

@endsection
