import { apiRequest } from './apiClient';

// Placeholder service for dashboard stats endpoint.
export function fetchStats() {
  return apiRequest('/stats');
}
