import { apiRequest } from './apiClient';

/**
 * Fetch users list
 *
 * WHY:
 * Centralized API layer for users module
 */
export function fetchUsers() {
  return apiRequest('/users');
}

export function createUser(payload) {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateUser(userId, payload) {
  return apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteUser(userId) {
  return apiRequest(`/users/${userId}`, {
    method: 'DELETE',
  });
}
