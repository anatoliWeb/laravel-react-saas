<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin Panel')</title>
    @vite(['resources/scss/app.scss', 'resources/js/app.js'])
</head>
<body>
<div class="admin-layout" data-admin-layout>
    @include('layouts.partials.navigation')

    <main class="admin-main">
        <div class="admin-content">
            @hasSection('breadcrumbs')
                @yield('breadcrumbs')
            @endif
            @yield('content')
        </div>
    </main>
</div>

@stack('scripts')
</body>
</html>
