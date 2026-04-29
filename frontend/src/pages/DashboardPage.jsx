import { useEffect, useState } from 'react';
import { fetchStats } from '../services/apiClient.js';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  if (!stats) {
    return <p>Loading dashboard stats...</p>;
  }

  return (
    <section>
      <h2>Dashboard</h2>
      <ul>
        <li>Active users: {stats.activeUsers}</li>
        <li>Monthly revenue: {stats.monthlyRevenue}</li>
        <li>Server health: {stats.serverHealth}</li>
      </ul>
      {/* TODO: Replace with real stat cards and loading/error states. */}
    </section>
  );
}
