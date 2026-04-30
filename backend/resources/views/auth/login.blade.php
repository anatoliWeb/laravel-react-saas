<x-guest-layout>

    <div class="auth-card">
        <div class="auth-title">Login</div>

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <input type="email" name="email" placeholder="Email" class="auth-input">
            <input type="password" name="password" placeholder="Password" class="auth-input">

            <button class="auth-button">Login</button>
        </form>
    </div>

</x-guest-layout>
