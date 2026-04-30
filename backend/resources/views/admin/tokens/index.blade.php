@extends('layouts.app')

@section('content')

    <h1 class="page-title">API Tokens</h1>

    {{-- Global success message --}}
    @if(session('success'))
        <div class="alert-success">
            {{ session('success') }}
        </div>
    @endif

    {{-- Validation errors --}}
    @if ($errors->any())
        <div class="auth-error">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    {{-- Show newly created token (only once) --}}
    @if(session('token'))
        <div class="alert-success">
            <div><strong>New Token (copy it now, you won't see it again):</strong></div>

            <div class="token-box">
                <span id="token-text">{{ session('token') }}</span>
                <button type="button" onclick="copyToken()">Copy</button>
            </div>
        </div>
    @endif

    {{-- Create token form --}}
    <form method="POST" action="{{ route('admin.tokens.store') }}" class="form-block">
        @csrf

        <input
            type="text"
            name="name"
            value="{{ old('name') }}"
            placeholder="Token name"
            class="auth-input"
        >

        {{-- Abilities --}}
        <div class="abilities">
            <label>
                <input type="checkbox" name="abilities[]" value="read"
                    {{ in_array('read', old('abilities', [])) ? 'checked' : '' }}>
                Read
            </label>

            <label>
                <input type="checkbox" name="abilities[]" value="write"
                    {{ in_array('write', old('abilities', [])) ? 'checked' : '' }}>
                Write
            </label>
        </div>

        <button class="auth-button">Create Token</button>
    </form>

    <br>

    {{-- Tokens table --}}
    <table class="table">
        <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created</th>
            <th></th>
        </tr>
        </thead>

        <tbody>
        @forelse ($tokens as $token)
            <tr>
                <td>{{ $token->id }}</td>
                <td>{{ $token->name }}</td>
                <td>{{ $token->created_at->format('Y-m-d H:i') }}</td>
                <td>
                    <form method="POST"
                          action="{{ route('admin.tokens.destroy', $token->id) }}"
                          onsubmit="return confirm('Delete this token?')">
                        @csrf
                        @method('DELETE')

                        <button type="submit" class="btn-danger">
                            Delete
                        </button>
                    </form>
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="4">No tokens found</td>
            </tr>
        @endforelse
        </tbody>
    </table>

@endsection

{{-- Minimal JS --}}
<script>
    function copyToken() {
        const text = document.getElementById('token-text').innerText;
        navigator.clipboard.writeText(text);

        alert('Token copied!');
    }
</script>
