import { apiRequest } from './apiClient';
import { getCache, setCache } from '../utils/cache';

const META_CACHE_KEY = 'app_meta';
const META_TTL_MS = 10 * 60 * 1000;

let inFlightMetaRequest = null;

async function requestMeta() {
  const response = await apiRequest('/meta');
  return response?.data || {};
}

async function refreshMetaInBackground() {
  if (inFlightMetaRequest) {
    return inFlightMetaRequest;
  }

  inFlightMetaRequest = requestMeta()
    .then((meta) => {
      setCache(META_CACHE_KEY, meta, META_TTL_MS);
      return meta;
    })
    .finally(() => {
      inFlightMetaRequest = null;
    });

  return inFlightMetaRequest;
}

export async function fetchMeta() {
  const cached = getCache(META_CACHE_KEY);

  if (cached) {
    // Stale-while-revalidate style: serve fast cache, refresh in background.
    refreshMetaInBackground().catch(() => {});
    return cached;
  }

  return refreshMetaInBackground();
}
