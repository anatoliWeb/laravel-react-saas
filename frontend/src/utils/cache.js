/**
 * Simple cache helper (localStorage)
 *
 * WHY:
 * Avoid unnecessary API calls and improve UX
 */

const CACHE_PREFIX = 'app_cache_';

/**
 * Save data with TTL
 */
export function setCache(key, data, ttlMs = 60000) {
    const payload = {
        data,
        expiry: Date.now() + ttlMs,
    };

    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(payload));
}

/**
 * Get cached data
 */
export function getCache(key) {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);

        if (Date.now() > parsed.expiry) {
            // WHY:
            // Expired entries are removed eagerly to prevent stale reads
            // and keep localStorage footprint bounded over time.
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }

        return parsed.data;
    } catch {
        return null;
    }
}
