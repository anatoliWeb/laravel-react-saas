import { apiRequest } from './apiClient';

// Placeholder service for users endpoint.
export function fetchUsers() {
  return apiRequest('/users');
}
