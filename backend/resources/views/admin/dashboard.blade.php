@extends('layouts.app')

@section('content')

    <div class="dashboard">

        <h1 class="page-title">Dashboard</h1>

        <div class="dashboard-grid">

            <div class="card">
                <div class="card-title">Users</div>
                <div class="card-value">2</div>
                <div class="card-desc">Total registered users</div>
            </div>

            <div class="card">
                <div class="card-title">Active</div>
                <div class="card-value">1</div>
                <div class="card-desc">Currently active users</div>
            </div>

            <div class="card">
                <div class="card-title">API Requests</div>
                <div class="card-value">128</div>
                <div class="card-desc">Last 24 hours</div>
            </div>

            <div class="card">
                <div class="card-title">System</div>
                <div class="card-value">OK</div>
                <div class="card-desc">All systems operational</div>
            </div>

        </div>

    </div>

@endsection
