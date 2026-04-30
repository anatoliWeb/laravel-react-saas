@extends('layouts.app')

@section('content')

    <h1 class="page-title">Edit Role: {{ $role->name }}</h1>

    <form method="POST" action="{{ route('admin.roles.update', $role->id) }}">
        @csrf
        @method('PUT')

        <div class="permissions-grid">

            @foreach($permissions as $permission)
                <label class="permission-item">
                    <input
                        type="checkbox"
                        name="permissions[]"
                        value="{{ $permission->id }}"
                        {{ $role->permissions->contains($permission->id) ? 'checked' : '' }}
                    >

                    {{ $permission->name }}
                </label>
            @endforeach

        </div>

        <br>

        <button class="auth-button">Save</button>

    </form>

@endsection
