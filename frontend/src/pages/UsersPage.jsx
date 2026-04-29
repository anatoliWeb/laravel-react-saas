import { useEffect, useState } from 'react';
import { fetchUsers } from '../services/apiClient.js';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return (
    <section>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
      {/* TODO: Add pagination, filters, and empty state. */}
    </section>
  );
}
