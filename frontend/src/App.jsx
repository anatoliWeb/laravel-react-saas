import { useState } from 'react';
import DashboardPage from './pages/DashboardPage.jsx';
import UsersPage from './pages/UsersPage.jsx';

export default function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '24px' }}>
      <h1>Laravel + React SaaS Dashboard</h1>

      <nav style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button type="button" onClick={() => setPage('dashboard')}>Dashboard</button>
        <button type="button" onClick={() => setPage('users')}>Users</button>
      </nav>

      {page === 'dashboard' ? <DashboardPage /> : <UsersPage />}
    </main>
  );
}
