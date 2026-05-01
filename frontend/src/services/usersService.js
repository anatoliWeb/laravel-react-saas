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
