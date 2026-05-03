import { apiRequest } from './apiClient';

/**
 * Tokens API service.
 *
 * WHY:
 * Keeps token endpoints in one place so UI components stay focused on UX,
 * while request contracts can evolve without touching page logic.
 */
export function getTokens() {
  return apiRequest('/tokens')
    .then((response) => response?.data ?? [])
    .catch((error) => {
      throw error;
    });
}

export function createToken(payload) {
  return apiRequest('/tokens', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
    .then((response) => {
      // API may return plain token at root level or inside data envelope.
      if (response?.data) {
        return {
          ...response.data,
          token: response?.token ?? response?.data?.token ?? null,
        };
      }

      return response;
    })
    .catch((error) => {
      throw error;
    });
}

export function deleteToken(tokenId) {
  return apiRequest(`/tokens/${tokenId}`, {
    method: 'DELETE',
  })
    .then((response) => response?.data ?? response)
    .catch((error) => {
      throw error;
    });
}
