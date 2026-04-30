@extends('layouts.app')

@section('title', 'Edit User')

@section('breadcrumbs')
    <x-breadcrumbs :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Users', 'url' => route('admin.users.index')],
        ['label' => 'Edit']
    ]" />
@endsection

@section('content')
    <header class="page-header">
        <div>
            <h1 class="page-title">Edit User</h1>
            <p class="page-subtitle">Update profile, role bindings, and direct permissions.</p>
        </div>
    </header>

    @if ($errors->any())
        <div class="c-alert c-alert--error">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('admin.users.update', $user->id) }}" class="c-form">
        @csrf
        @method('PUT')

        <section class="c-form__section">
            <h2 class="c-form__title">Basic Info</h2>

            <div class="c-form__grid">
                <div class="c-form__group">
                    <label for="name" class="c-form__label">Name</label>
                    <input id="name" type="text" name="name" value="{{ old('name', $user->name) }}" class="c-form__input">
                </div>

                <div class="c-form__group">
                    <label for="email" class="c-form__label">Email</label>
                    <input id="email" type="email" name="email" value="{{ old('email', $user->email) }}" class="c-form__input">
                </div>
            </div>
        </section>

        <section class="c-form__section">
            <h2 class="c-form__title">Roles</h2>
            <p class="c-form__hint">Assign global role presets for this user.</p>

            <div class="c-check-grid">
                @foreach($roles as $role)
                    <label class="c-check">
                        <input type="checkbox" name="roles[]" value="{{ $role->id }}" {{ $user->roles->contains($role->id) ? 'checked' : '' }}>
                        <span>{{ $role->name }}</span>
                    </label>
                @endforeach
            </div>
        </section>

        <section class="c-form__section">
            <h2 class="c-form__title">Direct Permissions</h2>
            <p class="c-form__hint">Fine-grained overrides beyond role inheritance.</p>

            <div class="c-check-grid">
                @foreach($permissions as $permission)
                    @php
                        $hasDirect = $user->permissions->contains($permission->id);
                        $hasViaRole = $user->hasPermission($permission->name);
                    @endphp

                    <label class="c-check">
                        <input type="checkbox" name="permissions[]" value="{{ $permission->id }}" {{ $hasDirect ? 'checked' : '' }}>
                        <span>{{ $permission->name }}</span>

                        @if($hasViaRole && !$hasDirect)
                            <small class="c-check__hint">(via role)</small>
                        @endif
                    </label>
                @endforeach
            </div>
        </section>

        <div class="c-form__actions">
            <button type="submit" class="c-btn c-btn--primary">Save Changes</button>
        </div>
    </form>
@endsection
