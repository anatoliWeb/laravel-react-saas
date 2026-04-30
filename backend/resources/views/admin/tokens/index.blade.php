@extends('layouts.app')

@section('content')

    <h1 class="page-title">API Tokens</h1>

    {{-- Success message --}}
    @if(session('success'))
        <div class="alert-success">
            {{ session('success') }}
        </div>
    @endif

    {{-- Create token --}}
    <form method="POST" action="{{ route('admin.tokens.store') }}">
        @csrf

        <input type="text" name="name" placeholder="Token name" class="auth-input">

        <button class="auth-button">Create Token</button>
    </form>

    <br>

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
        @foreach ($tokens as $token)
            <tr>
                <td>{{ $token->id }}</td>
                <td>{{ $token->name }}</td>
                <td>{{ $token->created_at }}</td>
                <td>
                    <form method="POST" action="{{ route('admin.tokens.destroy', $token->id) }}">
                        @csrf
                        @method('DELETE')

                        <button class="btn-danger">Delete</button>
                    </form>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>

@endsection
