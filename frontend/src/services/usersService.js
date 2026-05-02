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
  // WHY:
  // Backend contract expects normalized IDs/names payload prepared by page layer.
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateUser(userId, payload) {
  // WHY:
  // Keeping update transport centralized avoids endpoint drift across forms.
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
