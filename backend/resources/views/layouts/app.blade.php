<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Panel</title>

    @vite(['resources/scss/app.scss', 'resources/js/app.js'])
</head>
<body>

<div class="app">

    {{-- Sidebar --}}
    <aside class="sidebar">
        <div class="sidebar-logo">MyApp</div>

        <nav class="sidebar-menu">
            <a href="/admin">Dashboard</a>
            <a href="/admin/users">Users</a>
            <a href="/admin/tokens">Tokens</a>
        </nav>
    </aside>

    {{-- Main --}}
    <div class="main">

        {{-- Header --}}
        <header class="header">
            <div>Admin Panel</div>

            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit">Logout</button>
            </form>
        </header>

        {{-- Content --}}
        <main class="content">
            @yield('content')
        </main>

    </div>

</div>

</body>
</html>
