<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Auth</title>

    {{-- Main styles and scripts --}}
    @vite(['resources/scss/app.scss', 'resources/js/app.js'])
</head>
<body>

<div class="auth-wrapper">
    {{ $slot }}
</div>

</body>
</html>
