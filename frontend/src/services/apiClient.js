const API_BASE_URL = 'http://localhost:8080/api';

async function request(path) {
  // TODO: Add centralized error handling, retries, and auth token support.
  const response = await fetch(`${API_BASE_URL}${path}`);
  const payload = await response.json();
  return payload.data;
}

export function fetchUsers() {
  // TODO: Swap to axios if interceptors become necessary.
  return request('/users');
}

export function fetchStats() {
  return request('/stats');
}
