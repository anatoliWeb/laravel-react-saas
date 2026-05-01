import { apiRequest } from './apiClient';

/**
 * Stats API service
 *
 * WHY:
 * We isolate API calls from components
 * so UI doesn't know about endpoints
 */
export function fetchStats() {
  return apiRequest('/stats');
}
