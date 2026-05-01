/**
 * Base API client.
 *
 * Centralized place for all HTTP requests.
 * Handles base URL, headers and errors.
 */

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Perform API request
 */
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token'); // later for auth

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // Try to parse error
    let errorMessage = `HTTP ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // ignore JSON parse error
    }

    throw new Error(errorMessage);
  }

  return response.json();
}