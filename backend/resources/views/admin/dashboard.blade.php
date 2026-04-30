@extends('layouts.app')

@section('content')

    <h1 class="page-title">Dashboard</h1>

    <div class="dashboard-grid">

        <div class="card">
            <div class="card-title">Total Users</div>
            <div class="card-value">{{ $usersCount }}</div>
        </div>

        <div class="card">
            <div class="card-title">Admins</div>
            <div class="card-value">{{ $adminsCount }}</div>
        </div>

        <div class="card">
            <div class="card-title">Managers</div>
            <div class="card-value">{{ $managersCount }}</div>
        </div>

        <div class="card">
            <div class="card-title">API Tokens</div>
            <div class="card-value">{{ $tokensCount }}</div>
        </div>

        <div class="card">
            <div class="card-title">Users with Direct Permissions</div>
            <div class="card-value">{{ $usersWithDirectPermissions }}</div>
        </div>

    </div>

@endsection
