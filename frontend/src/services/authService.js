import { apiRequest } from './apiClient';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api';

/**
 * Login user and get token
 */
export async function login(email, password) {
    const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    // Save token to localStorage
    if (data?.token) {
        localStorage.setItem('token', data.token);
    } else {
        throw new Error('No token returned from API');
    }

    return data;
}

/**
 * Logout user
 */
export function logout() {
    localStorage.removeItem('token');
}

/**
 * Check auth
 */
export function isAuthenticated() {
    return !!localStorage.getItem('token');
}
